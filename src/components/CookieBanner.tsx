import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { STORAGE_KEY, isConsentRequiredRegion, loadGoogleAds, saveConsent, updateConsent } from "@/lib/google-ads";
import { Button } from "@/components/ui/button";

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
    <div role="dialog" aria-label="Podešavanja kolačića" className="exit-cookie-banner fixed left-3 right-3 md:right-auto bottom-3 z-[60] max-w-sm rounded-lg border border-border bg-background p-4 text-foreground">
      <p className="text-sm">
        Koristimo Google Ads kolačiće da merimo porudžbine sa oglasa i prikazujemo relevantnije oglase. Izbor možete promeniti bilo kad.{" "}
        <Link to="/privatnost" className="underline">Više o privatnosti</Link>
      </p>
      <div className="mt-3 flex gap-2">
        <Button className="flex-1 h-10" onClick={() => choose("granted")}>Prihvati</Button>
        <Button variant="outline" className="flex-1 h-10" onClick={() => choose("denied")}>Odbij</Button>
      </div>
    </div>
  );
}

export function openCookieSettings() {
  window.dispatchEvent(new Event("exit-cookie-settings"));
}
