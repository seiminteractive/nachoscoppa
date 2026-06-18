import { onCall, HttpsError } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { Buffer } from "node:buffer";

initializeApp();

const db = getFirestore("nachoscoppa");
const bucket = getStorage().bucket();

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function assertAdmin(auth) {
  const email = auth?.token?.email?.toLowerCase();
  if (!email || !ADMIN_EMAILS.includes(email)) {
    throw new HttpsError("permission-denied", "Solo emails admin pueden ejecutar esto.");
  }
}

async function fetchProfile(user) {
  const url = `https://i.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(user)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Instagram 219.0.0.12.117 Android",
      "X-IG-App-ID": "936619743392459",
    },
  });
  if (!res.ok) throw new HttpsError("internal", `Instagram respondió ${res.status}`);
  return res.json();
}

async function uploadImage(remoteUrl, destPath) {
  const r = await fetch(remoteUrl, {
    headers: {
      "User-Agent": "Instagram 219.0.0.12.117 Android",
      Referer: "https://www.instagram.com/",
    },
  });
  if (!r.ok) return null;
  const arrayBuffer = await r.arrayBuffer();
  if (arrayBuffer.byteLength < 800) return null;
  const file = bucket.file(destPath);
  await file.save(Buffer.from(arrayBuffer), {
    metadata: { contentType: r.headers.get("content-type") || "image/jpeg" },
    resumable: false,
  });
  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${destPath}`;
}

const CORS_ORIGINS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /^https:\/\/([a-z0-9-]+\.)*nachoscoppa\.com$/,
  /^https:\/\/coppados-1cf4e\.(web\.app|firebaseapp\.com)$/,
];

export const syncInstagram = onCall(
  { region: "us-central1", timeoutSeconds: 300, memory: "512MiB", cors: CORS_ORIGINS },
  async (req) => {
  assertAdmin(req.auth);

  const username = (req.data?.username || process.env.INSTAGRAM_USER || "nachoscoppa").trim();
  const metaRef = db.doc("sync/instagram");

  await metaRef.set(
    { status: "running", lastRunAt: FieldValue.serverTimestamp(), username },
    { merge: true },
  );

  try {
    const data = await fetchProfile(username);
    const edges = data?.data?.user?.edge_owner_to_timeline_media?.edges ?? [];

    const batch = db.batch();
    const posts = [];

    for (const { node } of edges) {
      const shortcode = node.shortcode;
      const remote = node.display_url || node.thumbnail_src || "";
      let image = remote;
      if (remote) {
        const dest = `nachoscoppa/instagram/${shortcode}.jpg`;
        const uploaded = await uploadImage(remote, dest);
        if (uploaded) image = uploaded;
      }
      const takenAt = node.taken_at_timestamp
        ? new Date(node.taken_at_timestamp * 1000)
        : new Date();
      const post = {
        shortcode,
        url: `https://www.instagram.com/p/${shortcode}/`,
        image,
        takenAt,
        updatedAt: FieldValue.serverTimestamp(),
      };
      batch.set(db.doc(`instagramPosts/${shortcode}`), post, { merge: true });
      posts.push(post);
    }

    await batch.commit();

    await metaRef.set(
      {
        status: "ok",
        username,
        profileUrl: `https://www.instagram.com/${username}/`,
        postCount: posts.length,
        finishedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return { ok: true, count: posts.length };
  } catch (err) {
    await metaRef.set(
      { status: "error", error: String(err?.message || err), finishedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
    throw err instanceof HttpsError ? err : new HttpsError("internal", String(err?.message || err));
  }
  },
);
