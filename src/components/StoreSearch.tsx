import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function StoreSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  return <>
    <Button variant="fashion" className="exit-search-trigger" aria-label="Otvori pretragu" title="Pretraga" onClick={() => setOpen(true)}><span className="hidden xl:inline">Pretraga</span><Search /></Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="storefront exit-search-dialog w-[calc(100%-32px)] rounded-lg shadow-none">
        <DialogTitle>Pretraga modela</DialogTitle>
        <DialogDescription className="sr-only">Pretražite postojeći katalog.</DialogDescription>
        <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); setOpen(false); navigate({ to: "/katalog", search: { q: query.trim() } }); }}>
          <input autoFocus aria-label="Pretraga modela" placeholder="Model, šifra ili materijal" value={query} onChange={(e) => setQuery(e.target.value)} className="min-w-0 flex-1 border border-input rounded-md px-3 py-3 text-sm bg-background" />
          <Button type="submit" size="icon" className="h-12 w-12" aria-label="Pretraži"><Search /></Button>
        </form>
      </DialogContent>
    </Dialog>
  </>;
}