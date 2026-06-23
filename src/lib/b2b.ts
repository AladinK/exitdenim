import { useEffect, useState } from "react";

const KEY = "exit_b2b_approved";

export function useB2BAccess() {
  const [approved, setApproved] = useState(false);
  useEffect(() => {
    setApproved(typeof window !== "undefined" && localStorage.getItem(KEY) === "1");
  }, []);
  return {
    approved,
    grant: () => {
      localStorage.setItem(KEY, "1");
      setApproved(true);
    },
    revoke: () => {
      localStorage.removeItem(KEY);
      setApproved(false);
    },
  };
}

const ORDER_KEY = "exit_b2b_order";

export type OrderLine = {
  sku: string;
  name: string;
  sizes: Record<string, number>;
};

export function getOrder(): OrderLine[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
  } catch {
    return [];
  }
}
export function saveOrder(lines: OrderLine[]) {
  localStorage.setItem(ORDER_KEY, JSON.stringify(lines));
}
