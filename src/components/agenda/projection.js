/**
 * Proyección del mapa (MapSVG world.svg — Mercator).
 *
 * El SVG que usamos trae su `geoViewBox` en el atributo raíz:
 *   mapsvg:geoViewBox="-169.110266 83.600842 190.486279 -58.508473"
 *   width="1009.6727" height="665.96301"
 *
 * Las formas están dibujadas con proyección Mercator, así que para
 * mapear coordenadas (lon, lat) -> (x, y) en el mismo viewBox hay que
 * aplicar la misma proyección.
 */

export const MAP_VIEWBOX = {
  width: 1009.6727,
  height: 665.96301,
  lonMin: -169.110266,
  lonMax: 190.486279,
  latMax: 83.600842,
  latMin: -58.508473,
};

function mercatorY(latDeg) {
  const lat = (latDeg * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + lat / 2));
}

const MERC_TOP = mercatorY(MAP_VIEWBOX.latMax);
const MERC_BOTTOM = mercatorY(MAP_VIEWBOX.latMin);
const MERC_RANGE = MERC_TOP - MERC_BOTTOM;
const LON_RANGE = MAP_VIEWBOX.lonMax - MAP_VIEWBOX.lonMin;

/**
 * Convierte (lon, lat) en coords del viewBox del SVG.
 */
export function project(lon, lat) {
  const x = ((lon - MAP_VIEWBOX.lonMin) / LON_RANGE) * MAP_VIEWBOX.width;
  const y = ((MERC_TOP - mercatorY(lat)) / MERC_RANGE) * MAP_VIEWBOX.height;
  return { x, y };
}
