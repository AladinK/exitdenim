import { useState } from "react";
import { Button } from "@/components/ui/button";
import { recommendSize, type Preference } from "@/lib/size-calc";

export function SizeAdvisor({ sizes, onPick }: { sizes: string[]; onPick: (s: string) => void }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [pref, setPref] = useState<Preference>("usko");
  const h = Number(height), w = Number(weight);
  const valid = h >= 140 && h <= 220 && w >= 40 && w <= 180;
  const size = valid ? recommendSize(h, w, pref, sizes) : null;

  const input = "w-full border border-border bg-background px-3 py-2.5 text-sm rounded-[var(--radius-action,8px)]";
  return (
    <details className="mt-4 text-[12px]">
      <summary className="cursor-pointer list-none text-muted-foreground hover:text-foreground underline underline-offset-4">
        Niste sigurni koji broj? Preporuka po visini i težini
      </summary>
      <div className="mt-3 text-[13px]">
        <div className="grid grid-cols-2 gap-2">
          <input className={input} inputMode="numeric" placeholder="Visina (cm)" aria-label="Visina u cm" value={height} onChange={(e) => setHeight(e.target.value.replace(/\D/g, ""))} />
          <input className={input} inputMode="numeric" placeholder="Težina (kg)" aria-label="Težina u kg" value={weight} onChange={(e) => setWeight(e.target.value.replace(/\D/g, ""))} />
          <select className={`${input} col-span-2`} aria-label="Kako želite da sede" value={pref} onChange={(e) => setPref(e.target.value as Preference)}>
            <option value="usko">Da sede uže</option>
            <option value="komotno">Da sede komotnije</option>
          </select>
        </div>
        {valid && (
          <div className="mt-3" aria-live="polite">
            {size ? (
              <>
                <p className="font-medium">Preporučujemo broj {size}.</p>
                <Button type="button" variant="outline" className="mt-2 w-full py-2.5" onClick={() => onPick(size)}>Izaberi broj {size}</Button>
              </>
            ) : <p className="text-muted-foreground">Taj broj trenutno nemamo — pozovite 065 317 6716.</p>}
          </div>
        )}
      </div>
    </details>
  );
}
