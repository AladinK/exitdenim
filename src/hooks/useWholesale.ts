import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/useAuth";
import { getWholesalePrices } from "@/lib/products.functions";

/**
 * Veleprodajna cena artikla za odobrenog partnera. Javni katalog je namerno ne sadrži
 * (gost je ne sme videti), pa se učitava posebnim, zaštićenim pozivom: jedan zahtev za
 * ceo katalog, koji dele sve kartice. Vraća undefined dok cena nije poznata.
 */
export function useWholesalePrice(productId: string, enabled: boolean): number | undefined {
  const { user } = useAuth();
  const fetchPrices = useServerFn(getWholesalePrices);
  const { data } = useQuery({
    queryKey: ["wholesale-prices", user?.id],
    queryFn: () => fetchPrices({}),
    enabled: enabled && Boolean(user),
    staleTime: 5 * 60_000,
    retry: false,
  });
  return data?.[productId];
}

/** „€24" kada je cena poznata, „€—" dok se učitava (umesto „€NaN"). */
export const euro = (value: number | undefined, digits = 0) =>
  value == null || Number.isNaN(value) ? "€—" : `€${value.toFixed(digits)}`;
