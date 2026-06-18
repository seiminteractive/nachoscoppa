import {
  SITE_NAME,
  SITE_LOCALE,
  OG_IMAGE,
  OG_IMAGE_ALT,
  absoluteUrl,
} from "../config/seo";

function upsertMeta({ name, property, content }) {
  const selector = property
    ? `meta[property="${property}"]`
    : `meta[name="${name}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    if (property) el.setAttribute("property", property);
    if (name) el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/** @param {import('../config/seo').DEFAULT_SEO} seo */
export function applySeo(seo, jsonLd) {
  const url = absoluteUrl(seo.path);
  const { title, description } = seo;

  document.title = title;

  upsertMeta({ name: "description", content: description });
  upsertMeta({ name: "robots", content: seo.robots });
  upsertMeta({ name: "author", content: SITE_NAME });
  upsertMeta({ name: "application-name", content: SITE_NAME });

  upsertLink("canonical", url);

  upsertMeta({ property: "og:site_name", content: SITE_NAME });
  upsertMeta({
    property: "og:locale",
    content: SITE_LOCALE.replace("_", "-"),
  });
  upsertMeta({ property: "og:type", content: seo.ogType });
  upsertMeta({ property: "og:url", content: url });
  upsertMeta({ property: "og:title", content: title });
  upsertMeta({ property: "og:description", content: description });
  upsertMeta({ property: "og:image", content: OG_IMAGE });
  upsertMeta({ property: "og:image:alt", content: OG_IMAGE_ALT });

  upsertMeta({ name: "twitter:card", content: "summary_large_image" });
  upsertMeta({ name: "twitter:title", content: title });
  upsertMeta({ name: "twitter:description", content: description });
  upsertMeta({ name: "twitter:image", content: OG_IMAGE });
  upsertMeta({ name: "twitter:image:alt", content: OG_IMAGE_ALT });

  if (jsonLd) {
    upsertJsonLd("seo-jsonld", jsonLd);
  }
}
