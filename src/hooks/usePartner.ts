import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/hooks/useAuth";
import { getMyProfile } from "@/lib/orders.functions";
import { getWholesalePrices } from "@/lib/products.functions";

/**
 * Stanje B2B naloga prijavljenog korisnika i, za odobrene partnere, veleprodajne cene.
 * Gost ne šalje nijedan zahtev.
 */
export function usePartner() {
  const { user } = useAuth();
  const fetchProfile = useServerFn(getMyProfile);
  const fetchPrices = useServerFn(getWholesalePrices);

  const profile = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: () => fetchProfile({}),
    enabled: Boolean(user),
    staleTime: 5 * 60_000,
    retry: false,
  });
  const approved = profile.data?.profile?.status === "approved";
  const isAdmin = Boolean(profile.data?.isAdmin);

  const prices = useQuery({
    queryKey: ["wholesale-prices", user?.id],
    queryFn: () => fetchPrices({}),
    enabled: Boolean(user) && (approved || isAdmin),
    staleTime: 5 * 60_000,
    retry: false,
  });

  return { approved, isAdmin, wholesale: prices.data ?? {} };
}
