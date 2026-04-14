<template>
  <section ref="heroRootRef" class="hero">
    <div class="hero__header">
      <header class="hero__nav">
        <a href="/" class="hero__logo">
          <img
            class="hero__logo-img"
            :src="logoMark"
            alt="Nacho Scoppa"
            width="200"
            height="48"
            decoding="async"
          />
        </a>

        <nav class="hero__menu" aria-label="Principal">
          <a href="#" class="hero__pill hero__pill--active" aria-current="page">
            <span class="hero__pill-dot" aria-hidden="true" />
            Home
          </a>
          <a href="#" class="hero__link">Music</a>
          <a href="#" class="hero__link">About</a>
          <a href="#" class="hero__link">Live Sets</a>
        </nav>

        <a href="#" class="hero__cta">
          <span class="hero__cta-dot" aria-hidden="true" />
          Contacto
        </a>
      </header>
    </div>

    <div class="hero__stage">
      <div ref="cardRef" class="hero__card-stack">
        <div class="hero__card">
          <div class="hero__bg" aria-hidden="true" />

        <div class="hero__inner">
          <div class="hero__shell">
            <div class="hero__main">
              <div class="hero__mid">
                <p class="hero__lede">
                  Elevamos la noche con house y groove: sets que conectan cabina y pista, de
                  Rosario a clubes y festivales internacionales.
                </p>
                <ul class="hero__services" aria-label="Enfoque">
                  <li>Sets en vivo</li>
                  <li>Producción &amp; releases</li>
                  <li>Festivales &amp; clubes</li>
                  <li>Booking &amp; sonido</li>
                </ul>
              </div>
            </div>

            <div class="hero__bottom">
              <div class="hero__bottom-grid">
                <div class="hero__brand">
                  <img
                    class="hero__mega-logo hero__mega-logo--light"
                    :src="logoMark"
                    alt=""
                    width="900"
                    height="240"
                    decoding="async"
                  />
                </div>

                <div class="hero__carousel">
                  <div class="hero__thumb">
                    <img
                      ref="thumbImgRef"
                      class="hero__thumb-img"
                      :src="heroTracks[carouselIndex].cover"
                      :alt="`Portada — ${heroTracks[carouselIndex].title}`"
                      width="320"
                      height="200"
                      decoding="async"
                    />
                  </div>

                  <div
                    class="hero__progress"
                    role="group"
                    aria-label="Lanzamientos destacados"
                  >
                    <button
                      v-for="(t, i) in heroTracks"
                      :key="t.id"
                      type="button"
                      class="hero__tick"
                      :class="{ 'hero__tick--on': i === carouselIndex }"
                      :aria-current="i === carouselIndex ? 'true' : undefined"
                      @click="goToCarouselSlide(i)"
                    >
                      <span class="hero__tick-label">{{ t.title }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1 class="hero__sr-only">Nacho Scoppa — DJ y productor</h1>
        </div>
        </div>
        <!-- Franja mínima pegada al borde inferior de la card (mueve con el stack en scroll) -->
        <div class="hero__card-foot" aria-hidden="true" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logoMark from "../assets/nombreNacho.png";
import coverBonny from "../assets/bonnyEp.webp";
import coverIlike from "../assets/ilikeitEp.webp";
import coverPerc from "../assets/percussiveSeries.webp";
import coverShow from "../assets/showme.webp";
import coverSome from "../assets/somethingEp.webp";

gsap.registerPlugin(ScrollTrigger);

/** Mismos lanzamientos que Music / Split — carrusel del hero. */
const heroTracks = [
  { id: "bonny", title: "Bonny EP", cover: coverBonny },
  { id: "ilikeit", title: "I Like It EP", cover: coverIlike },
  { id: "perc", title: "Percussive Series", cover: coverPerc },
  { id: "show", title: "Show Me", cover: coverShow },
  { id: "some", title: "Something EP", cover: coverSome },
];

const heroRootRef = ref(null);
const cardRef = ref(null);
const thumbImgRef = ref(null);
const carouselIndex = ref(0);

const CAROUSEL_INTERVAL_MS = 5200;

let ctx;
let carouselTimer = null;
let carouselAnimating = false;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setCarouselIndex(next) {
  const n = heroTracks.length;
  const i = ((next % n) + n) % n;
  if (i === carouselIndex.value || carouselAnimating) return;

  const el = thumbImgRef.value;
  if (!el || prefersReducedMotion()) {
    carouselIndex.value = i;
    return;
  }

  carouselAnimating = true;
  gsap.to(el, {
    opacity: 0,
    duration: 0.22,
    ease: "power2.in",
    onComplete: () => {
      carouselIndex.value = i;
      nextTick(() => {
        const img = thumbImgRef.value;
        if (!img) {
          carouselAnimating = false;
          return;
        }
        gsap.fromTo(
          img,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.42,
            ease: "power2.out",
            onComplete: () => {
              carouselAnimating = false;
            },
          }
        );
      });
    },
  });
}

