// Google Ads tag + consent (basic blocking route with regional banner).
export const AW_ID = "AW-18523972417";
export const PURCHASE_SEND_TO = "AW-18523972417/13WfCNzRvqIdEMHG9YBF";
export const STORAGE_KEY = "cookie_consent";
export const CONSENT_RECORD_KEY = "cookie_consent_record";
export const CONSENT_NOTICE_VERSION = "2026-10-19";
const CONSENT_COUNTRIES = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","IS","LI","NO","GB","CH","CA"];
let consentRegion: Promise<boolean> | undefined;

export function isConsentRequiredRegion(): Promise<boolean> {
  return (consentRegion ??= (async () => {
    try {
      const res = await fetch("/cdn-cgi/trace", { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return true;
      const country = (await res.text()).match(/^loc=([A-Z0-9]{2})$/m)?.[1];
      if (!country || country === "XX" || country === "T1") return true;
      return CONSENT_COUNTRIES.includes(country);
    } catch {
      return true;
    }
  })());
}

export async function canTrackAds(): Promise<boolean> {
  const choice = localStorage.getItem(STORAGE_KEY);
  if (choice !== null) return choice === "granted";
  const required = await isConsentRequiredRegion();
  const latest = localStorage.getItem(STORAGE_KEY);
  return latest !== null ? latest === "granted" : !required;
}

export function updateConsent(decision: "granted" | "denied") {
  if (decision === "denied") window.gtag?.("set", "user_data", null);
  window.gtag?.("consent", "update", { ad_storage: decision, ad_user_data: decision, ad_personalization: decision });
}

export function saveConsent(decision: "granted" | "denied") {
  localStorage.setItem(STORAGE_KEY, decision);
  localStorage.setItem(CONSENT_RECORD_KEY, JSON.stringify({ decision, at: new Date().toISOString(), notice: CONSENT_NOTICE_VERSION }));
  updateConsent(decision);
  if (decision === "granted") void loadGoogleAds();
  window.dispatchEvent(new Event("exit-consent-change"));
}

export async function loadGoogleAds() {
  const allowed = await canTrackAds();
  if (!allowed) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { (window.dataLayer as unknown[]).push(arguments); };
  updateConsent("granted");
  if (document.querySelector("script[data-google-ads]")) return;
  window.gtag("set", "developer_id.dZjgwMW", true);
  window.gtag("js", new Date());
  window.gtag("config", AW_ID);
  const s = document.createElement("script");
  s.src = `https://www.googletagmanager.com/gtag/js?id=${AW_ID}`;
  s.async = true;
  s.dataset.googleAds = "";
  document.head.appendChild(s);
}

export async function reportPurchaseConversion(orderId: string, value: number) {
  await loadGoogleAds();
  if (await canTrackAds()) {
    window.gtag?.("event", "conversion", { send_to: PURCHASE_SEND_TO, value, currency: "RSD", transaction_id: orderId });
  }
}
