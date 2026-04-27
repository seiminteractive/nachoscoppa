<template>
  <section
    id="agenda"
    ref="sectionRef"
    class="agenda"
    :class="{ 'agenda--full': isFull }"
    aria-labelledby="agenda-heading"
  >
    <div class="agenda__inner">
      <header class="agenda__head">
        <div class="agenda__head-bar">
          <div class="agenda__badge-row">
            <span class="agenda__badge-icon" aria-hidden="true">
              <span class="agenda__badge-plus">+</span>
            </span>
            <p class="agenda__badge-label">Próximas fechas</p>
          </div>
          <p ref="agendaMetaRef" class="agenda__meta" aria-hidden="true">(00)</p>
        </div>
        <h2 id="agenda-heading" class="agenda__title">Agenda.</h2>
        <p class="agenda__lede">
          <template v-if="isFull">
            Todas las fechas confirmadas del tour y las presentaciones en vivo de Nacho Scoppa —
            clubes, festivales y ciudades donde lleva su sonido a escenarios internacionales.
          </template>
          <template v-else>
            Calendario de gira y shows en vivo: clubes, festivales y fechas donde Nacho presenta
            su sonido alrededor del mundo.
          </template>
        </p>
      </header>

      <div
        class="agenda__grid"
        :class="{ 'agenda__grid--full': isFull }"
      >
        <div class="agenda__map">
          <WorldMap
            :events="events"
            :selected-country="selectedCountry"
            fit="contain"
            navigable
            @select="onSelectCountry"
            @clear="clearSelection"
          />
        </div>

        <div class="agenda__list-col">
          <div class="agenda__list">
            <EventList
              :events="events"
              :selected-country="selectedCountry"
              :max-visible="isFull ? null : PREVIEW_LIMIT"
              @clear="clearSelection"
            />
          </div>
          <div
            v-if="!isFull && showViewAllCta"
            class="agenda__view-all"
          >
            <RouterLink
              to="/agenda"
              class="agenda__view-all-btn"
            >
              Ver todas las fechas
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { RouterLink } from "vue-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "flag-icons/css/flag-icons.min.css";
import WorldMap from "./agenda/WorldMap.vue";
import EventList from "./agenda/EventList.vue";
import { EVENTS } from "./agenda/data.js";
import { revealOnScroll } from "../composables/scrollReveal";
import { countUpOnScroll } from "../composables/countUpOnScroll";

gsap.registerPlugin(ScrollTrigger);

const PREVIEW_LIMIT = 12;

const props = defineProps({
  variant: {
    type: String,
    default: "preview",
    validator: (v) => v === "preview" || v === "full",
  },
});

const isFull = computed(() => props.variant === "full");

const events = EVENTS;
const selectedCountry = ref("");
const sectionRef = ref(null);
const agendaMetaRef = ref(null);
let agendaScrollCtx;

const eventTotal = events.length;

const sortedFilteredCount = computed(() => {
  const list = selectedCountry.value
    ? events.filter((ev) => ev.countryCode === selectedCountry.value)
    : events;
  return [...list].sort((a, b) => a.date.localeCompare(b.date)).length;
});

const showViewAllCta = computed(
  () => sortedFilteredCount.value > PREVIEW_LIMIT,
);

function onSelectCountry(code) {
  selectedCountry.value = selectedCountry.value === code ? "" : code;
}

function clearSelection() {
  selectedCountry.value = "";
}

onMounted(() => {
  nextTick(() => {
    const section = sectionRef.value;
    if (!section) return;

    agendaScrollCtx = gsap.context(() => {
      const head = section.querySelector(".agenda__head");
      const map = section.querySelector(".agenda__map");
      const listCol = section.querySelector(".agenda__list-col");
      for (const el of [head, map, listCol].filter((n) => n instanceof HTMLElement)) {
        revealOnScroll(el, [el]);
      }
      const meta = agendaMetaRef.value;
      if (head && meta) {
        countUpOnScroll(head, meta, {
          to: eventTotal,
          format: (v) => `(${String(Math.round(v)).padStart(2, "0")})`,
        });
      }
    }, section);

    ScrollTrigger.refresh();
  });
});

onUnmounted(() => {
  agendaScrollCtx?.revert();
});
</script>

