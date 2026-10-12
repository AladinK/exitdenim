// Display-only "before discount" price: current price shown as 40% off.
export const DISCOUNT_PCT = 40;
export const oldPrice = (retail: number) => Math.round(retail / (1 - DISCOUNT_PCT / 100) / 10) * 10;
