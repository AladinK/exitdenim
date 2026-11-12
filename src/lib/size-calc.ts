// EXIT fit rule from the owner: 180–185 cm, 94 kg → 34 (uže), 36 (komotnije).
export const SIZE_STEPS = ["31", "32", "33", "34", "36", "38", "40"];

export type Preference = "usko" | "komotno";

export function recommendSize(heightCm: number, weightKg: number, pref: Preference, available: string[] = SIZE_STEPS) {
  let i = weightKg < 72 ? 0 : weightKg < 79 ? 1 : weightKg < 86 ? 2 : weightKg < 97 ? 3 : weightKg < 105 ? 4 : weightKg < 114 ? 5 : 6;
  if (heightCm >= 192) i -= 1; // taller at same weight → slimmer waist
  if (heightCm <= 168) i += 1;
  if (pref === "komotno") i += 1;
  i = Math.max(0, Math.min(SIZE_STEPS.length - 1, i));
  const size = SIZE_STEPS[i];
  if (available.includes(size)) return size;
  return SIZE_STEPS.slice(i).find((s) => available.includes(s)) ?? null;
}
