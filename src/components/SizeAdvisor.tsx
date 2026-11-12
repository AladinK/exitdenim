import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { adviseSize, type SizeAdvice } from "@/lib/size-advisor.functions";

export function SizeAdvisor({ fit, sizes, onPick }: { fit: string; sizes: string[]; onPick: (s: string) => void }) {
  const advise = useServerFn(adviseSize);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [usual, setUsual] = useState("");
  const [pref, setPref] = useState<"usko" | "standardno" | "komotno">("standardno");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<SizeAdvice | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRes(null);
    try {
      setRes(await advise({ data: { heightCm: Number(height), weightKg: Number(weight), usualSize: usual || undefined, fit, preference: pref, sizes } }));
    } catch {
      setRes({ size: null, alternative: null, reason: "", error: "Proverite unete podatke (visina 140–220 cm, težina 40–180 kg)." });
    } finally {
      setLoading(false);
    }
  };

  const input = "w-full border border-border bg-background px-3 py-2.5 text-sm rounded-[var(--radius-action,8px)]";
  return (
    <details className="mt-4 text-[12px]">
      <summary className="cursor-pointer list-none text-muted-foreground hover:text-foreground underline underline-offset-4">
        Niste sigurni koji broj? Preporuka po visini i težini
      </summary>
    <form onSubmit={submit} className="mt-3 text-[13px]">
      <div className="mt-3 grid grid-cols-2 gap-2">
        <input className={input} inputMode="numeric" required placeholder="Visina (cm)" aria-label="Visina u cm" value={height} onChange={(e) => setHeight(e.target.value.replace(/\D/g, ""))} />
        <input className={input} inputMode="numeric" required placeholder="Težina (kg)" aria-label="Težina u kg" value={weight} onChange={(e) => setWeight(e.target.value.replace(/\D/g, ""))} />
        <input className={`${input} col-span-2`} placeholder="Broj koji obično nosite (nije obavezno)" aria-label="Broj koji obično nosite" maxLength={20} value={usual} onChange={(e) => setUsual(e.target.value)} />
        <select className={`${input} col-span-2`} aria-label="Kako želite da sede" value={pref} onChange={(e) => setPref(e.target.value as typeof pref)}>
          <option value="usko">Volim da sede uže</option>
          <option value="standardno">Standardno</option>
          <option value="komotno">Volim komotnije</option>
        </select>
      </div>
      <Button type="submit" variant="outline" disabled={loading} className="mt-3 w-full py-2.5">{loading ? "Računam…" : "Preporuči broj"}</Button>
      {res?.error && <p role="alert" className="mt-3 text-muted-foreground">{res.error}</p>}
      {res && !res.error && (
        <div className="mt-3" aria-live="polite">
          {res.size ? (
            <p className="font-medium">Preporučujemo broj <span className="text-primary">{res.size}</span>{res.alternative ? ` (ili ${res.alternative})` : ""}.</p>
          ) : <p className="font-medium">Nismo sigurni — pozovite 065 317 6716.</p>}
          {res.reason && <p className="mt-1 text-muted-foreground">{res.reason}</p>}
          {res.size && <Button type="button" className="mt-3 w-full py-2.5" onClick={() => onPick(res.size!)}>Izaberi broj {res.size}</Button>}
        </div>
      )}
    </form>
    </details>
  );
}
