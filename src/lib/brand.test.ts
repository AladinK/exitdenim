import { expect, it } from "vitest";
import { BRAND, MANUFACTURING, SIZE_EXCHANGE, organizationSchema } from "./brand";

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
it("records the brand founding year without assigning a legal incorporation date", () => {
  expect(BRAND.foundedYear).toBe(1991);
  expect(organizationSchema).not.toHaveProperty("foundingDate");
});
it("uses the confirmed Novi Pazar address", () => {
  expect(organizationSchema.address.streetAddress).toBe("Save Kovačevića 31b");
  expect(organizationSchema.address.addressLocality).toBe("Novi Pazar");
});
it("records average monthly jeans production", () => {
  expect(MANUFACTURING.averageMonthlyJeans).toBe(5000);
});
it("records the confirmed employee count", () => {
  expect(MANUFACTURING.employees).toBe(35);
});
it("records EU and former Yugoslav export markets without changing retail delivery scope", () => {
  expect(MANUFACTURING.exportMarkets).toEqual(["Sve zemlje Evropske unije", "Zemlje bivše Jugoslavije"]);
  expect(organizationSchema.areaServed.name).toBe("Srbija");
});