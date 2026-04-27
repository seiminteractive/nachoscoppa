<template>
  <div class="event-list">
    <div class="event-list__head">
      <div class="event-list__head-main">
        <p class="event-list__kicker">Upcoming</p>
        <p class="event-list__count">
          <template v-if="hasMoreThanVisible">
            {{ visibleEvents.length }} próximas
            <span class="event-list__count-total">
              · {{ filteredEvents.length }}
              {{ filteredEvents.length === 1 ? "fecha" : "fechas" }}
            </span>
          </template>
          <template v-else>
            {{ filteredEvents.length }}
            {{ filteredEvents.length === 1 ? "fecha" : "fechas" }}
          </template>
          <template v-if="selectedCountry && selectedLabel">
            ·
            <span class="event-list__filter-label">{{ selectedLabel }}</span>
          </template>
        </p>
      </div>
      <button
        v-if="selectedCountry"
        type="button"
        class="event-list__reset"
        @click="$emit('clear')"
      >
        <span class="event-list__reset-dot" aria-hidden="true" />
        Ver todos
      </button>
    </div>

    <TransitionGroup tag="ul" name="event" class="event-list__items" role="list">
      <li
        v-for="ev in visibleEvents"
        :key="ev.id"
        class="event-list__item"
      >
        <div class="event-list__date">
          <span class="event-list__day">{{ formatDay(ev.date) }}</span>
          <span class="event-list__month">{{ formatMonth(ev.date) }}</span>
        </div>
        <div class="event-list__body">
          <p class="event-list__city">{{ ev.city }}</p>
          <p class="event-list__country">
            <span class="event-list__flag">
              <span :class="`fi fi-${ev.flagCode}`" aria-hidden="true" />
            </span>
            <span>{{ ev.country }}</span>
            <template v-if="ev.venue">
              <span class="event-list__dot" aria-hidden="true">·</span>
              <span class="event-list__venue">{{ ev.venue }}</span>
            </template>
          </p>
        </div>
        <span class="event-list__chevron" aria-hidden="true">→</span>
      </li>
    </TransitionGroup>

    <p v-if="visibleEvents.length === 0" class="event-list__empty">
      No hay fechas para este país todavía.
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  events: { type: Array, required: true },
  selectedCountry: { type: String, default: "" },
  /** Si se define, solo se listan las primeras N fechas (orden cronológico). */
  maxVisible: { type: Number, default: null },
});

defineEmits(["clear"]);

const filteredEvents = computed(() => {
  const list = props.selectedCountry
    ? props.events.filter((ev) => ev.countryCode === props.selectedCountry)
    : props.events;
  return [...list].sort((a, b) => a.date.localeCompare(b.date));
});

const visibleEvents = computed(() => {
  const list = filteredEvents.value;
  const cap = props.maxVisible;
  if (cap != null && cap > 0 && list.length > cap) {
    return list.slice(0, cap);
  }
  return list;
});

const hasMoreThanVisible = computed(() => {
  const cap = props.maxVisible;
  if (cap == null || cap < 1) return false;
  return filteredEvents.value.length > cap;
});

const selectedLabel = computed(() => {
  if (!props.selectedCountry) return "";
  const found = props.events.find(
    (ev) => ev.countryCode === props.selectedCountry
  );
  return found ? found.country : "";
});

const MONTHS_ES = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

function parseDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

function formatDay(iso) {
  const { d } = parseDate(iso);
  return String(d).padStart(2, "0");
}

function formatMonth(iso) {
  const { m } = parseDate(iso);
  return MONTHS_ES[m - 1] || "";
}
</script>

<style scoped>
.event-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  min-height: 0;
}

.event-list__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid rgba(10, 10, 10, 0.08);
}

.event-list__kicker {
  margin: 0 0 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.45);
}

.event-list__count {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  color: #0a0a0a;
}

.event-list__filter-label {
  color: rgba(10, 10, 10, 0.6);
  font-weight: 500;
}

.event-list__count-total {
  font-weight: 500;
  color: rgba(10, 10, 10, 0.5);
  font-size: 0.92em;
}

.event-list__reset {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: transparent;
  border: 1px solid rgba(10, 10, 10, 0.18);
  color: #0a0a0a;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;
}

.event-list__reset:hover {
  border-color: rgba(10, 10, 10, 0.45);
  background: rgba(10, 10, 10, 0.03);
}

.event-list__reset:active {
  transform: scale(0.98);
}

.event-list__reset-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0a0a0a;
}

.event-list__items {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.event-list__item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.2rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(10, 10, 10, 0.07);
  transition: background 0.2s ease, padding 0.2s ease;
}

.event-list__item:last-child {
  border-bottom: none;
}

.event-list__item:hover {
  background: rgba(10, 10, 10, 0.02);
  padding-inline: 0.4rem;
}

.event-list__date {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 3.25rem;
  line-height: 1;
}

.event-list__day {
  font-size: clamp(1.5rem, 2vw, 1.9rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  color: #0a0a0a;
  font-variant-numeric: tabular-nums;
}

.event-list__month {
  margin-top: 0.2rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: rgba(10, 10, 10, 0.5);
}

.event-list__body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.event-list__city {
  margin: 0;
  font-size: clamp(1rem, 1.6vw, 1.15rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #0a0a0a;
}

.event-list__country {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: rgba(10, 10, 10, 0.6);
  letter-spacing: -0.005em;
}

.event-list__flag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.1rem;
  height: 0.78rem;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(10, 10, 10, 0.06);
}

/* flag-icons fi class sets background. Forzamos tamaño exacto de bandera */
.event-list__flag :deep(.fi) {
  display: block;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  line-height: 1;
}

.event-list__dot {
  opacity: 0.4;
}

.event-list__venue {
  color: rgba(10, 10, 10, 0.55);
}

.event-list__chevron {
  color: rgba(10, 10, 10, 0.35);
  font-size: 1rem;
  transition: transform 0.2s ease, color 0.2s ease;
}

.event-list__item:hover .event-list__chevron {
  color: #0a0a0a;
  transform: translateX(3px);
}

.event-list__empty {
  margin: 0;
  padding: 1rem 0;
  color: rgba(10, 10, 10, 0.55);
  font-size: 0.95rem;
}

/* Transiciones al filtrar */
.event-enter-active,
.event-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.event-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.event-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.event-leave-active {
  position: absolute;
  left: 0;
  right: 0;
}

@media (prefers-reduced-motion: reduce) {
  .event-enter-active,
  .event-leave-active {
    transition: none;
  }
}
</style>
