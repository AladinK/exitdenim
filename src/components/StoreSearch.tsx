import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function StoreSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <button type="button" className="icon-button" aria-label="Pretraga" title="Pretraga" onClick={() => setOpen(true)}>
        <Search aria-hidden="true" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="search-dialog w-[calc(100%-32px)]">
          <DialogTitle className="text-lg font-bold tracking-normal">Pretraga modela</DialogTitle>
          <DialogDescription className="sr-only">Pretražite katalog po nazivu, šifri ili materijalu.</DialogDescription>
          <form
            role="search"
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(false);
              navigate({ to: "/katalog", search: { q: query.trim() || undefined } });
            }}
          >
            <input
              autoFocus
              type="search"
              enterKeyHint="search"
              aria-label="Pretraga modela"
              placeholder="Model, šifra ili materijal"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input min-w-0 flex-1"
            />
            <Button type="submit" size="icon" className="h-12 w-12" aria-label="Pretraži">
              <Search aria-hidden="true" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
