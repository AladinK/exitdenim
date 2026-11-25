/** Cena u dinarima, uvek u istom obliku: 5.990 RSD */
export const formatRsd = (value: number | string) =>
  `${Number(value).toLocaleString("sr-RS", { maximumFractionDigits: 0 })} RSD`;

export const formatEur = (value: number | string) =>
  `${Number(value).toLocaleString("sr-RS", { maximumFractionDigits: 0 })} €`;

/** Veličine poređane brojčano (31, 32, ... 40), slovne na kraju. */
export const sortSizes = (sizes: string[]) =>
  [...sizes].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
