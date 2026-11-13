// General fit guidance, not measurements or promises for an individual SKU.
const FIT_GUIDANCE: Record<string, string> = {
  Slim: "Slim prati liniju noge i odgovara onima koji vole užu siluetu. Ako imate jače butine, uporedite ga sa Regular Slim ili Relaxed krojem. Kombinujte ga sa jednostavnim patikama ili užim čizmama.",
  "Regular Slim": "Regular Slim ostavlja više prostora u butini od Slim kroja, a sužava se prema dnu. Razmotrite ga za standardnu ili atletsku građu kada želite urednu, ne previše usku nogavicu. Ide uz košulju, majicu i patike.",
  Relaxed: "Relaxed je opušteniji kroz butinu i nogavicu. Razmotrite ga ako imate jače butine ili ne volite pripijene pantalone. Šira nogavica se lako kombinuje sa krupnijim patikama.",
  Bootcut: "Bootcut se blago širi od kolena prema dnu. Otvor nogavice daje prostor za čizme ili patike sa debljim đonom. Proverite dužinu kako porub ne bi dodirivao pod.",
  Flare: "Flare ima izraženije širenje nogavice od kolena nego Bootcut. Pogodan je kada želite naglašenu siluetu uz čizme ili krupnije patike. Izbor veličine i dužine proverite na konkretnom modelu.",
  Cropped: "Cropped označava skraćenu nogavicu, a ne širinu kroja. Koliko će nogavica otkriti članak zavisi od vaše visine i dužine modela. Kombinujte ga sa niskim patikama i proverite unutrašnju dužinu nogavice.",
  Cargo: "Cargo označava pantalone sa bočnim džepovima, ne jednu univerzalnu širinu kroja. Proverite opis i mere konkretnog modela. Za ležernu kombinaciju nosite ih uz majicu, duks i patike.",
};

export function fitGuidance(fit?: string | null) {
  return fit ? FIT_GUIDANCE[fit] : undefined;
}