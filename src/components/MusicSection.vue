<template>
  <section id="dj-info" ref="sectionRef" class="dj-info" aria-labelledby="dj-info-headline">
    <div class="dj-info__inner">
      <div class="dj-info__lead">
        <div class="dj-info__badge-row">
          <span class="dj-info__badge-icon" aria-hidden="true">
            <span class="dj-info__badge-plus">+</span>
          </span>
          <span class="dj-info__badge-label">Sobre el artista</span>
        </div>

        <h2 id="dj-info-headline" class="dj-info__headline">
          <span class="dj-info__headline-line dj-info__headline-line--dark">
            Resultados que se escuchan en cada sesión,
          </span>
          <span class="dj-info__headline-line dj-info__headline-line--muted">
            desde Rosario a clubes y festivales globales.
          </span>
          <span class="dj-info__headline-line dj-info__headline-line--muted">
            Así suena el 2026.
          </span>
        </h2>
      </div>

      <div class="dj-info__main">
        <div class="dj-info__photo-wrap">
          <div class="dj-info__photo">
            <span class="dj-info__photo-corner" aria-hidden="true">+</span>
            <img
              ref="photoImgRef"
              class="dj-info__photo-img"
              :src="djPortrait"
              alt="Nacho Scoppa"
              width="560"
              height="720"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div class="dj-info__aside">
          <div class="dj-info__intro">
            <p class="dj-info__intro-p">
              <strong class="dj-info__intro-lead">Sin relleno: solo energía y groove.</strong>
              Producción y sets con foco en la pista. Cada proyecto busca conectar cabina y público,
              noche tras noche.
            </p>
          </div>

          <div class="dj-info__presskit" role="group" aria-label="Press kit">
            <a
              class="dj-info__presskit-btn"
              :href="presskitEsUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Press kit (ES)
            </a>
            <a
              class="dj-info__presskit-btn dj-info__presskit-btn--ghost"
              :href="presskitEnUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Press kit (EN)
            </a>
          </div>

          <div class="dj-info__cards" aria-label="Datos destacados">
            <article class="dj-info__card dj-info__card--stat">
              <span class="dj-info__card-index">01</span>
              <p class="dj-info__stat">50+</p>
            </article>
            <article class="dj-info__card dj-info__card--stat">
              <span class="dj-info__card-index">02</span>
              <p class="dj-info__stat">15+</p>
            </article>

            <article class="dj-info__card dj-info__card--story">
              <p class="dj-info__card-kicker">Trayectoria internacional</p>
              <p class="dj-info__card-body">
                Nacido en Rosario (2000), lleva su sonido a clubes y festivales en Europa y
                Sudamérica — de UNVRS y The Warehouse Project a Pacha Barcelona y The BPM Festival.
              </p>
            </article>

            <article class="dj-info__card dj-info__card--labels">
              <p class="dj-info__card-kicker">Labels &amp; Partners</p>
              <div
                class="dj-info__marquees-stack"
                role="group"
                :aria-label="'Sellos y labels: ' + labelLogos.map((l) => l.name).join(', ')"
              >
                <div class="dj-info__marquee" aria-hidden="true">
                  <div class="dj-info__marquee-track dj-info__marquee-track--reverse">
                    <div v-for="dup in 2" :key="'marq-rev-' + dup" class="dj-info__marquee-set">
                      <img
                        v-for="logo in labelLogos"
                        :key="'marq-rev-' + dup + '-' + logo.id"
                        :src="logo.src"
                        alt=""
                        class="dj-info__marquee-logo"
                        width="140"
                        height="40"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
                <div class="dj-info__marquee" aria-hidden="true">
                  <div class="dj-info__marquee-track">
                    <div v-for="dup in 2" :key="'marq-fwd-' + dup" class="dj-info__marquee-set">
                      <img
                        v-for="logo in labelLogos"
                        :key="'marq-fwd-' + dup + '-' + logo.id"
                        :src="logo.src"
                        alt=""
                        class="dj-info__marquee-logo"
                        width="140"
                        height="40"
                        decoding="async"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import djPortrait from "../assets/pressFoto.JPG";
import logoCriterio from "../assets/criterioLabelLogo.svg";
import logoDeep from "../assets/deepperfectLabelLogo.png";
import logoBamboleo from "../assets/bamboleoLabelLogo.png";
import logoCoppados from "../assets/coppadosLabelLogo.webp";
import logoMoan from "../assets/logoMoanLabel.png";
import { revealOnScroll } from "../composables/scrollReveal";

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref(null);
const photoImgRef = ref(null);

