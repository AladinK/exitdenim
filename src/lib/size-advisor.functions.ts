import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  heightCm: z.number().int().min(140).max(220),
  weightKg: z.number().int().min(40).max(180),
  usualSize: z.string().max(20).optional(),
  fit: z.string().max(40),
  preference: z.enum(["usko", "standardno", "komotno"]),
  sizes: z.array(z.string().max(4)).max(12),
});

export type SizeAdvice = { size: string | null; alternative: string | null; reason: string; error?: string };

export const adviseSize = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<SizeAdvice> => {
    const { generateResponse, GatewayError } = await import("@lovable.dev/ai-gateway");
    const prompt = `Ti si savetnik za veličine muških farmerki EXIT (Srbija). Tabela (broj: obim struka cm / EU pantalone): 31: 79–81/46, 32: 81–84/48, 33: 84–86/48-50, 34: 86–89/50, 36: 91–94/52, 38: 97–99/54, 40: 102–104/56. Materijal 98% pamuk 2% elastin, 12oz (blago rastegljiv).
Kupac: visina ${data.heightCm} cm, težina ${data.weightKg} kg, obično nosi: ${data.usualSize || "ne zna"}, kroj modela: ${data.fit}, želi da sedi: ${data.preference}.
Dostupne veličine: ${data.sizes.join(", ")}. Izaberi isključivo iz dostupnih.
Odgovori SAMO JSON: {"size":"32","alternative":"33 ili null","reason":"jedna-dve kratke rečenice na srpskom, latinica, persiranje"}`;
    try {
      const res = await generateResponse({ model: "openai/gpt-6-astra", input: prompt });
      const r = res as unknown as { output_text?: string; output?: { content?: { type: string; text?: string }[] }[] };
      const text = r.output_text ?? r.output?.flatMap((o) => o.content ?? []).filter((c) => c.type === "output_text").map((c) => c.text).join("") ?? "";
      const json = JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1));
      const size = data.sizes.includes(String(json.size)) ? String(json.size) : null;
      const alt = json.alternative && data.sizes.includes(String(json.alternative)) ? String(json.alternative) : null;
      return { size, alternative: alt, reason: String(json.reason ?? "").slice(0, 400) };
    } catch (e) {
      console.error("size advisor", e instanceof GatewayError ? e.code : e);
      return { size: null, alternative: null, reason: "", error: "Savetnik trenutno nije dostupan. Pozovite 065 317 6716 i pomoći ćemo." };
    }
  });
