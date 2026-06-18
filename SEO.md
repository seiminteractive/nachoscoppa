# SEO — nachoscoppa.com

## Qué incluye el sitio

| Elemento | Ubicación |
|----------|-----------|
| Meta title / description | `index.html` (fallback) + `src/config/seo.js` (por ruta) |
| Open Graph / Twitter Cards | `src/utils/applySeo.js` |
| Canonical y robots | Actualización en cada navegación (`src/router/index.js`) |
| JSON-LD (Schema.org) | `src/config/seo.js` → Person, WebSite, MusicGroup, Tango, breadcrumbs en `/agenda` |
| `robots.txt` | `public/robots.txt` |
| `sitemap.xml` | `public/sitemap.xml` |
| Imagen social | `public/og-image.webp` → `https://nachoscoppa.com/og-image.webp` |
| Favicon | `public/favicon.png` |

## Rutas indexables

- `https://nachoscoppa.com/` — home
- `https://nachoscoppa.com/agenda` — agenda

## Después del deploy

1. [Google Search Console](https://search.google.com/search-console): agregar propiedad `nachoscoppa.com`
2. Enviar sitemap: `https://nachoscoppa.com/sitemap.xml`
3. Probar vista previa: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/), [Twitter Card Validator](https://cards-dev.twitter.com/validator)
4. Rich Results: [Schema Markup Validator](https://validator.schema.org/)

## Editar textos SEO

Cambiar títulos/descripciones en `src/config/seo.js` (`DEFAULT_SEO` y `ROUTE_SEO.agenda`).

## Notas

- Los anchors (`#tracks`, `#dj-info`, etc.) no son URLs separadas en el sitemap; Google indexa la home.
- Para cambiar la imagen de redes sociales, reemplazar `public/og-image.webp` (recomendado 1200×630 aprox.).