/** Logos de sellos en `src/assets` (carrusel en la card “Respaldo en cabina”).*/
const labelLogos = [
  { id: "criterio", name: "Criterio", src: logoCriterio },
  { id: "deep", name: "Deeperfect", src: logoDeep },
  { id: "bamboleo", name: "Bamboleo", src: logoBamboleo },
  { id: "coppados", name: "Coppados", src: logoCoppados },
  { id: "moan", name: "Moan", src: logoMoan },
];

/** PDF u hojas estáticas en `public/presskit/` (Vite las sirve en la raíz). */
const presskitEsUrl = "/presskit/nacho-scoppa-es.pdf";
const presskitEnUrl = "/presskit/nacho-scoppa-en.pdf";

let ctx;

onMounted(() => {
  nextTick(() => {
    const section = sectionRef.value;
    if (!section) return;

    ctx = gsap.context(() => {
      const badgeHeadline = section.querySelectorAll(".dj-info__badge-row, .dj-info__headline-line");
      const photoWrap = section.querySelector(".dj-info__photo-wrap");
      const intro = section.querySelector(".dj-info__intro");
      const press = section.querySelector(".dj-info__presskit");
      const cards = section.querySelectorAll(".dj-info__cards .dj-info__card");

      const revealTargets = [...badgeHeadline, photoWrap, intro, press, ...cards].filter(Boolean);

      revealOnScroll(section, revealTargets, {
        y: 36,
        duration: 0.65,
        stagger: 0.07,
        ease: "power2.out",
        start: "top 85%",
        end: "bottom 18%",
      });

      const photoImg = photoImgRef.value;
      if (
        photoImg &&
        typeof window !== "undefined" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        /* Solo hacia arriba: yPercent positivo dejaba hueco gris arriba del recorte */
        gsap.fromTo(
          photoImg,
          { yPercent: 0 },
          {
            yPercent: -18,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.15,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    }, section);

    ScrollTrigger.refresh();
  });
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<style scoped>
.dj-info {
  --dj-bg: var(--page-bg, #f2f2f2);
  --dj-card: #ffffff;
  --dj-black: #000000;
  --dj-muted: #525252;
  --dj-soft: #666666;
  --dj-index: #a3a3a3;
  --dj-pad-x: clamp(1.5rem, 5vw, 4rem);
  position: relative;
  z-index: 1;
  padding: clamp(3.5rem, 10vh, 6rem) var(--dj-pad-x) clamp(4rem, 12vh, 7rem);
  background: var(--dj-bg);
  color: var(--dj-black);
  font-family: "Inter", system-ui, sans-serif;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.dj-info__inner {
  max-width: min(100%, 92rem);
  margin: 0 auto;
}

/* Fila superior: badge estrecho + titular que ocupa todo el ancho restante */
.dj-info__lead {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  gap: clamp(2.75rem, 8vw, 8.5rem);
  margin-bottom: clamp(3.25rem, 9vw, 6.5rem);
}

.dj-info__badge-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
  padding-top: 0.35rem;
}

.dj-info__badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--dj-black);
  color: #fff;
}

.dj-info__badge-plus {
  font-size: 1rem;
  font-weight: 300;
  line-height: 1;
  margin-top: -1px;
}

.dj-info__badge-label {
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--dj-black);
}

.dj-info__headline {
  margin: 0;
  flex: 1 1 0;
  min-width: 0;
  max-width: none;
  font-size: clamp(1.55rem, 3.5vw, 2.85rem);
  font-weight: 700;
  letter-spacing: -0.032em;
  line-height: 1.32;
}

.dj-info__headline-line {
  display: block;
}

.dj-info__headline-line--dark {
  color: var(--dj-black);
  margin-bottom: 0.12em;
}

.dj-info__headline-line--muted {
  color: var(--dj-muted);
  font-weight: 500;
  margin-bottom: 0.1em;
}

.dj-info__headline-line--muted:last-child {
  margin-bottom: 0;
}

/* Intro: en desktop se alinea a la derecha en @media (min-width: 901px) */
.dj-info__intro {
  width: 100%;
  max-width: none;
  margin-left: 0;
  margin-bottom: clamp(2.5rem, 5.5vw, 4.25rem);
  text-align: left;
  padding-left: clamp(0.15rem, 0.8vw, 0.35rem);
  flex-shrink: 0;
}

.dj-info__intro-p {
  margin: 0;
  margin-right: auto;
  max-width: min(32rem, 90%);
  text-align: left;
  font-size: clamp(1.0625rem, 1.45vw, 1.2rem);
  font-weight: 400;
  line-height: 1.45;
  letter-spacing: -0.01em;
  color: #555555;
}

.dj-info__intro-lead {
  font-weight: 800;
  color: #111111;
  letter-spacing: -0.02em;
}

/* Fila principal: segundo bloque apenas más angosto y pegado al borde derecho */
.dj-info__main {
  display: grid;
  grid-template-columns: minmax(0, 0.33fr) minmax(0, 0.67fr);
  gap: clamp(1.25rem, 3vw, 2.5rem);
  align-items: start;
}

.dj-info__aside {
  min-width: 0;
  max-width: min(100%, 42rem);
  width: 100%;
  justify-self: end;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.dj-info__photo-wrap {
  min-width: 0;
  align-self: start;
}

.dj-info__photo {
  position: relative;
  border-radius: clamp(1.25rem, 2.25vw, 1.75rem);
  overflow: hidden;
  background: #e5e5e5;
  aspect-ratio: 3 / 4;
}

.dj-info__photo-corner {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--dj-black);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1;
}

.dj-info__photo-img {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  /* Extra altura para que al mover yPercent hacia arriba no aparezca franja abajo */
  height: 138%;
  max-width: none;
  object-fit: cover;
  object-position: center 22%;
  will-change: transform;
}

/* 2×2: gap mínimo (~2px), bloque unificado como la ref. */
.dj-info__cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 0.125rem;
  min-width: 0;
  align-items: stretch;
}

.dj-info__card {
  background: var(--dj-card);
  border: none;
  border-radius: clamp(1.25rem, 2vw, 1.75rem);
  box-sizing: border-box;
  /* Evita que el carrusel (max-content / intrínsecos de imágenes) ensanche la grilla */
  min-width: 0;
}

.dj-info__card--stat {
  position: relative;
  padding: clamp(1.1rem, 2vw, 1.45rem);
  min-height: clamp(6.5rem, 11.5vw, 8.35rem);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.dj-info__card-index {
  position: absolute;
  top: 0.45rem;
  right: 0.45rem;
  font-size: 0.625rem;
  font-weight: 400;
  color: var(--dj-index);
  letter-spacing: 0.06em;
}

.dj-info__stat {
  margin: 0;
  font-size: clamp(1.75rem, 3.5vw, 2.45rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.98;
  color: var(--dj-black);
  text-align: left;
}

.dj-info__card--story,
.dj-info__card--labels {
  padding: clamp(1.4rem, 2.35vw, 1.85rem);
  min-height: clamp(11.75rem, 22vw, 14.75rem);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.dj-info__card--story .dj-info__card-kicker,
.dj-info__card--labels .dj-info__card-kicker {
  align-self: flex-end;
  text-align: right;
  margin: 0 0 0.65rem;
}

.dj-info__card--story .dj-info__card-body {
  margin-top: auto;
  width: 100%;
  max-width: min(13.75rem, 82%);
  margin-left: auto;
  margin-right: auto;
  text-align: left;
}

.dj-info__card--labels {
  overflow: hidden;
}

.dj-info__marquees-stack {
  margin-top: auto;
  align-self: stretch;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.dj-info__marquee {
  overflow: hidden;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  mask-image: linear-gradient(
    to right,
    transparent,
    #000 10%,
    #000 90%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    #000 10%,
    #000 90%,
    transparent
  );
}

.dj-info__marquee-track {
  display: flex;
  width: max-content;
  animation: dj-info-marquee 16s linear infinite;
}

/* Debe ir después del shorthand anterior: si no, `animation` resetea direction a normal */
.dj-info__marquee-track--reverse {
  animation: dj-info-marquee 16s linear infinite reverse;
}

.dj-info__marquee-set {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: clamp(0.65rem, 2vw, 1.15rem);
  padding-inline: clamp(0.45rem, 1.25vw, 0.85rem);
  box-sizing: border-box;
  min-width: 0;
}

.dj-info__marquee-logo {
  display: block;
  height: clamp(1.15rem, 2.5vw, 1.45rem);
  width: auto;
  max-width: 5.25rem;
  min-width: 0;
  object-fit: contain;
  object-position: center;
  opacity: 1;
  /* Unifica sellos en negro legible sobre la card blanca */
  filter: brightness(0);
  flex-shrink: 0;
}

@keyframes dj-info-marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dj-info__marquee-track {
    animation: none;
    flex-wrap: wrap;
    width: 100%;
    justify-content: flex-start;
    row-gap: 0.65rem;
  }

  .dj-info__marquee-set:last-child {
    display: none;
  }

  .dj-info__marquee {
    mask-image: none;
    -webkit-mask-image: none;
  }
}

.dj-info__card-kicker {
  margin: 0;
  max-width: 13.5rem;
  font-size: clamp(0.8125rem, 1.05vw, 0.9375rem);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.012em;
  color: var(--dj-black);
}

.dj-info__card-body {
  margin: 0;
  align-self: flex-start;
  font-size: clamp(0.8125rem, 1.02vw, 0.9375rem);
  font-weight: 400;
  line-height: 1.55;
  color: #555555;
  max-width: 100%;
  text-align: left;
}

/* Pills alineados al estilo del hero (Contacto / Inicio), compactos */
.dj-info__presskit {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 0.45rem;
  width: 100%;
  margin-bottom: clamp(1.15rem, 2.75vw, 1.85rem);
}

.dj-info__presskit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.34rem 0.8rem;
  border-radius: 999px;
  border: 1px solid var(--dj-black);
  background: var(--dj-black);
  color: #fff;
  font-family: inherit;
  font-size: clamp(0.75rem, 0.95vw, 0.8125rem);
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;
  transition: opacity 0.2s ease;
}

.dj-info__presskit-btn:hover {
  opacity: 0.88;
}

.dj-info__presskit-btn:focus-visible {
  outline: 2px solid var(--dj-black);
  outline-offset: 2px;
}

.dj-info__presskit-btn--ghost {
  background: var(--dj-card);
  color: var(--dj-black);
  border-color: rgba(0, 0, 0, 0.18);
}

.dj-info__presskit-btn--ghost:hover {
  opacity: 1;
  background: #fff;
}

/* Desktop: intro alineado a la derecha, más aire antes de las cards */
@media (min-width: 901px) {
  .dj-info__intro {
    text-align: right;
    padding-left: 0;
    padding-right: 0;
    margin-bottom: clamp(2rem, 4vw, 3.35rem);
  }

  .dj-info__intro-p {
    margin-left: auto;
    margin-right: 0;
    max-width: 100%;
    text-align: right;
    font-size: clamp(1.125rem, 1.65vw, 1.35rem);
    line-height: 1.45;
  }
}

@media (max-width: 900px) {
  .dj-info__lead {
    flex-wrap: wrap;
    flex-direction: column;
    gap: 1rem;
  }

  .dj-info__headline {
    flex: 1 1 auto;
    line-height: 1.24;
  }

  .dj-info__intro {
    margin-left: 0;
    text-align: left;
    max-width: 36rem;
    padding-left: 0;
  }

  .dj-info__intro-p {
    text-align: left;
    max-width: min(32rem, 100%);
  }

  .dj-info__presskit {
    justify-content: flex-start;
  }

  .dj-info__aside {
    max-width: none;
    margin-left: 0;
  }

  .dj-info__main {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .dj-info__photo-wrap {
    display: block;
  }

  .dj-info__photo {
    flex: none;
    display: block;
    aspect-ratio: 4 / 5;
    max-height: 24.5rem;
    margin: 0 auto;
    max-width: min(100%, 22rem);
  }

  .dj-info__photo-img {
    height: 132%;
    object-position: center 24%;
  }

  .dj-info__cards {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }
}

@media (max-width: 540px) {
  .dj-info__cards {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    gap: 0.125rem;
  }

  .dj-info__card--stat,
  .dj-info__card--story,
  .dj-info__card--labels {
    grid-column: 1;
    grid-row: auto;
    min-height: 0;
  }

  .dj-info__card--story,
  .dj-info__card--labels {
    min-height: 0;
  }

  .dj-info__card--story .dj-info__card-body {
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
  }

  .dj-info__card-kicker {
    align-self: flex-start;
    text-align: left;
  }
}
</style>
