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
    id: "2026-06-12-egipto",
    date: "2026-06-12",
    city: "Egipto",
    country: "Egipto",
    countryCode: "EG",
    flagCode: "eg",
    lat: 30.0444,
    lon: 31.2357,
  },
  {
    id: "2026-06-13-scheveningen",
    date: "2026-06-13",
    city: "Scheveningen",
    country: "Países Bajos",
    countryCode: "NL",
    flagCode: "nl",
    lat: 52.108,
    lon: 4.2731,
  },
  {
    id: "2026-06-14-varese",
    date: "2026-06-14",
    city: "Varese",
    country: "Italia",
    countryCode: "IT",
    flagCode: "it",
    lat: 45.8206,
    lon: 8.8251,
  },
  {
    id: "2026-06-16-barcelona",
    date: "2026-06-16",
    city: "Barcelona",
    country: "España",
    countryCode: "ES",
    flagCode: "es",
    lat: 41.3851,
    lon: 2.1734,
  },
  {
    id: "2026-06-20-cuneo",
    date: "2026-06-20",
    city: "Cuneo",
    country: "Italia",
    countryCode: "IT",
    flagCode: "it",
    lat: 44.3845,
    lon: 7.5426,
  },
  {
    id: "2026-06-21-tenerife",
    date: "2026-06-21",
    city: "Tenerife",
    country: "España",
    countryCode: "ES",
    flagCode: "es",
    lat: 28.2916,
    lon: -16.6291,
  },
  {
    id: "2026-06-27-ibiza",
    date: "2026-06-27",
    city: "Ibiza",
    country: "España",
    countryCode: "ES",
    flagCode: "es",
    lat: 38.9067,
    lon: 1.4206,
  },
  {
    id: "2026-06-28-monza",
    date: "2026-06-28",
    city: "Monza",
    country: "Italia",
    countryCode: "IT",
    flagCode: "it",
    lat: 45.5845,
    lon: 9.2744,
  },
  {
    id: "2026-07-03-nottingham",
    date: "2026-07-03",
    city: "Nottingham",
    country: "Reino Unido",
    countryCode: "GB",
    flagCode: "gb",
    lat: 52.9548,
    lon: -1.1581,
  },
  {
    id: "2026-07-04-bilbao",
    date: "2026-07-04",
    city: "Bilbao",
    country: "España",
    countryCode: "ES",
    flagCode: "es",
    lat: 43.263,
    lon: -2.935,
  },
  {
    id: "2026-07-11-hembrugterrein",
    date: "2026-07-11",
    city: "Hembrugterrein",
    country: "Países Bajos",
    countryCode: "NL",
    flagCode: "nl",
    lat: 52.4314,
    lon: 4.82,
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
