# Deploy — nachoscoppa.com

Guía para publicar cambios en producción. **No usa Docker Hub**: se construye la imagen en local, se envía por `scp` y se levanta en el VPS.

## Infraestructura

| Dato | Valor |
|------|--------|
| VPS | `root@31.97.28.32` |
| Hostname (ej.) | `srv852034` |
| Ruta en servidor | `/opt/nachoscoppa` |
| Contenedor | `nachoscoppa-frontend` |
| Imagen | `nachoscoppa-frontend:prod` |
| Puerto contenedor | `8081` → `80` (interno) |
| Dominio | `nachoscoppa.com`, `www.nachoscoppa.com` |
| SSL / proxy | Nginx en el host → `127.0.0.1:8081` |

**Importante:** en este VPS conviven otros servicios (ej. `coppados-frontend` en `8080`). Solo se recrea `nachoscoppa-frontend`.

Arquitectura del build: **`linux/amd64`** (aunque la Mac sea Apple Silicon).

---

## 1) En tu Mac (build + subir)

```bash
cd /Users/facundomartinez/Desktop/facundo/nachoscoppa

# Buildx (una vez; si ya existe, reutiliza)
docker buildx create --name multiarch --use --bootstrap 2>/dev/null || docker buildx use multiarch

# Build para el VPS
docker buildx build --platform linux/amd64 -t nachoscoppa-frontend:prod --load .

# Exportar imagen
docker save nachoscoppa-frontend:prod | gzip > nachoscoppa-frontend-prod.tar.gz

# Subir al VPS
scp nachoscoppa-frontend-prod.tar.gz root@31.97.28.32:/opt/nachoscoppa/
```

---

## 2) En el VPS (cargar + levantar)

```bash
ssh root@31.97.28.32
cd /opt/nachoscoppa

gunzip -c nachoscoppa-frontend-prod.tar.gz | docker load

docker rm -f nachoscoppa-frontend
docker run -d \
  --name nachoscoppa-frontend \
  --restart unless-stopped \
  -p 8081:80 \
  nachoscoppa-frontend:prod
```

---

## 3) Verificación

```bash
docker ps
curl -I http://127.0.0.1:8081
curl -I https://nachoscoppa.com
```

En el navegador: hard refresh (`Cmd+Shift+R`) o ventana incógnito si ves caché vieja.

Si el contenedor no arranca:

```bash
docker logs --tail 100 nachoscoppa-frontend
```

---

## Nginx + Certbot (referencia)

Sitio habilitado: `/etc/nginx/sites-enabled/nachoscoppa.com`  
Proxy: `http://127.0.0.1:8081`

Renovar / comprobar SSL:

```bash
nginx -t && systemctl reload nginx
certbot certificates
certbot renew --dry-run
```

Si Certbot falla con HTML en `/.well-known/`, el vhost debe servir el challenge antes del proxy a la SPA (bloque `location ^~ /.well-known/acme-challenge/`).

---

## DNS

Para que `nachoscoppa.com` apunte solo a este VPS:

- `A` `@` → `31.97.28.32`
- `A` `www` → `31.97.28.32` (o `CNAME` a `@`)

Evitar varios registros `A` distintos en el mismo host (Let's Encrypt y el tráfico pueden ir a otro servidor).

Comprobar:

```bash
dig +short A nachoscoppa.com
dig +short A www.nachoscoppa.com
```

---

## Archivos del proyecto relacionados

- `Dockerfile` — build Vite + Nginx
- `nginx-spa.conf` — fallback SPA (`/agenda`, etc.)
- `docker-compose.vps.yml` — referencia de puerto `8081` (opcional si usás compose)

---

## Variante con tag por fecha (opcional)

```bash
export TAG=2026-05-21-01
docker buildx build --platform linux/amd64 -t nachoscoppa-frontend:$TAG --load .
docker save nachoscoppa-frontend:$TAG | gzip > nachoscoppa-frontend-$TAG.tar.gz
scp nachoscoppa-frontend-$TAG.tar.gz root@31.97.28.32:/opt/nachoscoppa/
# En VPS: docker load y docker run con nachoscoppa-frontend:$TAG
```

---

## SEO (post-deploy)

- `robots.txt` y `sitemap.xml` en `public/` → `https://nachoscoppa.com/robots.txt`
- Registrar propiedad en [Google Search Console](https://search.google.com/search-console) y enviar sitemap
- Imagen social: `https://nachoscoppa.com/og-image.webp`

---

## Checklist rápido

- [ ] Cambios probados en local (`npm run dev` / `npm run build`)
- [ ] Build `linux/amd64` con `--load .`
- [ ] `scp` al VPS correcto (`31.97.28.32`, no otro servidor)
- [ ] `docker load` + recrear solo `nachoscoppa-frontend`
- [ ] `curl` a `8081` y `https://nachoscoppa.com`
