<template>
  <section
    id="featured-track"
    ref="sectionRef"
    class="featured"
    aria-labelledby="featured-track-title"
  >
    <div class="featured__inner">
      <header class="featured__head">
        <div class="featured__badge-row">
          <span class="featured__badge-icon" aria-hidden="true">
            <span class="featured__badge-plus">+</span>
          </span>
          <span class="featured__badge-label">Release del momento</span>
        </div>
        <p class="featured__meta" aria-hidden="true">
          <span ref="featuredMetaRef">(00)</span>
        </p>
      </header>

      <article v-if="track" class="featured__card" aria-describedby="featured-track-desc">
        <div class="featured__cover-wrap">
          <div class="featured__cover">
            <span class="featured__cover-corner" aria-hidden="true">+</span>
            <img
              class="featured__cover-img"
              :src="track.cover"
              :alt="`Portada — ${track.title}`"
              width="720"
              height="720"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div class="featured__info">
          <p class="featured__eyebrow">
            <span class="featured__dot" aria-hidden="true" />
            <span>Nuevo lanzamiento</span>
          </p>

          <h2 id="featured-track-title" class="featured__title">
            {{ track.title }}
          </h2>

          <dl class="featured__facts" aria-label="Detalles del release">
            <div class="featured__fact">
              <dt class="featured__fact-label">Label</dt>
              <dd class="featured__fact-value">{{ track.label }}</dd>
            </div>
            <div class="featured__fact">
              <dt class="featured__fact-label">Año</dt>
              <dd class="featured__fact-value">
                <span ref="featuredYearRef">{{ featuredYearFrom }}</span>
              </dd>
            </div>
            <div class="featured__fact">
              <dt class="featured__fact-label">Formato</dt>
              <dd class="featured__fact-value">{{ track.format }}</dd>
            </div>
          </dl>

          <p id="featured-track-desc" class="featured__desc">
            {{ track.description }}
          </p>

          <div class="featured__cta-row">
            <a
              v-for="link in track.links"
              :key="link.id"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="featured__cta"
              :class="link.primary ? 'featured__cta--primary' : 'featured__cta--ghost'"
            >
              <Icon :icon="link.icon" class="featured__cta-icon" aria-hidden="true" />
              <span>{{ link.label }}</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { revealOnScroll } from "../composables/scrollReveal";
import { revealTextOnScroll } from "../composables/revealTextOnScroll";
import { countUpOnScroll } from "../composables/countUpOnScroll";
import { useFeaturedTrack } from "../composables/content";

gsap.registerPlugin(ScrollTrigger);

const { data: featuredData } = useFeaturedTrack();

const track = computed(() => {
  const d = featuredData.value;
  if (!d?.title) return null;
  return {
    title: d.title,
    label: d.label ?? "",
    year: d.year ?? "",
    format: d.format ?? "",
    cover: d.cover ?? "",
    description: d.description ?? "",
    links: Array.isArray(d.links) ? d.links : [],
  };
});

const featuredYearFrom = computed(() => {
  const y = parseInt(track.value?.year ?? "", 10);
  return String(Number.isNaN(y) ? track.value?.year ?? "" : Math.max(y - 10, 1990));
});

const sectionRef = ref(null);
const featuredMetaRef = ref(null);
const featuredYearRef = ref(null);
let ctx;

