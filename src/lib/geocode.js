// Geocodificación con Nominatim (OpenStreetMap). Uso liviano desde el panel admin.
// Devuelve lat/lon + código de país ISO-2 para derivar countryCode y flagCode.
const ENDPOINT = "https://nominatim.openstreetmap.org/search";

/**
 * Resuelve "ciudad, país" a coordenadas y código de país.
 * @param {string} city
 * @param {string} country
 * @returns {Promise<{ lat: number, lon: number, countryCode: string, flagCode: string, displayName: string }>}
 */
export async function geocodePlace(city, country) {
  const query = [city, country].map((p) => (p || "").trim()).filter(Boolean).join(", ");
  if (!query) throw new Error("Completá ciudad y país para ubicar la fecha.");

  const url = `${ENDPOINT}?q=${encodeURIComponent(query)}&format=jsonv2&limit=1&addressdetails=1`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`No se pudo geolocalizar (HTTP ${res.status}).`);

  const data = await res.json();
  const hit = Array.isArray(data) ? data[0] : null;
  if (!hit) throw new Error(`No se encontró "${query}". Revisá la ciudad y el país.`);

  const cc = (hit.address?.country_code || "").toUpperCase();
  if (!cc) throw new Error("No se pudo determinar el país de esa ubicación.");

  return {
    lat: Number(hit.lat),
    lon: Number(hit.lon),
    countryCode: cc,
    flagCode: cc.toLowerCase(),
    displayName: hit.display_name || query,
  };
}
