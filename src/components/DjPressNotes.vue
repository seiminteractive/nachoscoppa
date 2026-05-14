<template>
  <div ref="djNotesRootRef" class="dj-notes" aria-labelledby="dj-notes-heading">
    <div
      ref="pinRef"
      class="dj-notes__scene"
      :class="{ 'dj-notes__scene--scrolljack': layoutScrolljack }"
    >
      <div ref="viewportRef" class="dj-notes__viewport">
        <div ref="trackRef" class="dj-notes__track">
          <header class="dj-notes__head">
            <div class="dj-notes__title-row">
              <h2 id="dj-notes-heading" class="dj-notes__mega">
                <span class="dj-notes__mega-line">PRESS</span>
                <span class="dj-notes__mega-line dj-notes__mega-line--mid">&</span>
                <span class="dj-notes__mega-line">
                  FEATURES<span class="dj-notes__mega-dot">.</span>
                </span>
              </h2>
              <p class="dj-notes__tag">(NOTAS)</p>
            </div>
          </header>

          <a
            v-for="(item, index) in notes"
            :key="item.id"
            class="dj-notes__card"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="dj-notes__card-media">
              <img
                class="dj-notes__card-img"
                :src="item.image"
                :alt="item.imageAlt"
                width="640"
                height="360"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div class="dj-notes__card-body">
              <span class="dj-notes__step" aria-hidden="true">
                Card
                <span class="dj-notes__step-num">{{ String(index + 1).padStart(2, "0") }}</span
                ><span class="dj-notes__step-dot">.</span>
              </span>
              <h3 class="dj-notes__card-title">{{ item.title }}</h3>
              <p class="dj-notes__card-kicker">{{ item.kicker }}</p>
              <p class="dj-notes__card-text">{{ item.description }}</p>
              <span class="dj-notes__link">
                Leer artículo
                <span class="dj-notes__link-arrow" aria-hidden="true">→</span>
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { revealOnScroll } from "../composables/scrollReveal";
import { revealTextOnScroll } from "../composables/revealTextOnScroll";
import { countUpOnScroll } from "../composables/countUpOnScroll";

import notaMixmag from "../assets/notaMixmag.png";
import notaMagnetic from "../assets/notaMagneticmag.jpg";

gsap.registerPlugin(ScrollTrigger);

/** Hasta 3 entradas; ahora 2. Agregar aquí la tercera nota cuando exista. */
const notes = [
  {
    id: "mixmag-it",
    title: "Mixmag Italia",
    kicker: "Portada digital · Italia",
    description:
      "Nacho Scoppa protagoniza la portada del digital magazine de Mixmag Italia: en una cobertura enfocada en su identidad sonora y proyección internacional.",
    url: "https://mixmagit.com/read/mixmagitalyade-con-nacho-scoppa-in-copertina-digital-magazine",
    image: notaMixmag,
    imageAlt: "Portada digital de Mixmag Italia con Nacho Scoppa",
  },
  {
    id: "magnetic",
    title: "Magnetic Magazine",
    kicker: "Entrevista · Estados Unidos",
    description:
      "Una conversación sobre producción, cultura club y la visión creativa detrás del universo musical de Nacho Scoppa.",
    url: "https://magneticmag.com/2026/03/nacho-scoppa-interview/",
    image: notaMagnetic,
    imageAlt: "Artículo de Magnetic Magazine sobre Nacho Scoppa",
  },
];

const pinRef = ref(null);
const viewportRef = ref(null);
const trackRef = ref(null);
const djNotesRootRef = ref(null);
/** Altura viewport + capa: si no, al pinear GSAP usa la altura del carrusel y el scroll vertical “filtra” por abajo. */
const layoutScrolljack = ref(false);

let ctx;

