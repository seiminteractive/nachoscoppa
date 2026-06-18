<template>
  <AdminPage title="Agenda" subtitle="Fechas del tour.">
    <template #actions>
      <UiButton @click="openCreate">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
        Nueva fecha
      </UiButton>
    </template>

    <p v-if="!items.length" class="empty">Todavía no hay fechas.</p>
    <div v-else class="agenda-grid">
      <article v-for="t in sortedItems" :key="t.id" class="agenda-card">
        <div class="agenda-card__cal" aria-hidden="true">
          <span class="agenda-card__day">{{ fmt(t.date).day }}</span>
          <span class="agenda-card__mon">{{ fmt(t.date).mon }}</span>
        </div>
        <div class="agenda-card__body">
          <div class="agenda-card__head">
            <p class="agenda-card__city">{{ t.city }}</p>
            <span v-if="t.ticketsEnabled && t.ticketsUrl" class="adm-tag">Tickets</span>
          </div>
          <p class="agenda-card__country">
            <span v-if="t.flagCode" :class="`fi fi-${t.flagCode} agenda-card__flag`" aria-hidden="true" />
            {{ t.country }}
          </p>
          <p class="agenda-card__year">{{ fmt(t.date).full }}</p>
          <div class="agenda-card__actions">
            <UiButton variant="secondary" size="sm" @click="openEdit(t)">Editar</UiButton>
            <UiButton variant="danger" size="sm" @click="onDelete(t)">Borrar</UiButton>
          </div>
        </div>
      </article>
    </div>

    <UiModal v-model="open" :title="editing?.id ? 'Editar fecha' : 'Nueva fecha'">
      <form id="agenda-form" class="adm-form" @submit.prevent="onSave">
        <label class="adm-field">
          <span>Fecha</span>
          <input v-model="editing.date" type="date" required />
        </label>
        <label class="adm-field">
          <span>Ciudad / Provincia / Estado</span>
          <input v-model="editing.city" required placeholder="Barcelona" />
        </label>
        <label class="adm-field adm-field--full">
          <span>País</span>
          <CountrySuggest v-model="editing.country" required />
        </label>

        <div class="adm-field adm-field--full">
          <UiSwitch v-model="editing.ticketsEnabled" label="Mostrar botón de tickets" />
        </div>
        <label v-if="editing.ticketsEnabled" class="adm-field adm-field--full">
          <span>Link para tickets</span>
          <input v-model="editing.ticketsUrl" type="url" placeholder="https://..." />
        </label>

        <p class="agenda-hint adm-field--full">
          La ubicación (país, bandera y posición en el mapa) se calcula automáticamente a partir de la ciudad y el país.
        </p>
      </form>
      <template #footer>
        <UiButton variant="ghost" @click="open = false">Cancelar</UiButton>
        <UiButton type="submit" form="agenda-form" :loading="saving">
          {{ saving && geoStatus ? geoStatus : "Guardar" }}
        </UiButton>
      </template>
    </UiModal>
  </AdminPage>
</template>

<script setup>
import { ref, computed } from "vue";
import { toast } from "vue-sonner";
import "flag-icons/css/flag-icons.min.css";
import AdminPage from "../../components/admin/AdminPage.vue";
import CountrySuggest from "../../components/admin/CountrySuggest.vue";
import UiButton from "../../components/admin/ui/UiButton.vue";
import UiModal from "../../components/admin/ui/UiModal.vue";
import UiSwitch from "../../components/admin/ui/UiSwitch.vue";
import { confirm } from "../../composables/useConfirm";
import { useAgendaEvents } from "../../composables/content";
import { createDoc, patchDoc, removeDoc } from "../../composables/useFirestore";
import { geocodePlace } from "../../lib/geocode";
import { COUNTRIES, normalize } from "../../lib/countries";

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** "2026-04-05" -> { day:"05", mon:"ABR", full:"5 de abril de 2026" } */
function fmt(iso) {
  const [y, m, d] = String(iso || "").split("-").map(Number);
  if (!y || !m || !d) return { day: "--", mon: "—", full: iso || "" };
  const date = new Date(y, m - 1, d);
  const full = date.toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });
  return { day: String(d).padStart(2, "0"), mon: (MONTHS[m - 1] || "").toUpperCase(), full };
}

