import { expect, it } from "vitest";
import { BRAND, SIZE_EXCHANGE, organizationSchema } from "./brand";

it("preserves the supplied tax identifier", () => {
  expect(BRAND.taxId).toBe("101792816");
  expect(organizationSchema.taxID).toBe("101792816");
});
it("preserves the supplied registration number including its leading zero", () => {
  expect(BRAND.registrationId).toBe("07717741");
  expect(organizationSchema.identifier.value).toBe("07717741");
});
it("uses the supplied business email", () => {
  expect(organizationSchema.email).toBe("office@bennelijeans.com");
});
it("allows size exchange within one week", () => {
  expect(SIZE_EXCHANGE.days).toBe(7);
});
it("makes EXIT cover size-exchange costs", () => {
  expect(SIZE_EXCHANGE.customerCost).toBe(0);
});