onMounted(() => {
  nextTick(() => {
    const section = sectionRef.value;
    if (!section) return;

    ctx = gsap.context(() => {
      const inner = section.querySelector(".featured__inner");
      /** El <section> tiene padding-top; el borde superior disparaba el reveal antes de ver el bloque. */
      const triggerEl = inner ?? section;
      const head = section.querySelector(".featured__head");
      const cover = section.querySelector(".featured__cover-wrap");
      const info = section.querySelector(".featured__info");
      const targets = [head, cover, info].filter(Boolean);

      revealOnScroll(triggerEl, targets);

      const title = section.querySelector(".featured__title");
      const desc = section.querySelector(".featured__desc");
      if (title) revealTextOnScroll(title, { trigger: title, stagger: 0.06 });
      if (desc) revealTextOnScroll(desc, { trigger: desc, yPercent: 105, rotateX: -35, blur: 4, stagger: 0.015, duration: 0.95 });

      const metaEl = featuredMetaRef.value;
      if (head && metaEl) {
        countUpOnScroll(head, metaEl, {
          from: 0,
          to: 1,
          format: (v) => `(${String(Math.round(v)).padStart(2, "0")})`,
        });
      }
      const yearEl = featuredYearRef.value;
      const y = parseInt(track.value?.year ?? "", 10);
      if (info && yearEl && !Number.isNaN(y)) {
        countUpOnScroll(info, yearEl, {
          from: Math.max(y - 10, 1990),
          to: y,
          duration: 1.55,
          format: (v) => String(Math.round(v)),
        });
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
.featured {
  --featured-bg: var(--page-bg, #f2f2f2);
  --featured-black: #0a0a0a;
  --featured-muted: #525252;
  --featured-index: #a3a3a3;
  --featured-pad-x: var(--site-pad-x, clamp(1rem, 4vw, 3rem));
  position: relative;
  z-index: 1;
  padding: clamp(3rem, 8vh, 5rem) var(--featured-pad-x)
    clamp(8.5rem, 24vh, 15rem);
  background: var(--featured-bg);
  color: var(--featured-black);
  font-family: "Inter", system-ui, sans-serif;
}

.featured__inner {
  max-width: min(100%, var(--site-content-max, 1320px));
  margin: 0 auto;
}

.featured__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: clamp(1.75rem, 3.5vw, 2.75rem);
  padding: 0 clamp(0.15rem, 0.5vw, 0.35rem);
}

.featured__badge-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.featured__badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--featured-black);
  color: #fff;
}

.featured__badge-plus {
  font-size: 1rem;
  font-weight: 300;
  line-height: 1;
  margin-top: -1px;
}

.featured__badge-label {
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--featured-black);
}

.featured__meta {
  margin: 0;
  font-size: clamp(0.8125rem, 1.15vw, 0.9375rem);
  font-weight: 500;
  color: var(--featured-index);
  letter-spacing: 0.02em;
}

.featured__card {
  display: grid;
  grid-template-columns: minmax(0, auto) minmax(0, 36rem);
  gap: clamp(1.5rem, 4vw, 3.5rem);
  align-items: center;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
  width: fit-content;
  max-width: 100%;
  margin-inline: auto;
  box-sizing: border-box;
}

.featured__cover-wrap {
  width: clamp(12rem, 22vw, 18rem);
  min-width: 0;
  align-self: center;
}

.featured__cover {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: clamp(0.75rem, 1.2vw, 1rem);
  overflow: hidden;
  background: #e5e5e5;
  box-shadow: 0 1px 2px rgba(10, 10, 10, 0.05),
    0 18px 40px rgba(10, 10, 10, 0.08);
}

.featured__cover-corner {
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: var(--featured-black);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1;
}

.featured__cover-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured__info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: clamp(0.8rem, 1.4vw, 1.15rem);
  padding: 0;
  max-width: 36rem;
}

.featured__eyebrow {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  background: rgba(10, 10, 10, 0.04);
  color: var(--featured-black);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.featured__dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 2.5px rgba(34, 197, 94, 0.2);
  animation: featured-pulse 2.4s ease-in-out infinite;
}

@keyframes featured-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 2.5px rgba(34, 197, 94, 0.2);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(34, 197, 94, 0);
  }
}

.featured__title {
  margin: 0;
  font-size: clamp(1.65rem, 3.2vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.05;
  color: var(--featured-black);
}

.featured__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.75rem, 1.8vw, 1.25rem);
  margin: 0;
  padding: clamp(0.75rem, 1.4vw, 1rem) 0;
  border-top: 1px solid rgba(10, 10, 10, 0.08);
  border-bottom: 1px solid rgba(10, 10, 10, 0.08);
}

.featured__fact {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.featured__fact-label {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--featured-index);
}

.featured__fact-value {
  margin: 0;
  font-size: clamp(0.875rem, 1.05vw, 0.9375rem);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--featured-black);
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.featured__desc {
  margin: 0;
  font-size: clamp(0.875rem, 1.05vw, 0.9375rem);
  line-height: 1.55;
  color: var(--featured-muted);
  letter-spacing: -0.005em;
  max-width: 32rem;
}

.featured__cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.15rem;
}

.featured__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.2;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.2s ease, color 0.2s ease, border-color 0.2s ease,
    opacity 0.2s ease;
}

.featured__cta-icon {
  width: 0.95rem;
  height: 0.95rem;
}

.featured__cta--primary {
  background: var(--featured-black);
  color: #ffffff;
  border: 1px solid var(--featured-black);
}

.featured__cta--primary:hover,
.featured__cta--primary:focus-visible {
  transform: translateY(-1px);
  opacity: 0.92;
}

.featured__cta--ghost {
  background: transparent;
  color: var(--featured-black);
  border: 1px solid rgba(10, 10, 10, 0.18);
}

.featured__cta--ghost:hover,
.featured__cta--ghost:focus-visible {
  transform: translateY(-1px);
  background: rgba(10, 10, 10, 0.04);
  border-color: rgba(10, 10, 10, 0.28);
}

.featured__cta:focus-visible {
  outline: 2px solid var(--featured-black);
  outline-offset: 2px;
}

@media (max-width: 1200px) {
  .featured {
    /* Ritmo similar a Music (Split) → Release: ya no ~24vh antes de Sobre el artista */
    padding-bottom: clamp(2rem, 5.5vw, 3rem);
  }
}

@media (max-width: 768px) {
  .featured {
    /* Entre el default desktop (3–5rem) y el ajuste muy apretado */
    padding-top: clamp(2rem, 5.5vh, 3.25rem);
  }

  .featured__head {
    margin-bottom: clamp(1.35rem, 3.5vw, 2rem);
  }
}

@media (max-width: 820px) {
  .featured {
    /* Simétrico: la barra social ya no está en móvil; evita que el bloque se vea corrido a la izquierda */
    padding-left: clamp(1.35rem, 5.5vw, 2rem);
    padding-right: clamp(1.35rem, 5.5vw, 2rem);
  }

  .featured__head {
    padding-inline: 0;
  }

  .featured__card {
    grid-template-columns: minmax(0, 1fr);
    gap: clamp(1rem, 3.5vw, 1.75rem);
    width: 100%;
    margin-inline: 0;
  }

  .featured__cover-wrap {
    width: 100%;
    max-width: 18rem;
    margin: 0 auto;
  }

  .featured__info {
    max-width: 100%;
  }

  .featured__facts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .featured__facts {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.75rem 0;
  }

  .featured__cta-row {
    width: 100%;
  }

  .featured__cta {
    flex: 1 1 auto;
    justify-content: center;
  }
}
</style>