function goToCarouselSlide(i) {
  setCarouselIndex(i);
}

function advanceCarousel() {
  if (!carouselAnimating) {
    setCarouselIndex(carouselIndex.value + 1);
  }
}

onMounted(() => {
  nextTick(() => {
    const root = heroRootRef.value;
    const card = cardRef.value;
    if (!root || !card) return;

    carouselTimer = window.setInterval(advanceCarousel, CAROUSEL_INTERVAL_MS);

    ctx = gsap.context(() => {
      /*
       * La card sube exactamente 100vh de scroll (no depende de la altura del hero).
       * Así no se “salta” a -100% si el cálculo del trigger era 0.
       */
      gsap.fromTo(
        card,
        { yPercent: 0 },
        {
          yPercent: -100,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${window.innerHeight}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        }
      );
    }, heroRootRef);

    ScrollTrigger.refresh();
  });
});

onUnmounted(() => {
  if (carouselTimer != null) {
    window.clearInterval(carouselTimer);
    carouselTimer = null;
  }
  ctx?.revert();
});
</script>

<style scoped>
.hero {
  /* Gutter fino al viewport (card casi full-bleed); padding interno aparte */
  --stage-gutter-x: clamp(0.4rem, 1.15vw, 0.65rem);
  --nav-pad-x: clamp(0.65rem, 2vw, 1.05rem);
  --pad-x: clamp(0.95rem, 2.75vw, 1.65rem);
  --edge-bottom-x: clamp(0.35rem, 1vw, 0.85rem);
  --thumb-w: clamp(9rem, 21vw, 13.25rem);
  --pad-y-nav: clamp(0.62rem, 1.3vw, 0.88rem);
  --header-total: clamp(3.85rem, 8.9vw, 4.65rem);
  --menu-gap: clamp(0.85rem, 2vw, 1.5rem);
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  /* Una sola viewport: evita +100vh de “aire” debajo por flex/min-height */
  height: 100vh;
  height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  padding-top: var(--header-total);
  /* Y visible: la franja bajo la card (fuera del flujo) puede extenderse y tapar el solapamiento */
  overflow-x: clip;
  overflow-y: visible;
  /* Transparente: la sección siguiente puede verse por debajo (efecto “hoja” sobre el blanco) */
  background: transparent;
  font-family: "Inter", system-ui, sans-serif;
  /* La capa hero recibe eventos solo donde haya contenido útil */
  pointer-events: none;
}

.hero__header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 50;
  background: var(--page-bg, #f2f2f2);
  pointer-events: auto;
}

.hero__nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  column-gap: clamp(0.65rem, 1.8vw, 1.15rem);
  min-height: var(--header-total);
  padding: var(--pad-y-nav) var(--nav-pad-x);
}

.hero__logo {
  grid-column: 1;
  justify-self: start;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  line-height: 0;
  text-decoration: none;
}

.hero__logo-img {
  display: block;
  height: clamp(1.15rem, 2.05vw, 1.5rem);
  width: auto;
  max-width: min(38vw, 10rem);
  object-fit: contain;
  object-position: left center;
  filter: brightness(0);
}

.hero__menu {
  grid-column: 2;
  justify-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--menu-gap);
  min-width: 0;
  padding-inline: 0.35rem;
  flex-wrap: nowrap;
}

