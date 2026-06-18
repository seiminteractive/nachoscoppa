import { socialLinks } from "../data/socialLinks";

export const SITE_URL = "https://nachoscoppa.com";
export const SITE_NAME = "Nacho Scoppa";
export const SITE_LOCALE = "es_AR";
export const OG_IMAGE = `${SITE_URL}/og-image.webp`;
export const OG_IMAGE_ALT =
  "Nacho Scoppa — DJ y productor argentino, sitio oficial";

export const DEFAULT_SEO = {
  title: "Nacho Scoppa — DJ y Productor | Sitio Oficial",
  description:
    "Sitio oficial de Nacho Scoppa: música, lanzamientos, sets en vivo, agenda y booking. DJ y productor argentino con presencia internacional. Escuchá Tango, Summertime y más.",
  path: "/",
  ogType: "website",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
};

export const ROUTE_SEO = {
  home: DEFAULT_SEO,
  agenda: {
    title: "Agenda — Nacho Scoppa | Próximos shows y fechas",
    description:
      "Agenda oficial de Nacho Scoppa: próximos shows, fechas y presentaciones en Argentina y el mundo. Consultá la programación y contacto para booking.",
    path: "/agenda",
    ogType: "website",
    robots: DEFAULT_SEO.robots,
  },
};

export function getSeoForRoute(routeName) {
  return ROUTE_SEO[routeName] ?? DEFAULT_SEO;
}

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function getJsonLdGraph(routeName) {
  const sameAs = socialLinks.map((l) => l.href).filter(Boolean);

  const graph = [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DEFAULT_SEO.description,
      inLanguage: "es",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE_NAME,
      url: SITE_URL,
      image: OG_IMAGE,
      jobTitle: "DJ y productor musical",
      nationality: { "@type": "Country", name: "Argentina" },
      homeLocation: {
        "@type": "Place",
        name: "Rosario, Argentina",
      },
      genre: ["House", "Tech House", "Música electrónica"],
      sameAs,
    },
    {
      "@type": "MusicGroup",
      "@id": `${SITE_URL}/#music-group`,
      name: SITE_NAME,
      url: SITE_URL,
      image: OG_IMAGE,
      genre: ["House", "Tech House"],
      sameAs,
    },
    {
      "@type": "MusicRecording",
      "@id": `${SITE_URL}/#release-tango`,
      name: "Tango",
      url: "https://open.spotify.com/track/1sxHf5IcNOzVurmkKAiCPn",
      byArtist: { "@id": `${SITE_URL}/#person` },
      datePublished: "2026",
      inLanguage: "es",
    },
  ];

  if (routeName === "agenda") {
    graph.push({
      "@type": "WebPage",
      "@id": `${SITE_URL}/agenda#webpage`,
      url: `${SITE_URL}/agenda`,
      name: ROUTE_SEO.agenda.title,
      description: ROUTE_SEO.agenda.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      inLanguage: "es",
      breadcrumb: { "@id": `${SITE_URL}/agenda#breadcrumb` },
    });
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/agenda#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: SITE_URL,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Agenda",
          item: `${SITE_URL}/agenda`,
        },
      ],
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
