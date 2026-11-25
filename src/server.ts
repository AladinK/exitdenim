import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

const errorPage = () =>
  new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });

// h3 guta greške bačene u handleru i vraća običan 500 sa telom
// {"unhandled":true,"message":"HTTPError"}; try/catch ih zato ne vidi.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return errorPage();
}

// Stranica može tokom renderovanja da zatraži drugi status (npr. 503 kada baza ne
// odgovara) zaglavljem x-exit-status; ovde se on primenjuje i zaglavlje uklanja.
const STATUS_HEADER = "x-exit-status";
function applyRequestedStatus(response: Response): Response {
  const wanted = response.headers.get(STATUS_HEADER);
  if (!wanted) return response;
  const headers = new Headers(response.headers);
  headers.delete(STATUS_HEADER);
  const status = Number(wanted);
  const valid = Number.isInteger(status) && status >= 400 && status <= 599;
  return new Response(response.body, {
    status: valid && response.status === 200 ? status : response.status,
    statusText: response.statusText,
    headers,
  });
}

// Stare adrese slika sa Lovable CDN-a (/__l5e/assets-v1/<id>/<fajl>) i dalje žive u
// Google pretrazi, deljenim linkovima i ponekom zapisu u bazi. Iste slike su sada u
// /media/<fajl>, pa se stare adrese trajno preusmeravaju tamo.
const LEGACY_ASSET = /^\/__l5e\/assets-v1\/[^/]+\/([A-Za-z0-9][A-Za-z0-9._-]*)$/;
function redirectLegacyAsset(request: Request): Response | undefined {
  const match = LEGACY_ASSET.exec(new URL(request.url).pathname);
  if (!match) return undefined;
  return new Response(null, {
    status: 301,
    headers: { location: `/media/${match[1]}`, "cache-control": "public, max-age=86400" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const legacy = redirectLegacyAsset(request);
    if (legacy) return legacy;
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return applyRequestedStatus(await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return errorPage();
    }
  },
};
