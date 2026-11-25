// Fotografije i video brenda žive u public/media/ i služe se sa istog domena kao sajt.
// Spisak izvora je u scripts/media.manifest.json (npm run assets:pull).
const file = (name: string) => `/media/${name}`;

export const MEDIA = {
  logo: file("exit-logo.webp"),
  logoPng: file("exit-logo.png"),
  seal: file("exit-seal.png"),
  coverSeated: file("exit-seated-cover.webp"),
  coverPortraitMobile: file("exit-portrait-cover-mobile.webp"),
  coverOriginal: file("exit-original-cover.webp"),
  coverOriginalMobile: file("exit-original-cover-mobile.webp"),
  cityDenim: file("exit-city-denim.webp"),
  studioDenim: file("exit-studio-denim.webp"),
  straightDenim: file("exit-straight-denim.webp"),
  studioCargo: file("exit-studio-cargo.webp"),
  studioPair: file("exit-studio-pair.webp"),
  laserVideo: file("jeanologia_laser_finishing.mp4"),
  laserPoster: file("jeanologia_laser_poster.jpg"),
} as const;

/** Apsolutna adresa za Open Graph / strukturirane podatke. */
export const absoluteMedia = (pathname: string, base = "https://exitdenim.shop") =>
  /^https?:\/\//i.test(pathname) ? pathname : `${base}${pathname}`;
