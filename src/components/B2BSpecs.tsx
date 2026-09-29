import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getB2BSpecs, requestSample } from "@/lib/b2b-specs.functions";

type Specs = Awaited<ReturnType<typeof getB2BSpecs>>;

export function B2BSpecs({ productId, sizes }: { productId: string; sizes: string[] }) {
  const fetchSpecs = useServerFn(getB2BSpecs);
  const sample = useServerFn(requestSample);
  const [specs, setSpecs] = useState<Specs>(null);
  const [size, setSize] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | string>("idle");

  useEffect(() => {
    fetchSpecs({ data: { productId } }).then(setSpecs).catch(() => setSpecs(null));
  }, [productId]); // eslint-disable-line

  const pack = specs?.pack_distribution && Object.entries(specs.pack_distribution).filter(([, n]) => Number(n) > 0);
  const packTotal = pack ? pack.reduce((a, [, n]) => a + Number(n), 0) : 0;

  const send = async () => {
    if (!size) return;
    setState("busy");
    try { await sample({ data: { productId, size } }); setState("done"); }
    catch (e) { setState((e as Error).message || "Greška"); }
  };

  return (
    <div className="border border-border">
      <div className="px-5 py-3 border-b border-border eyebrow">B2B specifikacija</div>
      <dl className="grid grid-cols-3 text-sm">
        <Cell label="Težina" value={specs?.fabric_oz ? `${specs.fabric_oz} oz` : "—"} />
        <Cell label="Sastav" value={specs?.composition || "—"} />
        <Cell label="Pranje" value={specs?.wash_finish || "—"} />
      </dl>

      <div className="px-5 py-4 border-t border-border">
        <div className="eyebrow">Paket serija {specs ? `· MOQ ${specs.moq}` : ""}</div>
        {pack && pack.length ? (
          <>
            <div className="mt-3 flex flex-wrap gap-2">
              {pack.map(([s, n]) => (
                <span key={s} className="border border-border px-2.5 py-1 text-xs tabular-nums">{n}×{s}</span>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Ukupno {packTotal} kom po paketu</div>
          </>
        ) : (
          <div className="mt-2 text-xs text-muted-foreground">Raspodela veličina uskoro.</div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-border">
        <div className="eyebrow">Poruči uzorak</div>
        <p className="mt-1 text-xs text-muted-foreground">1 test komad pre porudžbine cele serije.</p>
        {state === "done" ? (
          <div className="mt-3 text-sm font-medium">Zahtev poslat — javljamo ti se.</div>
        ) : (
          <div className="mt-3 flex gap-2">
            <select value={size} onChange={(e) => setSize(e.target.value)} className="border border-input bg-background px-3 py-2 text-sm" aria-label="Veličina uzorka">
              <option value="">Veličina</option>
              {sizes.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button type="button" onClick={send} disabled={!size || state === "busy"} className="btn-outline flex-1 disabled:opacity-40">
              {state === "busy" ? "Šaljem…" : "Zatraži uzorak"}
            </button>
          </div>
        )}
        {state !== "idle" && state !== "busy" && state !== "done" && <div className="mt-2 text-xs text-destructive">{state}</div>}
      </div>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-3 border-r border-border last:border-r-0">
      <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}
