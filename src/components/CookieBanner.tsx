import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { STORAGE_KEY, isConsentRequiredRegion, loadGoogleAds, saveConsent, updateConsent } from "@/lib/google-ads";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    void loadGoogleAds();
    if (localStorage.getItem(STORAGE_KEY) === null) {
      void isConsentRequiredRegion().then((req) => {
        if (req && localStorage.getItem(STORAGE_KEY) === null) setOpen(true);
      });
    }
    const openSettings = () => setOpen(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "granted" || e.newValue === "denied")) {
        updateConsent(e.newValue);
        if (e.newValue === "granted") void loadGoogleAds();
      }
    };
    window.addEventListener("exit-cookie-settings", openSettings);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("exit-cookie-settings", openSettings);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (!open) return null;
  const choose = (d: "granted" | "denied") => { saveConsent(d); setOpen(false); };

  return (
    <div role="dialog" aria-label="Podešavanja kolačića" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-lg border border-border bg-background p-4 text-foreground shadow-lg">
      <p className="text-sm">
        Koristimo Google Ads kolačiće da merimo porudžbine sa oglasa i prikazujemo relevantnije oglase. Izbor možete promeniti bilo kad.{" "}
        <Link to="/privatnost" className="underline">Više o privatnosti</Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button className="btn-primary" onClick={() => choose("granted")}>Prihvati</button>
        <button className="btn-outline" onClick={() => choose("denied")}>Odbij</button>
      </div>
    </div>
  );
}

export function openCookieSettings() {
  window.dispatchEvent(new Event("exit-cookie-settings"));
}
