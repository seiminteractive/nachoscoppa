#!/usr/bin/env node
/**
 * Actualiza public/data/instagram-posts.json y guarda miniaturas en public/media/instagram/
 * (así el navegador no pide las URLs de fbcdn, que suelen bloquearse fuera de Instagram).
 *
 *   npm run sync:instagram
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USER = process.env.INSTAGRAM_USER || "nachoscoppa";
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "data", "instagram-posts.json");
const MEDIA_DIR = path.join(ROOT, "public", "media", "instagram");
const API = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(USER)}`;

let raw;
try {
  raw = execFileSync(
    "curl",
    [
      "-sL",
      "-A",
      "Instagram 219.0.0.12.117 Android",
      "-H",
      "X-IG-App-ID: 936619743392459",
      API,
    ],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
  );
} catch (e) {
  console.error("curl falló (¿instalado?):", e.message);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch {
  console.error("Respuesta no JSON (¿bloqueo / login?). Primeros 200 chars:\n", raw.slice(0, 200));
  process.exit(1);
}

const edges = data?.data?.user?.edge_owner_to_timeline_media?.edges ?? [];

await fsPromises.mkdir(path.dirname(OUT), { recursive: true });
await fsPromises.mkdir(MEDIA_DIR, { recursive: true });

const posts = [];

for (const { node } of edges) {
  const shortcode = node.shortcode;
  const remoteUrl = node.display_url || node.thumbnail_src || "";
  let image = remoteUrl;

  if (remoteUrl) {
    const dest = path.join(MEDIA_DIR, `${shortcode}.jpg`);
    try {
      execFileSync(
        "curl",
        [
          "-sLf",
          "--max-time",
          "45",
          "-A",
          "Instagram 219.0.0.12.117 Android",
          "-e",
          "https://www.instagram.com/",
          remoteUrl,
          "-o",
          dest,
        ],
        { maxBuffer: 1024 * 1024 },
      );
      const st = fs.statSync(dest);
      if (st.size > 800) {
        image = `/media/instagram/${shortcode}.jpg`;
      } else {
        fs.unlinkSync(dest);
      }
    } catch {
      /* dejamos URL remota como respaldo */
    }
  }

  posts.push({
    shortcode,
    url: `https://www.instagram.com/p/${shortcode}/`,
    image,
  });
}

const payload = {
  username: USER,
  profileUrl: `https://www.instagram.com/${USER}/`,
  fetchedAt: new Date().toISOString(),
  posts,
};

await fsPromises.writeFile(OUT, JSON.stringify(payload, null, 2), "utf8");
const local = posts.filter((p) => p.image.startsWith("/media/")).length;
console.log(
  `OK: ${posts.length} publicaciones (${local} imágenes locales) → ${path.relative(process.cwd(), OUT)}`,
);