.hero__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.38rem 0.9rem 0.38rem 0.55rem;
  border-radius: 999px;
  background: #0a0a0a;
  color: #fff;
  text-decoration: none;
  font-size: clamp(0.8125rem, 1.15vw, 0.9375rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  flex-shrink: 0;
}

.hero__pill-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #fff;
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
}

.hero__pill--active {
  border: none;
}

.hero__link {
  color: #0a0a0a;
  text-decoration: none;
  font-size: clamp(0.8125rem, 1.15vw, 0.9375rem);
  font-weight: 500;
  letter-spacing: -0.015em;
  text-transform: none;
  transition: opacity 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.hero__link:hover {
  opacity: 0.55;
  color: #0a0a0a;
}

.hero__cta {
  grid-column: 3;
  justify-self: end;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.38rem 1.15rem 0.38rem 0.8rem;
  border-radius: 999px;
  background: var(--page-bg, #f2f2f2);
  color: #0a0a0a;
  border: 1px solid rgba(0, 0, 0, 0.18);
  text-decoration: none;
  font-size: clamp(0.8125rem, 1.15vw, 0.9375rem);
  font-weight: 600;
  letter-spacing: -0.015em;
  white-space: nowrap;
  flex-shrink: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.hero__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.28);
}

.hero__cta-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #000;
  flex-shrink: 0;
}

/* Área bajo la navbar: altura explícita para que la card no colapse (flex min-height:0) */
.hero__stage {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  /* Card casi al borde; solo gutter fino a los costados */
  padding: clamp(0.35rem, 0.9vw, 0.55rem) var(--stage-gutter-x) clamp(0.3rem, 1vw, 0.55rem);
  box-sizing: border-box;
  pointer-events: none;
}

.hero__card-stack {
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  will-change: transform;
  overflow: visible;
  z-index: 1;
}

.hero__card {
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  /* Radios grandes y uniformes ~24–32px */
  border-radius: clamp(1.375rem, 2.4vw, 2rem);
  overflow: hidden;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.06),
    0 16px 40px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
}

/* Fuera del flex: no resta altura a .hero__card; tapa el hueco bajo los bordes redondeados */
.hero__card-foot {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% - 1px);
  /* ~30% del tamaño anterior (reducción del 70%) */
  height: clamp(8px, 1.15vw, 18px);
  background: var(--page-bg, #f2f2f2);
  pointer-events: none;
  z-index: 4;
}

.hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-color: #111;
  background-image: url("../assets/imagenHero.jpg");
  background-size: cover;
  background-position: center 26%;
  background-repeat: no-repeat;
}

.hero__bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.5) 0%,
    transparent 50%
  );
  pointer-events: none;
}

.hero__inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  color: #fff;
}

.hero__shell {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 0;
  padding: clamp(1.25rem, 3vw, 2rem) var(--pad-x) 0;
  padding-bottom: 0;
  box-sizing: border-box;
}

.hero__main {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
  padding: clamp(1rem, 4vh, 2.5rem) 0;
}

.hero__mid {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: clamp(2rem, 5vw, 5rem);
  width: 100%;
}

.hero__lede {
  margin: 0;
  max-width: 17rem;
  font-size: clamp(0.8125rem, 1.2vw, 0.9375rem);
  line-height: 1.55;
  font-weight: 400;
  color: #fff;
  text-align: left;
}

.hero__services {
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: right;
  font-family: "Inter", system-ui, sans-serif;
  font-weight: 400;
  font-size: clamp(0.8125rem, 1.15vw, 0.9375rem);
  line-height: 1.55;
  letter-spacing: 0.01em;
  color: #fff;
}

.hero__bottom {
  flex: 0 0 auto;
  width: calc(100% + 2 * var(--pad-x));
  margin-left: calc(-1 * var(--pad-x));
  margin-right: calc(-1 * var(--pad-x));
  padding-left: var(--edge-bottom-x);
  padding-right: var(--edge-bottom-x);
  padding-top: clamp(0.5rem, 3vh, 1.75rem);
  padding-bottom: var(--edge-bottom-x);
  box-sizing: border-box;
}

