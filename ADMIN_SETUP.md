# Admin · Setup Firebase

Backend para el admin del sitio (auth + Firestore + Storage + 1 Cloud Function de sync IG).

## 1) Crear el proyecto Firebase

1. https://console.firebase.google.com → **Add project**.
2. **Build → Authentication → Get started**, habilitar **Email/Password**.
3. **Build → Firestore Database**, crear en modo *production*. Región sugerida: `southamerica-east1` o `us-central1`.
4. **Build → Storage → Get started**, modo *production*.
5. **⚙️ Project settings → General → Your apps**, agregar una *Web app* y copiar la config.
6. **⚙️ Project settings → Service accounts → Generate new private key** → guardar el JSON (solo se usa para correr el seed local).
7. **Upgrade del plan a Blaze** (necesario para Cloud Functions; con el volumen de este sitio no debería generar costos).

## 2) Variables de entorno

Copiar `.env.example` a `.env.local` y completar con los valores de la web app:

```
VITE_FIREBASE_API_KEY=…
VITE_FIREBASE_AUTH_DOMAIN=…
VITE_FIREBASE_PROJECT_ID=…
VITE_FIREBASE_STORAGE_BUCKET=…
VITE_FIREBASE_MESSAGING_SENDER_ID=…
VITE_FIREBASE_APP_ID=…
VITE_ADMIN_EMAILS=tu@email.com,nacho@email.com
```

Reemplazar también el project id en `.firebaserc`.

## 3) Allowlist de admin

Editar la lista de emails admin en **tres** lugares (debe coincidir todo):

- `VITE_ADMIN_EMAILS` (cliente).
- `firestore.rules` y `storage.rules` (server-side enforcement).
- Variable `ADMIN_EMAILS` de la Cloud Function (paso 6).

## 4) Crear los usuarios admin en Auth

Firebase Console → Authentication → Users → **Add user**, con cada email de la allowlist.

## 5) Seed inicial (poblar Firestore)

```bash
npm install
export FIREBASE_PROJECT_ID=tu-project-id
export GOOGLE_APPLICATION_CREDENTIALS=./path/al/serviceAccount.json
npm run seed:firestore
```

Esto crea documentos para tracks/featured/labels/press/livesets/agenda/stats. Las imágenes locales quedan vacías — las subís desde el admin.

## 6) Deploy de rules + función

```bash
# CLI
npm i -g firebase-tools
firebase login
firebase use --add   # elegir el project id

# Rules
firebase deploy --only firestore:rules,storage:rules

# Function (sync IG)
cd functions && npm install && cd ..
firebase functions:config:set   # no necesario, usamos env vars
# Setear emails admin como var de entorno de la función:
firebase functions:secrets:set ADMIN_EMAILS   # ó usar gcloud / config UI
firebase deploy --only functions
```

Alternativa rápida para setear `ADMIN_EMAILS`: editar `functions/.env` con:
```
ADMIN_EMAILS=tu@email.com,nacho@email.com
INSTAGRAM_USER=nachoscoppa
```
y `firebase deploy --only functions`.

## 7) Usar el admin

- `npm run dev` y abrir http://localhost:5173/admin/login
- Sesión con el email/contraseña creados en Auth.
- Las secciones públicas se actualizan en vivo al guardar (Firestore `onSnapshot`).

## Resumen de collections

| Path | Tipo | Contenido |
|---|---|---|
| `tracks/{id}` | colección | Carrusel Music |
| `featuredTrack/main` | doc | Release del momento |
| `labels/{id}` | colección | Logos de sellos |
| `pressNotes/{id}` | colección | Carrusel de entrevistas |
| `liveSets/{id}` | colección | Sets en vivo |
| `agendaEvents/{id}` | colección | Fechas del tour |
| `siteStats/main` | doc | +27 países / +74K oyentes / tracks count / since year |
| `instagramPosts/{shortcode}` | colección | Posts IG (escrito por la function) |
| `sync/instagram` | doc | Metadata del último sync IG |

## Limpieza opcional

Una vez que estés operando 100% sobre Firestore, podés borrar:

- `src/components/agenda/data.js` (ya no se usa).
- `scripts/sync-instagram-feed.mjs` y `public/data/instagram-posts.json` (reemplazados por la Cloud Function).
- Los `.webp/.svg` de assets que ya hayas resubido al Storage.
