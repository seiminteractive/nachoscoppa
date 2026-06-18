<template>
  <AdminPage title="Dashboard" subtitle="Resumen del contenido y acciones rápidas.">
    <div class="dash">
      <form class="adm-card dash__stats" @submit.prevent="onSaveStats">
        <div class="dash__stats-head">
          <h2 class="dash__section-title">Cifras destacadas</h2>
          <p class="dash__section-sub">Se muestran en “Sobre el artista” y Music.</p>
        </div>
        <div class="adm-form">
          <label class="adm-field">
            <span>Países</span>
            <input v-model.number="stats.countries" type="number" min="0" />
          </label>
          <label class="adm-field">
            <span>Oyentes mensuales (ej. 74)</span>
            <input v-model.number="stats.monthlyListeners" type="number" min="0" />
          </label>
          <label class="adm-field">
            <span>Tracks count (ej. 26)</span>
            <input v-model.number="stats.tracksCount" type="number" min="0" />
          </label>
          <label class="adm-field">
            <span>Año de inicio (ej. 2014)</span>
            <input v-model.number="stats.sinceYear" type="number" min="1990" />
          </label>
          <div class="adm-field adm-field--full dash__stats-foot">
            <UiButton type="submit" :loading="savingStats">Guardar cifras</UiButton>
          </div>
        </div>
      </form>

      <div class="dash__cards">
        <RouterLink
          v-for="card in cards"
          :key="card.label"
          :to="{ name: card.to }"
          class="dash__card"
        >
          <span class="dash__card-icon" v-html="card.icon" aria-hidden="true" />
          <span class="dash__num">{{ card.value }}</span>
          <span class="dash__label">{{ card.label }}</span>
        </RouterLink>
      </div>

      <div class="adm-card dash__ig">
        <div class="dash__ig-info">
          <span class="dash__ig-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <div>
            <h2 class="dash__ig-title">
              Instagram
              <span v-if="igMeta?.status" :class="['dash__pill', `dash__pill--${igMeta.status}`]">
                {{ igMeta.status }}
              </span>
            </h2>
            <p class="dash__ig-meta">Último sync: {{ lastRun }} · {{ igMeta?.postCount ?? 0 }} posts</p>
          </div>
        </div>
        <UiButton variant="secondary" :loading="syncing" @click="onSync">
          {{ syncing ? "Sincronizando…" : "Sincronizar ahora" }}
        </UiButton>
      </div>
    </div>
  </AdminPage>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { RouterLink } from "vue-router";
import { httpsCallable } from "firebase/functions";
import { toast } from "vue-sonner";
import AdminPage from "../../components/admin/AdminPage.vue";
import UiButton from "../../components/admin/ui/UiButton.vue";
import {
  useTracks,
  useLabels,
  usePressNotes,
  useLiveSets,
  useAgendaEvents,
  useInstagramMeta,
  useSiteStats,
} from "../../composables/content";
import { upsertDoc } from "../../composables/useFirestore";
import { functions } from "../../lib/firebase";

const { items: tracks } = useTracks();
const { items: labels } = useLabels();
const { items: press } = usePressNotes();
const { items: liveSets } = useLiveSets();
const { items: events } = useAgendaEvents();
const { data: igMeta } = useInstagramMeta();

// Cifras destacadas (siteStats)
const { data: statsData } = useSiteStats();
const stats = ref({ countries: 27, monthlyListeners: 74, tracksCount: 26, sinceYear: 2014 });
const savingStats = ref(false);

let statsHydrated = false;
watch(statsData, (v) => {
  if (!v || statsHydrated) return;
  stats.value = {
    countries: v.countries ?? 27,
    monthlyListeners: v.monthlyListeners ?? 74,
    tracksCount: v.tracksCount ?? 26,
    sinceYear: v.sinceYear ?? 2014,
  };
  statsHydrated = true;
}, { immediate: true });

async function onSaveStats() {
  savingStats.value = true;
  try {
    await upsertDoc("siteStats/main", stats.value);
    toast.success("Cifras guardadas");
  } catch (e) {
    toast.error("No se pudo guardar", { description: e?.message });
  } finally {
    savingStats.value = false;
  }
}

