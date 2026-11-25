import { useState } from "react";
import { BRAND } from "@/lib/brand";
import { recommendSize, type Preference } from "@/lib/size-calc";

export function SizeAdvisor({ sizes, onPick }: { sizes: string[]; onPick: (s: string) => void }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [pref, setPref] = useState<Preference>("usko");
  const h = Number(height);
  const w = Number(weight);
  const valid = h >= 140 && h <= 220 && w >= 40 && w <= 180;
  const size = valid ? recommendSize(h, w, pref, sizes) : null;

  return (
    <details>
      <summary className="inline-flex min-h-11 items-center text-ink-2 underline decoration-1 underline-offset-4 hover:text-foreground">
        Niste sigurni koji broj? Preporuka po visini i težini
      </summary>
      <div className="mt-2 mb-3 grid grid-cols-2 gap-2">
        <input className="input" inputMode="numeric" placeholder="Visina (cm)" aria-label="Visina u cm" value={height} onChange={(e) => setHeight(e.target.value.replace(/\D/g, ""))} />
        <input className="input" inputMode="numeric" placeholder="Težina (kg)" aria-label="Težina u kg" value={weight} onChange={(e) => setWeight(e.target.value.replace(/\D/g, ""))} />
        <select className="input col-span-2" aria-label="Kako želite da sede" value={pref} onChange={(e) => setPref(e.target.value as Preference)}>
          <option value="usko">Da sede uže</option>
          <option value="komotno">Da sede komotnije</option>
        </select>
        {valid && (
          <div className="col-span-2" aria-live="polite">
            {size ? (
              <button type="button" className="btn-dark w-full" onClick={() => onPick(size)}>
                Preporučujemo broj {size} · izaberite ga
              </button>
            ) : (
              <p className="text-ink-2">
                Taj broj trenutno nemamo. Pozovite <a className="underline underline-offset-4" href={`tel:${BRAND.phone}`}>{BRAND.phoneLabel}</a>.
              </p>
            )}
          </div>
        )}
      </div>
    </details>
  );
}
