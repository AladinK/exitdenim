import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { ecommerce } from "@/lib/analytics";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { CartLine, CartTotals, gaItems } from "@/components/CartParts";

export function CartDrawer() {
  const { items, count, total, open, setOpen } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="menu-panel w-full max-w-[440px] border-l border-r-0 border-line sm:max-w-[440px]">
        <div className="menu-panel__head">
          <SheetTitle className="text-lg font-bold tracking-normal">
            Korpa{count > 0 ? ` (${count})` : ""}
          </SheetTitle>
          <SheetDescription className="sr-only">Artikli koje ste izabrali i ukupan iznos.</SheetDescription>
        </div>

        {items.length === 0 ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <ShoppingBag aria-hidden="true" className="mx-auto h-8 w-8 text-ink-3" strokeWidth={1.4} />
              <p className="mt-4 text-xl font-bold tracking-tight">Korpa je prazna</p>
              <p className="mx-auto mt-2 max-w-xs text-[0.9375rem] text-ink-2">Izaberite model i veličinu, a platićete tek kada paket stigne.</p>
              <Link to="/katalog" onClick={() => setOpen(false)} className="btn-primary mt-6">
                Pogledajte modele
              </Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto overscroll-contain">
              {items.map((it) => (
                <CartLine key={`${it.productId}-${it.size}`} item={it} />
              ))}
            </ul>
            <div className="menu-panel__foot grid gap-4">
              <CartTotals allowPromoRemoval />
              <div className="grid gap-2">
                <Link
                  to="/kasa"
                  onClick={() => {
                    ecommerce.beginCheckout(gaItems(items), total);
                    setOpen(false);
                  }}
                  className="btn-primary w-full"
                >
                  Nastavi na porudžbinu
                </Link>
                <button type="button" onClick={() => setOpen(false)} className="btn-outline w-full">
                  Nastavi kupovinu
                </button>
              </div>
              <p>Plaćate pouzećem, pri preuzimanju paketa</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
