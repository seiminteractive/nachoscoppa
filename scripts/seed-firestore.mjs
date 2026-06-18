#!/usr/bin/env node
/**
 * Sube el contenido estático actual a Firestore para poblar las collections.
 *
 * Requisitos:
 *   1. `firebase login` (CLI instalada).
 *   2. Service account: descargar el JSON desde Firebase Console > Project Settings >
 *      Service accounts > "Generate new private key" y exportarlo como GOOGLE_APPLICATION_CREDENTIALS.
 *
 * Uso:
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json \
 *   FIREBASE_PROJECT_ID=tu-proyecto \
 *   node scripts/seed-firestore.mjs
 *
 * Las imágenes locales (en src/assets) NO se suben — el seed deja `cover`/`src`/`image`
 * vacíos para esos casos; los reemplazás desde el admin con el uploader.
 */

import { initializeApp, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_PROJECT_ID;
if (!projectId) {
  console.error("Falta FIREBASE_PROJECT_ID.");
  process.exit(1);
}

initializeApp({
  credential: process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? applicationDefault()
    : cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}")),
  projectId,
});

const db = getFirestore("nachoscoppa");

const tracks = [
  { id: "tango", title: "Tango", label: "Coppados", year: "2026", cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02cc5309e5a4f89fa27008b8eb", spotifyUrl: "https://open.spotify.com/track/1sxHf5IcNOzVurmkKAiCPn?si=8e1b3372e8c14a10" },
  { id: "summertime", title: "Summertime EP", label: "Elrow Limited", year: "2026", cover: "", spotifyUrl: "https://open.spotify.com/album/5xN03zaOEha6txKf3LtF9W" },
  { id: "bonny", title: "Bonny EP", label: "Moan", year: "2025", cover: "", spotifyUrl: "https://open.spotify.com/album/3OPciLP2bZnirWLYKzdwMU" },
  { id: "ilikeit", title: "I Like It EP", label: "Coppados", year: "2024", cover: "", spotifyUrl: "https://open.spotify.com/album/2dIx1ZqJVWdJg3KUWN62hB" },
  { id: "perc", title: "Percussive Series", label: "Criterio", year: "2025", cover: "", spotifyUrl: "" },
  { id: "show", title: "Show Me", label: "Deeperfect", year: "2025", cover: "", spotifyUrl: "https://open.spotify.com/album/1MKVHSuHcSnqsjneyAGnEC" },
  { id: "some", title: "Something EP", label: "Bamboleo", year: "2026", cover: "", spotifyUrl: "https://open.spotify.com/album/0WjQ7diJ4YGcYSP2SOIlwo" },
];

const featuredTrack = {
  title: "Tango",
  label: "Coppados",
  year: "2026",
  format: "Single · digital",
  cover: "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02cc5309e5a4f89fa27008b8eb",
  description: "Tango es una honra a la cultura Argentina y el último single de Nacho Scoppa en COPPADOS.",
  links: [
    { id: "spotify", label: "Escuchar en Spotify", icon: "simple-icons:spotify", href: "https://open.spotify.com/intl-es/track/1sxHf5IcNOzVurmkKAiCPn?si=8e1b3372e8c14a10", primary: true },
    { id: "beatport", label: "Comprar en Beatport", icon: "simple-icons:beatport", href: "https://www.beatport.com/es/track/tango/28458179", primary: false },
  ],
};

const labels = [
  { id: "criterio", name: "Criterio", src: "" },
  { id: "deep", name: "Deeperfect", src: "" },
  { id: "bamboleo", name: "Bamboleo", src: "" },
  { id: "coppados", name: "Coppados", src: "" },
  { id: "moan", name: "Moan", src: "" },
];

const pressNotes = [
  { id: "mixmag-it", title: "Mixmag Italia", kicker: "Portada digital · Italia", description: "Nacho Scoppa protagoniza la portada del digital magazine de Mixmag Italia.", url: "https://mixmagit.com/read/mixmagitalyade-con-nacho-scoppa-in-copertina-digital-magazine", image: "", imageAlt: "Portada digital de Mixmag Italia con Nacho Scoppa" },
  { id: "magnetic", title: "Magnetic Magazine", kicker: "Entrevista · Estados Unidos", description: "Una conversación sobre producción, cultura club y la visión creativa.", url: "https://magneticmag.com/2026/03/nacho-scoppa-interview/", image: "", imageAlt: "Artículo de Magnetic Magazine sobre Nacho Scoppa" },
];

const liveSets = [
  { id: "ls-metropolitano", title: "Nacho Scoppa Live @ Metropolitano, Rosario 07.06.2025", date: "7 jun 2025", venue: "Metropolitano", city: "Rosario, AR", detail: "Nacho Scoppa Live @ Metropolitano, Rosario — 07.06.2025.", extra: null, listenLabel: "Escuchar en SoundCloud", streamUrl: "https://soundcloud.com/nachoscoppaofficial/nacho-scoppa-live-metrpolitano-rosario-07062025", previewSrc: "" },
  { id: "ls-rio", title: "Río Electronic Music · Buenos Aires", date: "15 jun 2025", venue: "Río Electronic Music", city: "Buenos Aires, AR", detail: "Nacho Scoppa live @ Río Electronic Music, Buenos Aires — 15.06.2025.", extra: null, listenLabel: "Ver en YouTube", streamUrl: "https://www.youtube.com/watch?v=08lYFUwXb28", previewSrc: "" },
  { id: "ls-4get", title: "4GET · Estación Belgrano", date: "7 dic 2025", venue: "4GET", city: "Estación Belgrano, Santa Fe, AR", detail: "Nacho Scoppa Live @ 4GET Estación Belgrano, Santa Fe — 07.12.2025.", extra: null, listenLabel: "Ver en YouTube", streamUrl: "https://youtu.be/mHsk3idrQxU", previewSrc: "" },
];

const agendaEvents = [
  { id: "2026-04-03-buenos-aires", date: "2026-04-03", city: "Buenos Aires", country: "Argentina", countryCode: "AR", flagCode: "ar", lat: -34.6037, lon: -58.3816 },
  { id: "2026-04-05-barcelona", date: "2026-04-05", city: "Barcelona", country: "España", countryCode: "ES", flagCode: "es", lat: 41.3851, lon: 2.1734 },
  { id: "2026-04-10-milano", date: "2026-04-10", city: "Milano", country: "Italia", countryCode: "IT", flagCode: "it", lat: 45.4642, lon: 9.19 },
  { id: "2026-04-11-glasgow", date: "2026-04-11", city: "Glasgow", country: "Escocia", countryCode: "GB", flagCode: "gb-sct", lat: 55.8642, lon: -4.2518 },
  { id: "2026-04-17-asuncion", date: "2026-04-17", city: "Asunción", country: "Paraguay", countryCode: "PY", flagCode: "py", lat: -25.2637, lon: -57.5759 },
  { id: "2026-04-19-cordoba", date: "2026-04-19", city: "Córdoba", country: "Argentina", countryCode: "AR", flagCode: "ar", lat: -31.4201, lon: -64.1888 },
  { id: "2026-04-28-ibiza", date: "2026-04-28", city: "Ibiza", country: "España", countryCode: "ES", flagCode: "es", lat: 38.9067, lon: 1.4821 },
  { id: "2026-05-02-rimini", date: "2026-05-02", city: "Rimini", country: "Italia", countryCode: "IT", flagCode: "it", lat: 44.0603, lon: 12.5695 },
  { id: "2026-05-09-la-plata", date: "2026-05-09", city: "La Plata", country: "Argentina", countryCode: "AR", flagCode: "ar", lat: -34.9215, lon: -57.9544 },
  { id: "2026-05-16-santiago", date: "2026-05-16", city: "Santiago", country: "Chile", countryCode: "CL", flagCode: "cl", lat: -33.4489, lon: -70.6693 },
  { id: "2026-05-17-buenos-aires", date: "2026-05-17", city: "Buenos Aires", country: "Argentina", countryCode: "AR", flagCode: "ar", lat: -34.6037, lon: -58.3816 },
  { id: "2026-05-22-resistencia", date: "2026-05-22", city: "Resistencia", country: "Argentina", countryCode: "AR", flagCode: "ar", lat: -27.4512, lon: -58.9866 },
  { id: "2026-05-28-buenos-aires", date: "2026-05-28", city: "Buenos Aires", country: "Argentina", countryCode: "AR", flagCode: "ar", lat: -34.6037, lon: -58.3816 },
  { id: "2026-05-29-san-jose", date: "2026-05-29", city: "San José", country: "Costa Rica", countryCode: "CR", flagCode: "cr", lat: 9.9281, lon: -84.0907 },
  { id: "2026-05-31-san-francisco", date: "2026-05-31", city: "San Francisco", country: "Estados Unidos", countryCode: "US", flagCode: "us", lat: 37.7749, lon: -122.4194 },
  { id: "2026-06-04-lake-tahoe", date: "2026-06-04", city: "Lake Tahoe", country: "Estados Unidos", countryCode: "US", flagCode: "us", lat: 39.0968, lon: -120.0324 },
  { id: "2026-06-05-miami", date: "2026-06-05", city: "Miami", country: "Estados Unidos", countryCode: "US", flagCode: "us", lat: 25.7617, lon: -80.1918 },
  { id: "2026-06-06-dallas", date: "2026-06-06", city: "Dallas", country: "Estados Unidos", countryCode: "US", flagCode: "us", lat: 32.7767, lon: -96.797 },
  { id: "2026-06-07-los-angeles", date: "2026-06-07", city: "Los Angeles", country: "Estados Unidos", countryCode: "US", flagCode: "us", lat: 34.0522, lon: -118.2437 },
];

const siteStats = { countries: 27, monthlyListeners: 74, tracksCount: 26, sinceYear: 2014 };

async function seedCollection(name, items) {
  const batch = db.batch();
  items.forEach((item, i) => {
    const { id, ...rest } = item;
    batch.set(db.collection(name).doc(id), { ...rest, order: i });
  });
  await batch.commit();
  console.log(`✓ ${name}: ${items.length}`);
}

await seedCollection("tracks", tracks);
await db.doc("featuredTrack/main").set(featuredTrack);
console.log("✓ featuredTrack/main");
await seedCollection("labels", labels);
await seedCollection("pressNotes", pressNotes);
await seedCollection("liveSets", liveSets);

const batch = db.batch();
agendaEvents.forEach((e) => batch.set(db.collection("agendaEvents").doc(e.id), e));
await batch.commit();
console.log(`✓ agendaEvents: ${agendaEvents.length}`);

await db.doc("siteStats/main").set(siteStats);
console.log("✓ siteStats/main");

console.log("\nListo. Recordá subir las imágenes locales desde el admin (covers, logos, fotos de notas/sets).");
process.exit(0);