<style scoped>
.agenda {
  background: var(--page-bg, #f2f2f2);
  color: #0a0a0a;
  padding: clamp(3.5rem, 8vw, 6.5rem) var(--site-pad-x, clamp(1rem, 4vw, 3rem))
    clamp(3rem, 7vw, 5.5rem);
}

.agenda--full {
  padding-top: clamp(2rem, 5vw, 3.25rem);
}

.agenda__inner {
  max-width: var(--site-content-max, 1320px);
  margin: 0 auto;
}

.agenda__head {
  display: flex;
  flex-direction: column;
  gap: clamp(0.85rem, 2vw, 1.15rem);
  margin-bottom: clamp(2rem, 4vw, 3rem);
  max-width: none;
}

/* Misma estética que “Release del momento” (FeaturedTrack) */
.agenda__head-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 clamp(0.15rem, 0.5vw, 0.35rem);
}

.agenda__badge-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
}

.agenda__badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: #0a0a0a;
  color: #fff;
  flex-shrink: 0;
}

.agenda__badge-plus {
  font-size: 1rem;
  font-weight: 300;
  line-height: 1;
  margin-top: -1px;
}

.agenda__badge-label {
  margin: 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: #0a0a0a;
}

.agenda__meta {
  margin: 0;
  flex-shrink: 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(0.8125rem, 1.15vw, 0.9375rem);
  font-weight: 500;
  color: #a3a3a3;
  letter-spacing: 0.02em;
}

/* Mismo criterio tipográfico que “Music.” en SplitRevealSection */
.agenda__title {
  margin: 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(3rem, 10.5vw, 7.25rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.92;
  color: #0a0a0a;
}

.agenda__lede {
  margin: 0;
  max-width: 36rem;
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(0.8125rem, 1.2vw, 0.96875rem);
  font-weight: 400;
  line-height: 1.6;
  color: #52525b;
  letter-spacing: -0.01em;
}

.agenda__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
  gap: clamp(1.25rem, 3vw, 2.5rem);
  align-items: start;
}

.agenda__grid--full {
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(1.75rem, 4vw, 2.75rem);
}

.agenda__map {
  position: sticky;
  top: calc(var(--site-header-offset, 4.5rem) + 1rem);
  align-self: start;
  width: 100%;
  border-radius: clamp(1rem, 1.6vw, 1.5rem);
  background: #ffffff;
  border: 1px solid rgba(10, 10, 10, 0.06);
  padding: clamp(0.75rem, 1.8vw, 1.5rem);
  overflow: hidden;
  aspect-ratio: 1009 / 666;
  min-height: 280px;
}

/* Vista /agenda: más alto + contain para ver el mundo completo; zoom/pan en WorldMap. */
.agenda--full .agenda__map {
  position: relative;
  top: auto;
  width: 100%;
  max-width: none;
  margin-inline: 0;
  aspect-ratio: unset;
  height: min(52vh, 520px);
  min-height: 300px;
  max-height: 560px;
  padding: clamp(0.5rem, 1.2vw, 1rem);
}

.agenda__list-col {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2vw, 1.35rem);
  min-width: 0;
}

.agenda__list {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: clamp(1rem, 2vw, 1.5rem) clamp(1rem, 2vw, 1.5rem)
    clamp(0.5rem, 1.5vw, 1rem);
  border-radius: clamp(1rem, 1.6vw, 1.5rem);
  background: #ffffff;
  border: 1px solid rgba(10, 10, 10, 0.06);
}

.agenda__view-all {
  display: flex;
  justify-content: center;
  padding-bottom: 0.25rem;
}

.agenda__view-all-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.65rem 1.35rem;
  border-radius: 999px;
  border: 1px solid rgba(10, 10, 10, 0.2);
  background: #0a0a0a;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.agenda__view-all-btn:hover {
  opacity: 0.88;
}

.agenda__view-all-btn:active {
  transform: scale(0.98);
}

.agenda__view-all-btn:focus-visible {
  outline: 2px solid #0a0a0a;
  outline-offset: 3px;
}

/* Responsive: en tablet / mobile mapa arriba, lista abajo */
@media (max-width: 1024px) {
  .agenda__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .agenda__map {
    position: relative;
    top: auto;
    aspect-ratio: 1009 / 666;
    min-height: 0;
    max-width: 44rem;
    margin-inline: auto;
  }

  .agenda--full .agenda__map {
    width: 100%;
    max-width: none;
    height: min(44vh, 400px);
    min-height: 260px;
    max-height: 440px;
  }
}

@media (max-width: 560px) {
  .agenda__map {
    padding: 0.75rem;
    border-radius: 1rem;
  }

  .agenda__list {
    padding: 1rem 1rem 0.5rem;
    border-radius: 1rem;
  }
}
</style>