function setupHorizontalScroll() {
  const pin = pinRef.value;
  const viewport = viewportRef.value;
  const track = trackRef.value;
  if (!pin || !viewport || !track) return;

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    gsap.set(track, { clearProps: "transform" });
    return;
  }

  const scrollAmount = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

  gsap.set(track, { x: 0 });

  if (scrollAmount() < 16) return;

  layoutScrolljack.value = true;

  gsap.to(track, {
    x: () => -scrollAmount(),
    ease: "none",
    scrollTrigger: {
      trigger: pin,
      start: "top top",
      end: () => `+=${scrollAmount()}`,
      pin: true,
      pinSpacing: true,
      /* scrub: true (1:1 con scroll) → sin lag al despinear → sin salto al final.
         scrub: 1.2 (original) interpolaba después de que el pin terminaba. */
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}

onMounted(() => {
  nextTick(() => {
    const root = pinRef.value?.closest(".press-notes-region") || pinRef.value;
    ctx = gsap.context(() => {
      setupHorizontalScroll();
      const wrap = djNotesRootRef.value;
      if (wrap) {
        const mega = wrap.querySelector(".dj-notes__mega");
        const tag = wrap.querySelector(".dj-notes__tag");
        if (mega) revealTextOnScroll(mega, { trigger: mega, stagger: 0.08 });
        if (tag) revealOnScroll(tag, [tag]);
        wrap.querySelectorAll(".dj-notes__card").forEach((card, i) => {
          const title = card.querySelector(".dj-notes__card-title");
          if (title) revealTextOnScroll(title, { trigger: card, yPercent: 110, stagger: 0.05 });
          const num = card.querySelector(".dj-notes__step-num");
          if (!num) return;
          countUpOnScroll(card, num, {
            to: i + 1,
            format: (v) => String(Math.max(0, Math.round(v))).padStart(2, "0"),
          });
        });
      }
    }, root);

    ScrollTrigger.refresh();
  });
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<style scoped>
.dj-notes {
  --dj-notes-accent: #c2410c;
  --dj-notes-border: rgba(0, 0, 0, 0.1);
  --dj-notes-card: #ffffff;
  padding-block: clamp(1.5rem, 3.5vw, 2.5rem);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

/* Base: altura del contenido. Con --scrolljack: toda la ventana tapada mientras dura el pin (evita que se vea la sección de abajo). */
.dj-notes__scene {
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  width: 100%;
}

.dj-notes__scene--scrolljack {
  box-sizing: border-box;
  /* --real-vh viene de App.vue (visualViewport.height): estable durante el scroll.
     100dvh fluctúa con la URL bar de mobile → dispara ScrollTrigger refresh → temblor. */
  min-height: 100vh;
  min-height: var(--real-vh, 100dvh);
  /* Centra el carrusel en el viewport del pin; el viewport NO debe estirarse a toda la altura o el track queda pegado arriba. */
  align-items: center;
  justify-content: flex-start;
  /* Navbar fija + margen para ascenders del mega (evita recorte bajo el header) */
  padding-top: calc(
    var(--site-header-offset, clamp(3.85rem, 8.9vw, 4.65rem)) + env(safe-area-inset-top, 0px) +
      clamp(0.45rem, 1.5vh, 1rem)
  );
  padding-bottom: calc(
    clamp(1.25rem, 3.5vh, 2rem) + env(safe-area-inset-bottom, 0px)
  );
  background: var(--page-bg, #f2f2f2);
  z-index: 35;
  isolation: isolate;
}

.dj-notes__head {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: stretch;
  padding-top: 0;
  padding-right: clamp(1.25rem, 3.5vw, 3.5rem);
  box-sizing: border-box;
}

/* Subtítulo a la derecha del mega, mismo plano superior que el título (ref. HOW WE WORK) */
.dj-notes__title-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: clamp(0.65rem, 1.6vw, 1.35rem);
}

.dj-notes__tag {
  margin: 0;
  flex-shrink: 0;
  /* Alineación óptica con el cap height de la primera línea del mega */
  padding-top: clamp(0.35rem, 0.9vw, 0.55rem);
  font-size: clamp(0.7rem, 0.95vw, 0.8125rem);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #737373;
}

.dj-notes__mega {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.06em;
  text-transform: uppercase;
}

.dj-notes__mega-line {
  display: block;
  font-size: clamp(2.85rem, 8.2vw, 7.25rem);
  font-weight: 800;
  line-height: 0.88;
  letter-spacing: -0.05em;
  color: #0a0a0a;
  white-space: nowrap;
}

.dj-notes__mega-line--mid {
  font-size: clamp(2.2rem, 6.2vw, 5.35rem);
  letter-spacing: -0.06em;
  color: #262626;
}

.dj-notes__mega-dot {
  color: var(--dj-notes-accent);
}

.dj-notes__viewport {
  min-width: 0;
  overflow: hidden;
  margin-left: calc(-1 * var(--dj-pad-x, 1.5rem));
  margin-right: calc(-1 * var(--dj-pad-x, 1.5rem));
  width: calc(100% + 2 * var(--dj-pad-x, 1.5rem));
  display: flex;
  align-items: flex-start;
}

.dj-notes__scene--scrolljack .dj-notes__viewport {
  align-self: center;
  flex: 0 1 auto;
}

.dj-notes__track {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: clamp(0.85rem, 1.8vw, 1.5rem);
  padding-left: var(--dj-pad-x, 1.5rem);
  padding-right: var(--dj-pad-x, 1.5rem);
  will-change: transform;
}

.dj-notes__card {
  flex: 0 0 auto;
  box-sizing: border-box;
  /* Panorama: mucho más ancho que el viewport → scroll horizontal obligatorio */
  width: clamp(30rem, 94vw, 58rem);
  /* Cards más altas (~referencia tipo “columna” que llena mejor el viewport) */
  min-height: clamp(24rem, 62vh, 42rem);
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background: var(--dj-notes-card);
  border: 1px solid var(--dj-notes-border);
  border-radius: clamp(1.25rem, 2.2vw, 1.85rem);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9) inset;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.dj-notes__card-media {
  flex: 0 0 45%;
  min-width: 0;
  max-width: min(50%, 32rem);
  position: relative;
  align-self: stretch;
  min-height: 0;
  background: #e8e8e8;
}

.dj-notes__card-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.dj-notes__card-body {
  flex: 1 1 auto;
  min-width: 0;
  padding: clamp(1.15rem, 2vw, 1.75rem) clamp(1.35rem, 2.5vw, 2.15rem)
    clamp(1.5rem, 2.5vw, 2.25rem);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* Texto más arriba (no centrado vertical): NOTA arriba y bloque editorial debajo */
  justify-content: flex-start;
}

.dj-notes__card:hover {
  border-color: rgba(0, 0, 0, 0.18);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
}

.dj-notes__card:focus-visible {
  outline: 2px solid #0a0a0a;
  outline-offset: 3px;
}

.dj-notes__step {
  font-size: clamp(0.7rem, 1vw, 0.8125rem);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #525252;
  margin-bottom: clamp(1.1rem, 2.2vw, 1.65rem);
}

.dj-notes__step-dot {
  color: var(--dj-notes-accent);
}

.dj-notes__card-title {
  margin: 0 0 0.45rem;
  font-size: clamp(1.35rem, 2.4vw, 1.85rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.15;
  color: #0a0a0a;
}

.dj-notes__card-kicker {
  margin: 0 0 0.65rem;
  font-size: clamp(0.82rem, 1.15vw, 0.9375rem);
  font-weight: 600;
  color: #404040;
  letter-spacing: -0.01em;
}

.dj-notes__card-text {
  margin: 0;
  font-size: clamp(0.9rem, 1.2vw, 1.05rem);
  line-height: 1.55;
  color: #555555;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dj-notes__link {
  margin-top: auto;
  padding-top: clamp(0.85rem, 1.75vw, 1.2rem);
  font-size: clamp(0.875rem, 1.1vw, 1rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #0a0a0a;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.dj-notes__link-arrow {
  transition: transform 0.2s ease;
}

.dj-notes__card:hover .dj-notes__link-arrow {
  transform: translateX(3px);
}

@media (max-width: 720px) {
  .dj-notes__head {
    padding-right: clamp(0.65rem, 3vw, 1.25rem);
  }

  /* Eyebrow arriba del mega (en desktop va al costado y compite por ancho). */
  .dj-notes__title-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.45rem;
  }

  .dj-notes__tag {
    order: -1;
    padding-top: 0;
    font-size: clamp(0.7rem, 3vw, 0.8125rem);
  }

  .dj-notes__mega-line {
    font-size: clamp(2.1rem, 13vw, 3.5rem);
  }

  .dj-notes__mega-line--mid {
    font-size: clamp(1.75rem, 10.5vw, 2.75rem);
  }

  .dj-notes__card {
    flex-direction: column;
    width: clamp(17.5rem, 86vw, 26rem);
  }

  .dj-notes__card-media {
    flex: 0 0 auto;
    width: 100%;
    max-width: none;
    min-height: clamp(11rem, 38vw, 13.5rem);
    aspect-ratio: 16 / 10;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dj-notes__track {
    will-change: auto;
    flex-wrap: wrap;
    gap: 0.75rem;
    transform: none !important;
    padding-left: 0;
    padding-right: 0;
  }

  .dj-notes__head {
    width: 100%;
    flex: 1 1 100%;
    padding-right: 0;
    padding-bottom: 0.5rem;
  }

  .dj-notes__tag {
    position: static;
    margin-bottom: 0.35rem;
  }

  .dj-notes__viewport {
    overflow: visible;
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }

  .dj-notes__card {
    width: 100%;
    max-width: 36rem;
  }
}
</style>