.hero__bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) var(--thumb-w);
  grid-template-rows: auto;
  column-gap: clamp(1rem, 3vw, 2.75rem);
  width: 100%;
  /* Fila única: el nombre queda abajo; el carrusel entre centro y baseline del bloque */
  align-items: center;
}

.hero__brand {
  grid-column: 1;
  grid-row: 1;
  align-self: end;
  min-width: 0;
  line-height: 0;
}

.hero__carousel {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: 100%;
  max-width: var(--thumb-w);
  justify-self: end;
  align-self: center;
  /* Desplaza respecto al centro del grid: abajo y un poco hacia el nombre */
  transform: translate(
    clamp(-2.25rem, -5vw, -0.85rem),
    clamp(3.75rem, 9vw, 6.75rem)
  );
}

.hero__mega-logo {
  display: block;
  width: auto;
  max-width: min(100%, 96vw);
  height: clamp(6.5rem, 30vw, 24rem);
  object-fit: contain;
  object-position: left bottom;
}

.hero__mega-logo--light {
  filter: brightness(0) invert(1)
    drop-shadow(0 10px 40px rgba(0, 0, 0, 0.42));
}

.hero__thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 0;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.35);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.5);
  background: #0a1628;
}

.hero__thumb-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 22%;
  transform: scale(1.04);
  filter: saturate(0.92) hue-rotate(168deg) contrast(1.12) brightness(0.92);
}

.hero__progress {
  display: flex;
  align-items: flex-end;
  gap: 0.4rem;
  width: 100%;
  height: 4px;
}

.hero__tick {
  flex: 1;
  min-width: 0;
  height: 2px;
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 0;
  background: rgba(255, 255, 255, 0.22);
  cursor: pointer;
  align-self: flex-end;
  appearance: none;
  font: inherit;
  color: inherit;
}

.hero__tick:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.85);
  outline-offset: 3px;
}

.hero__tick--on {
  height: 4px;
  background: #fff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.45);
}

.hero__tick-label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.hero__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1200px) {
  .hero {
    --menu-gap: clamp(0.85rem, 2.4vw, 1.65rem);
  }
}

@media (max-width: 960px) and (min-width: 769px) {
  .hero {
    --header-total: clamp(8.6rem, 28.8vw, 11.5rem);
  }
}

@media (max-width: 960px) {
  .hero__nav {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    row-gap: 1rem;
  }

  .hero__logo {
    grid-column: unset;
    justify-self: unset;
  }

  .hero__menu {
    grid-column: unset;
    justify-self: unset;
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    row-gap: 0.65rem;
    column-gap: var(--menu-gap);
    padding-inline: 0;
  }

  .hero__cta {
    grid-column: unset;
    justify-self: unset;
    align-self: flex-end;
    width: fit-content;
  }
}

@media (max-width: 768px) {
  .hero__header {
    position: relative;
  }

  .hero {
    padding-top: 0;
    height: auto;
    min-height: 100dvh;
    max-height: none;
    overflow-x: clip;
    overflow-y: visible;
  }

  .hero__stage {
    flex: 1 1 auto;
    min-height: calc(100dvh - var(--header-total));
  }

  .hero__shell {
    padding-top: 1.25rem;
    min-height: auto;
  }

  .hero__main {
    justify-content: flex-start;
    padding-top: 0.5rem;
  }

  .hero__mid {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .hero__services {
    text-align: left;
    align-self: flex-start;
  }

  .hero__bottom {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
    padding-left: var(--pad-x);
    padding-right: var(--pad-x);
    padding-bottom: clamp(0.75rem, 3vh, 1.25rem);
  }

  .hero__bottom-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    justify-items: stretch;
    align-items: start;
  }

  .hero__brand {
    grid-column: 1;
    grid-row: 1;
  }

  .hero__carousel {
    grid-column: 1;
    grid-row: 2;
    max-width: min(100%, 10.5rem);
    justify-self: end;
    transform: none;
  }

  .hero__thumb {
    max-width: 100%;
  }

  .hero__mega-logo {
    max-width: 100%;
    height: clamp(3.25rem, 22vw, 6rem);
  }

  .hero__card {
    border-radius: clamp(1rem, 3vw, 1.35rem);
  }
}
</style>