/** Si el país coincide con la lista, devuelve su ISO-2; si no, "". */
function codeFromCountryName(name) {
  const n = normalize(name);
  return COUNTRIES.find((c) => normalize(c.name) === n)?.code || "";
}

const { items } = useAgendaEvents();
const sortedItems = computed(() =>
  [...items.value].sort((a, b) => String(a.date).localeCompare(String(b.date))),
);
const editing = ref(blank());
const open = ref(false);
const saving = ref(false);
const geoStatus = ref("");

function blank() {
  return { date: "", city: "", country: "", ticketsEnabled: false, ticketsUrl: "" };
}

function openCreate() {
  editing.value = blank();
  open.value = true;
}
function openEdit(t) {
  editing.value = { ticketsEnabled: false, ticketsUrl: "", ...t };
  open.value = true;
}

/** Reusar geocoding solo si ya hay coords y ciudad/país no cambiaron. */
function needsGeocode(curr, prev) {
  if (!prev) return true;
  if (curr.lat == null || curr.lon == null || !curr.countryCode) return true;
  return curr.city !== prev.city || curr.country !== prev.country;
}

async function onSave() {
  saving.value = true;
  try {
    const { id, ...rest } = editing.value;
    const prev = id ? items.value.find((e) => e.id === id) : null;

    let geo = {
      lat: rest.lat ?? null,
      lon: rest.lon ?? null,
      countryCode: rest.countryCode || "",
    };
    if (needsGeocode(rest, prev)) {
      geoStatus.value = "Ubicando…";
      geo = await geocodePlace(rest.city, rest.country);
    }

    const countryCode = codeFromCountryName(rest.country) || geo.countryCode;

    const payload = {
      date: rest.date,
      city: rest.city.trim(),
      country: rest.country.trim(),
      countryCode,
      flagCode: countryCode.toLowerCase(),
      lat: geo.lat,
      lon: geo.lon,
      ticketsEnabled: !!rest.ticketsEnabled,
      ticketsUrl: rest.ticketsEnabled ? (rest.ticketsUrl || "").trim() : "",
    };

    if (id) await patchDoc(`agendaEvents/${id}`, payload);
    else await createDoc("agendaEvents", payload);
    open.value = false;
    toast.success(id ? "Fecha actualizada" : "Fecha agregada");
  } catch (e) {
    toast.error("No se pudo guardar la fecha", { description: e?.message });
  } finally {
    saving.value = false;
    geoStatus.value = "";
  }
}

async function onDelete(t) {
  const ok = await confirm({
    title: "Borrar fecha",
    message: `Se eliminará la fecha del ${t.date} en ${t.city}.`,
    confirmLabel: "Borrar",
    tone: "danger",
  });
  if (!ok) return;
  await removeDoc(`agendaEvents/${t.id}`);
  toast.success("Fecha borrada");
}
</script>

<style scoped>
.agenda-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
  gap: 0.85rem;
}

.agenda-card {
  display: flex;
  gap: 0.9rem;
  padding: 1rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0)),
    var(--adm-surface);
  border: 1px solid var(--adm-border);
  border-radius: var(--adm-radius-lg);
  transition: border-color 0.2s var(--adm-ease), transform 0.2s var(--adm-ease);
}
.agenda-card:hover {
  border-color: var(--adm-border-strong);
  transform: translateY(-2px);
}

.agenda-card__cal {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: var(--adm-radius);
  background: var(--adm-bg);
  border: 1px solid var(--adm-hairline);
}
.agenda-card__day {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--adm-text);
  font-variant-numeric: tabular-nums;
}
.agenda-card__mon {
  margin-top: 0.15rem;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--adm-accent);
}

.agenda-card__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.agenda-card__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.agenda-card__city {
  margin: 0;
  font-size: 1rem;
  font-weight: 650;
  letter-spacing: -0.01em;
  color: var(--adm-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.agenda-card__country {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--adm-text-2);
}
.agenda-card__flag {
  width: 1.15rem;
  height: 0.82rem;
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}
.agenda-card__year {
  margin: 0.1rem 0 0;
  font-size: 0.78rem;
  color: var(--adm-text-3);
}
.agenda-card__actions {
  margin-top: 0.7rem;
  display: flex;
  gap: 0.4rem;
}

.agenda-hint {
  margin: 0;
  font-size: 0.78rem;
  color: var(--adm-text-3);
  line-height: 1.45;
}
</style>
