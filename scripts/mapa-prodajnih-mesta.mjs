// Pokretanje (jednom, kad treba nova mapa): npm i --no-save world-atlas topojson-client d3-geo && node scripts/mapa-prodajnih-mesta.mjs
// Pravi obris regiona (Srbija, Kosovo, BiH, Crna Gora bez unutrašnjih granica) i
// okolne zemlje za mapu prodajnih mesta. Izlaz: TS fajl sa putanjama i parametrima
// Mercator projekcije, da sajt sam računa položaj grada iz geografske širine/dužine.
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const topo = require("world-atlas/countries-10m.json");
const { feature, merge } = require("topojson-client");
const { geoMercator, geoPath } = require("d3-geo");

const W = 800, H = 680, PAD = 18;
const REGION = new Set(["Serbia", "Kosovo", "Bosnia and Herz.", "Montenegro"]);
const CONTEXT = new Set(["Croatia", "Hungary", "Romania", "Bulgaria", "Macedonia", "Albania", "Slovenia", "Greece", "Italy"]);
const geoms = topo.objects.countries.geometries;
const region = merge(topo, geoms.filter((g) => REGION.has(g.properties.name)));
const context = merge(topo, geoms.filter((g) => CONTEXT.has(g.properties.name)));

const projection = geoMercator().fitExtent([[PAD, PAD], [W - PAD, H - PAD]], region);
projection.clipExtent([[0, 0], [W, H]]);
const path = geoPath(projection).digits(1);
const regionPath = path(region);
const contextPath = path(context);
const [tx, ty] = projection.translate();
const out = `// Napravljeno skriptom (Natural Earth 1:10m preko world-atlas, d3-geo Mercator).
// Region je spojen bez unutrašnjih granica; okolne zemlje su samo pozadina.
export const MAP_WIDTH = ${W};
export const MAP_HEIGHT = ${H};
const SCALE = ${projection.scale().toFixed(4)};
const TX = ${tx.toFixed(4)};
const TY = ${ty.toFixed(4)};

/** Geografska dužina/širina → tačka na mapi (isti Mercator kao putanje ispod). */
export function projectToMap(lon: number, lat: number): [number, number] {
  const lambda = (lon * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  return [TX + SCALE * lambda, TY - SCALE * Math.log(Math.tan(Math.PI / 4 + phi / 2))];
}

export const REGION_PATH = ${JSON.stringify(regionPath)};
export const CONTEXT_PATH = ${JSON.stringify(contextPath)};
`;
fs.writeFileSync(new URL("../src/lib/prodajna-mesta-mapa.ts", import.meta.url), out);
console.log("region", regionPath.length, "context", contextPath.length, "scale", projection.scale().toFixed(1));
