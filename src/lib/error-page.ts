// Rezervna stranica koju server šalje kada ni sama aplikacija ne može da se prikaže.
// Čist HTML bez spoljnih fajlova, sa kontaktom za poručivanje.
export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="sr-Latn">
  <head>
    <meta charset="utf-8" />
    <title>EXIT Denim — stranica se nije učitala</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <style>
      body { font: 16px/1.55 "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif; background: #fbfaf7; color: #171a2b; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 24px; }
      main { max-width: 28rem; width: 100%; text-align: center; }
      .brand { font-weight: 800; letter-spacing: .04em; font-size: 14px; }
      h1 { font-size: 28px; line-height: 1.1; letter-spacing: -.02em; margin: 24px 0 12px; }
      p { color: #4c5063; margin: 0 0 24px; }
      .actions { display: grid; gap: 8px; }
      a, button { display: block; padding: 14px 20px; border-radius: 8px; font: inherit; font-weight: 600; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #749d02; color: #14200a; }
      .secondary { background: transparent; color: #171a2b; border-color: rgba(23, 26, 43, .28); }
    </style>
  </head>
  <body>
    <main>
      <div class="brand">EXIT DENIM</div>
      <h1>Stranica se nije učitala</h1>
      <p>Greška je na našoj strani. Pokušajte ponovo za koji trenutak. Ako želite da poručite odmah, pišite nam ili pozovite.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Pokušajte ponovo</button>
        <a class="secondary" href="https://wa.me/381653176716">Poručite preko WhatsApp-a</a>
        <a class="secondary" href="tel:+381653176716">Pozovite +381 65 317 6716</a>
        <a class="secondary" href="/">Nazad na početnu</a>
      </div>
    </main>
  </body>
</html>`;
}
