// Gradovi u kojima EXIT farmerke prodaju butici ili predstavnici (spisak od vlasnika,
// 26.11.2026). Koordinate su centri mesta (GeoNames / Wikipedia). Novi grad se dodaje
// samo ovde: mapa sama računa položaj iz geografske širine i dužine.

export type Country = "Srbija" | "Bosna i Hercegovina" | "Crna Gora";

export type Place = { name: string; lat: number; lon: number };

export const HEADQUARTERS: Place & { label: string } = {
  name: "Novi Pazar",
  label: "Sedište i proizvodnja",
  lat: 43.1367,
  lon: 20.5122,
};

export const PLACES: Record<Country, Place[]> = {
  Srbija: [
    { name: "Aranđelovac", lat: 44.3069, lon: 20.56 },
    { name: "Arilje", lat: 43.7531, lon: 20.0956 },
    { name: "Bajina Bašta", lat: 43.9708, lon: 19.5675 },
    { name: "Bačka Palanka", lat: 45.2497, lon: 19.3966 },
    { name: "Bačka Topola", lat: 45.8152, lon: 19.6318 },
    { name: "Bor", lat: 44.0749, lon: 22.0959 },
    { name: "Brus", lat: 43.3836, lon: 21.0331 },
    { name: "Ivanjica", lat: 43.5803, lon: 20.2311 },
    { name: "Jagodina", lat: 43.9771, lon: 21.2612 },
    { name: "Kragujevac", lat: 44.0167, lon: 20.9167 },
    { name: "Kuršumlija", lat: 43.1383, lon: 21.2734 },
    { name: "Lajkovac", lat: 44.3694, lon: 20.1653 },
    { name: "Leskovac", lat: 42.9981, lon: 21.9461 },
    { name: "Loznica", lat: 44.5338, lon: 19.2236 },
    { name: "Ljubovija", lat: 44.1894, lon: 19.3767 },
    { name: "Negotin", lat: 44.2264, lon: 22.5308 },
    { name: "Niš", lat: 43.3247, lon: 21.9033 },
    { name: "Odžaci", lat: 45.5067, lon: 19.2611 },
    { name: "Petrovac na Mlavi", lat: 44.3769, lon: 21.4192 },
    { name: "Pirot", lat: 43.1531, lon: 22.5861 },
    { name: "Priboj", lat: 43.5831, lon: 19.5252 },
    { name: "Sjenica", lat: 43.2731, lon: 19.9994 },
    { name: "Smederevska Palanka", lat: 44.3655, lon: 20.9589 },
    { name: "Surdulica", lat: 42.6906, lon: 22.1708 },
    { name: "Šid", lat: 45.1283, lon: 19.2264 },
    { name: "Ub", lat: 44.4561, lon: 20.0739 },
    { name: "Valjevo", lat: 44.2751, lon: 19.8982 },
    { name: "Velika Plana", lat: 44.3339, lon: 21.0768 },
    { name: "Veliki Crljeni", lat: 44.4672, lon: 20.2839 },
    { name: "Vranje", lat: 42.5514, lon: 21.9003 },
    { name: "Vrčin", lat: 44.6685, lon: 20.5933 },
    { name: "Zaječar", lat: 43.9036, lon: 22.2641 },
  ],
  "Bosna i Hercegovina": [
    { name: "Banja Luka", lat: 44.7784, lon: 17.1939 },
    { name: "Bijeljina", lat: 44.7587, lon: 19.2144 },
    { name: "Bileća", lat: 42.8764, lon: 18.4297 },
    { name: "Bratunac", lat: 44.1846, lon: 19.3309 },
    { name: "Brčko", lat: 44.87, lon: 18.8101 },
    { name: "Čapljina", lat: 43.1214, lon: 17.6844 },
    { name: "Doboj", lat: 44.7318, lon: 18.087 },
    { name: "Foča", lat: 43.5065, lon: 18.7785 },
    { name: "Gradiška", lat: 45.1448, lon: 17.2545 },
    { name: "Grude", lat: 43.3721, lon: 17.4145 },
    { name: "Ljubuški", lat: 43.1969, lon: 17.545 },
    { name: "Posušje", lat: 43.4728, lon: 17.3262 },
    { name: "Prijedor", lat: 44.9799, lon: 16.714 },
    { name: "Prnjavor", lat: 44.8702, lon: 17.6626 },
    { name: "Sokolac", lat: 43.9382, lon: 18.8008 },
    { name: "Široki Brijeg", lat: 43.3829, lon: 17.5942 },
    { name: "Zvornik", lat: 44.386, lon: 19.1025 },
  ],
  "Crna Gora": [
    { name: "Bar", lat: 42.0937, lon: 19.0984 },
    { name: "Berane", lat: 42.8425, lon: 19.8733 },
    { name: "Bijelo Polje", lat: 43.0383, lon: 19.7476 },
    { name: "Danilovgrad", lat: 42.5538, lon: 19.1461 },
    { name: "Mojkovac", lat: 42.9604, lon: 19.5833 },
    { name: "Nikšić", lat: 42.7731, lon: 18.9445 },
    { name: "Pljevlja", lat: 43.3567, lon: 19.3584 },
    { name: "Podgorica", lat: 42.4411, lon: 19.2636 },
    { name: "Rožaje", lat: 42.833, lon: 20.1665 },
    { name: "Ulcinj", lat: 41.9294, lon: 19.2244 },
  ],
};

export const PLACE_COUNT = Object.values(PLACES).reduce((sum, list) => sum + list.length, 0);