const ic = (path) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const cards = computed(() => [
  { label: "Tracks", value: tracks.value.length, to: "admin-tracks", icon: ic('<circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><path d="M9 18V5l12-2v11"/>') },
  { label: "Labels", value: labels.value.length, to: "admin-labels", icon: ic('<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10z"/><circle cx="7.5" cy="7.5" r="1.5"/>') },
  { label: "Entrevistas", value: press.value.length, to: "admin-press", icon: ic('<path d="M4 5h16v11H8l-4 4z"/>') },
  { label: "Sets en vivo", value: liveSets.value.length, to: "admin-livesets", icon: ic('<rect x="3" y="3" width="18" height="14" rx="2"/><path d="M10 8l5 3-5 3z" fill="currentColor"/>') },
  { label: "Fechas de agenda", value: events.value.length, to: "admin-agenda", icon: ic('<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>') },
]);

const syncing = ref(false);

const lastRun = computed(() => {
  const ts = igMeta.value?.lastRunAt;
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString();
});

async function onSync() {
  syncing.value = true;
  const t = toast.loading("Sincronizando Instagram…");
  try {
    const call = httpsCallable(functions, "syncInstagram");
    const res = await call({});
    toast.success(`Instagram sincronizado · ${res?.data?.count ?? 0} posts`, { id: t });
  } catch (e) {
    toast.error("Falló la sincronización", { id: t, description: e?.message });
  } finally {
    syncing.value = false;
  }
}
</script>

<style scoped>
.dash {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.dash__stats {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.dash__section-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.dash__section-sub {
  margin: 0.2rem 0 0;
  font-size: 0.82rem;
  color: var(--adm-text-2);
}
.dash__stats-foot {
  flex-direction: row;
  justify-content: flex-end;
}

.dash__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10.5rem, 1fr));
  gap: 0.85rem;
}

.dash__card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.1rem 1.15rem;
  border-radius: var(--adm-radius-lg);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0)),
    var(--adm-surface);
  border: 1px solid var(--adm-border);
  text-decoration: none;
  color: var(--adm-text);
  transition: border-color 0.2s var(--adm-ease), transform 0.2s var(--adm-ease),
    background 0.2s var(--adm-ease);
}
.dash__card:hover {
  border-color: var(--adm-border-strong);
  transform: translateY(-2px);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0)),
    var(--adm-surface-2);
}
.dash__card-icon {
  display: inline-flex;
  color: var(--adm-accent);
}
.dash__num {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
}
.dash__label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--adm-text-2);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.dash__ig {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.dash__ig-info {
  display: flex;
  align-items: center;
  gap: 0.9rem;
}
.dash__ig-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: var(--adm-radius);
  background: linear-gradient(135deg, #feda75, #d62976 45%, #962fbf 75%, #4f5bd5);
  color: #fff;
  flex: none;
}
.dash__ig-title {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
}
.dash__ig-meta {
  margin: 0.2rem 0 0;
  font-size: 0.82rem;
  color: var(--adm-text-2);
}
.dash__pill {
  display: inline-block;
  padding: 0.1rem 0.45rem;
  border-radius: var(--adm-pill);
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  background: rgba(255, 255, 255, 0.1);
  color: var(--adm-text-2);
}
.dash__pill--ok { background: var(--adm-success-soft); color: #6ee7a0; }
.dash__pill--error { background: var(--adm-danger-soft); color: #ff8078; }
.dash__pill--running { background: var(--adm-accent-soft); color: var(--adm-accent); }

@media (max-width: 560px) {
  .dash__cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }
  .dash__card {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "icon num"
      "label label";
    align-items: center;
    gap: 0.1rem 0.6rem;
    padding: 0.85rem 0.9rem;
    border-radius: var(--adm-radius);
  }
  .dash__card-icon {
    grid-area: icon;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.6rem;
    background: var(--adm-accent-soft);
  }
  .dash__num {
    grid-area: num;
    font-size: 1.5rem;
  }
  .dash__label {
    grid-area: label;
    margin-top: 0.35rem;
    font-size: 0.68rem;
  }
  .dash__cards .dash__card:last-child {
    grid-column: 1 / -1;
  }
  .dash__ig { gap: 0.85rem; }
  .dash__ig-info { gap: 0.7rem; }
  .dash__ig-icon { width: 2.5rem; height: 2.5rem; }
}
</style>
