/**
 * Agenda data source.
 *
 * - `countryCode` es ISO 3166-1 alpha-2 y coincide con el `id` del path del
 *   país en `src/assets/world.svg` (MapSVG). Se usa para resaltar el país en
 *   el mapa y como clave de filtrado.
 * - `flagCode` es el código que consume `flag-icons` (en minúsculas).
 *   Permite subdivisiones (por ejemplo `gb-sct` para Escocia).
 * - `lat/lon` ubican el pin sobre el mapa (ciudad, no país).
 */

export const EVENTS = [
  {
    id: "2026-04-03-buenos-aires",
    date: "2026-04-03",
    city: "Buenos Aires",
    country: "Argentina",
    countryCode: "AR",
    flagCode: "ar",
    lat: -34.6037,
    lon: -58.3816,
  },
  {
    id: "2026-04-05-barcelona",
    date: "2026-04-05",
    city: "Barcelona",
    country: "España",
    countryCode: "ES",
    flagCode: "es",
    lat: 41.3851,
    lon: 2.1734,
  },
  {
    id: "2026-04-10-milano",
    date: "2026-04-10",
    city: "Milano",
    country: "Italia",
    countryCode: "IT",
    flagCode: "it",
    lat: 45.4642,
    lon: 9.19,
  },
  {
    id: "2026-04-11-glasgow",
    date: "2026-04-11",
    city: "Glasgow",
    country: "Escocia",
    countryCode: "GB",
    flagCode: "gb-sct",
    lat: 55.8642,
    lon: -4.2518,
  },
  {
    id: "2026-04-17-asuncion",
    date: "2026-04-17",
    city: "Asunción",
    country: "Paraguay",
    countryCode: "PY",
    flagCode: "py",
    lat: -25.2637,
    lon: -57.5759,
  },
  {
    id: "2026-04-19-cordoba",
    date: "2026-04-19",
    city: "Córdoba",
    country: "Argentina",
    countryCode: "AR",
    flagCode: "ar",
    lat: -31.4201,
    lon: -64.1888,
  },
  {
    id: "2026-04-28-ibiza",
    date: "2026-04-28",
    city: "Ibiza",
    country: "España",
    countryCode: "ES",
    flagCode: "es",
    lat: 38.9067,
    lon: 1.4821,
  },
  {
    id: "2026-05-02-rimini",
    date: "2026-05-02",
    city: "Rimini",
    country: "Italia",
    countryCode: "IT",
    flagCode: "it",
    lat: 44.0603,
    lon: 12.5695,
  },
  {
    id: "2026-05-09-la-plata",
    date: "2026-05-09",
    city: "La Plata",
    country: "Argentina",
    countryCode: "AR",
    flagCode: "ar",
    lat: -34.9215,
    lon: -57.9544,
  },
  {
    id: "2026-05-16-santiago",
    date: "2026-05-16",
    city: "Santiago",
    country: "Chile",
    countryCode: "CL",
    flagCode: "cl",
    lat: -33.4489,
    lon: -70.6693,
  },
  {
    id: "2026-05-17-buenos-aires",
    date: "2026-05-17",
    city: "Buenos Aires",
    country: "Argentina",
    countryCode: "AR",
    flagCode: "ar",
    lat: -34.6037,
    lon: -58.3816,
  },
  {
    id: "2026-05-22-resistencia",
    date: "2026-05-22",
    city: "Resistencia",
    country: "Argentina",
    countryCode: "AR",
    flagCode: "ar",
    lat: -27.4512,
    lon: -58.9866,
  },
  {
    id: "2026-05-28-buenos-aires",
    date: "2026-05-28",
    city: "Buenos Aires",
    country: "Argentina",
    countryCode: "AR",
    flagCode: "ar",
    lat: -34.6037,
    lon: -58.3816,
  },
  {
    id: "2026-05-29-san-jose",
    date: "2026-05-29",
    city: "San José",
    country: "Costa Rica",
    countryCode: "CR",
    flagCode: "cr",
    lat: 9.9281,
    lon: -84.0907,
  },
  {
    id: "2026-05-31-san-francisco",
    date: "2026-05-31",
    city: "San Francisco",
    country: "Estados Unidos",
    countryCode: "US",
    flagCode: "us",
    lat: 37.7749,
    lon: -122.4194,
  },
  {
    id: "2026-06-04-lake-tahoe",
    date: "2026-06-04",
    city: "Lake Tahoe",
    country: "Estados Unidos",
    countryCode: "US",
    flagCode: "us",
    lat: 39.0968,
    lon: -120.0324,
  },
  {
    id: "2026-06-05-miami",
    date: "2026-06-05",
    city: "Miami",
    country: "Estados Unidos",
    countryCode: "US",
    flagCode: "us",
    lat: 25.7617,
    lon: -80.1918,
  },
  {
    id: "2026-06-06-dallas",
    date: "2026-06-06",
    city: "Dallas",
    country: "Estados Unidos",
    countryCode: "US",
    flagCode: "us",
    lat: 32.7767,
    lon: -96.797,
  },
  {
    id: "2026-06-07-los-angeles",
    date: "2026-06-07",
    city: "Los Angeles",
    country: "Estados Unidos",
    countryCode: "US",
    flagCode: "us",
    lat: 34.0522,
    lon: -118.2437,
  },
];

/**
 * Agrupa eventos por `countryCode` y devuelve un array con el nombre visible
 * + cantidad + coordenadas promedio (para un pin "bandera-por-país" si lo
 * necesitáramos). Usamos el primer evento para fijar el nombre visible.
 */
export function getCountriesFromEvents(events) {
  const map = new Map();
  for (const ev of events) {
    const existing = map.get(ev.countryCode);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(ev.countryCode, {
        countryCode: ev.countryCode,
        country: ev.country,
        count: 1,
      });
    }
  }
  return Array.from(map.values());
}
