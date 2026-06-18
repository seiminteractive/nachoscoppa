<template>
  <AdminPage title="Track destacado" subtitle="Release del momento (hero de la sección).">
    <form class="adm-card adm-form" @submit.prevent="onSave">
      <label class="adm-field">
        <span>Título</span>
        <input v-model="form.title" required />
      </label>
      <label class="adm-field">
        <span>Label</span>
        <input v-model="form.label" />
      </label>
      <label class="adm-field">
        <span>Año</span>
        <input v-model="form.year" />
      </label>
      <label class="adm-field">
        <span>Formato</span>
        <input v-model="form.format" placeholder="Single · digital" />
      </label>
      <label class="adm-field adm-field--full">
        <span>Descripción</span>
        <textarea v-model="form.description" />
      </label>
      <div class="adm-field adm-field--full">
        <span>Cover</span>
        <ImageUpload v-model="form.cover" folder="featured" />
      </div>

      <div class="adm-field adm-field--full">
        <span>Enlaces</span>
        <div class="links">
          <div v-for="(link, i) in form.links" :key="i" class="links__row">
            <input v-model="link.label" placeholder="Texto del botón" />
            <input v-model="link.href" placeholder="URL" type="url" />
            <div class="links__icon">
              <Icon v-if="link.icon" :icon="link.icon" class="links__icon-preview" aria-hidden="true" />
              <span v-else class="links__icon-preview links__icon-preview--empty" aria-hidden="true" />
              <select v-model="link.icon" aria-label="Icono">
                <option value="">Sin icono</option>
                <option v-for="opt in ICON_OPTIONS" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <UiSwitch v-model="link.primary" label="Primario" />
            <UiButton variant="danger" size="sm" icon aria-label="Quitar enlace" @click="form.links.splice(i, 1)">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </UiButton>
          </div>
          <UiButton variant="secondary" size="sm" @click="addLink">+ Agregar enlace</UiButton>
        </div>
      </div>

      <div class="adm-field adm-field--full form-foot">
        <UiButton type="submit" :loading="saving">Guardar cambios</UiButton>
      </div>
    </form>
  </AdminPage>
</template>

<script setup>
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import { toast } from "vue-sonner";
import AdminPage from "../../components/admin/AdminPage.vue";
import ImageUpload from "../../components/admin/ImageUpload.vue";
import UiButton from "../../components/admin/ui/UiButton.vue";
import UiSwitch from "../../components/admin/ui/UiSwitch.vue";
import { useFeaturedTrack } from "../../composables/content";
import { upsertDoc } from "../../composables/useFirestore";

const ICON_OPTIONS = [
  { value: "simple-icons:spotify", label: "Spotify" },
  { value: "simple-icons:applemusic", label: "Apple Music" },
  { value: "simple-icons:soundcloud", label: "SoundCloud" },
  { value: "simple-icons:beatport", label: "Beatport" },
  { value: "simple-icons:bandcamp", label: "Bandcamp" },
  { value: "simple-icons:youtube", label: "YouTube" },
  { value: "simple-icons:youtubemusic", label: "YouTube Music" },
  { value: "simple-icons:deezer", label: "Deezer" },
  { value: "simple-icons:tidal", label: "Tidal" },
  { value: "simple-icons:applepodcasts", label: "Apple Podcasts" },
  { value: "simple-icons:mixcloud", label: "Mixcloud" },
  { value: "simple-icons:instagram", label: "Instagram" },
];

const { data } = useFeaturedTrack();

const form = ref({
  title: "",
  label: "",
  year: "",
  format: "",
  cover: "",
  description: "",
  links: [],
});

let hydrated = false;
watch(
  data,
  (v) => {
    if (!v || hydrated) return;
    form.value = {
      title: v.title || "",
      label: v.label || "",
      year: v.year || "",
      format: v.format || "",
      cover: v.cover || "",
      description: v.description || "",
      links: Array.isArray(v.links) ? v.links.map((l) => ({ ...l })) : [],
    };
    hydrated = true;
  },
  { immediate: true },
);

const saving = ref(false);

function addLink() {
  form.value.links.push({ id: `l${Date.now()}`, label: "", href: "", icon: "", primary: false });
}

async function onSave() {
  saving.value = true;
  try {
    const payload = {
      ...form.value,
      links: form.value.links.map((l) => ({ ...l, id: l.id || `l${Math.random().toString(36).slice(2, 8)}` })),
    };
    await upsertDoc("featuredTrack/main", payload);
    toast.success("Track destacado guardado");
  } catch (e) {
    toast.error("No se pudo guardar", { description: e?.message });
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.links {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.links__row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.5fr) minmax(0, 1.1fr) auto auto;
  gap: 0.5rem;
  align-items: center;
}

.links__row input,
.links__row select {
  background: var(--adm-bg);
  border: 1px solid var(--adm-border);
  border-radius: var(--adm-radius-sm);
  padding: 0.5rem 0.6rem;
  color: var(--adm-text);
  font: inherit;
  font-size: 0.85rem;
}
.links__row input:focus,
.links__row select:focus {
  outline: none;
  border-color: var(--adm-accent);
  box-shadow: var(--adm-ring);
}

.links__icon {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  min-width: 0;
}
.links__icon select {
  flex: 1;
  min-width: 0;
  appearance: none;
  -webkit-appearance: none;
}
.links__icon-preview {
  flex: none;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 1.5rem;
  color: var(--adm-text);
}
.links__icon-preview--empty {
  border: 1px dashed var(--adm-border-strong);
  border-radius: 0.3rem;
}

.form-foot {
  flex-direction: row;
  justify-content: flex-end;
}

@media (max-width: 720px) {
  .links {
    gap: 0.7rem;
  }
  .links__row {
    grid-template-columns: 1fr auto;
    gap: 0.6rem;
    padding: 0.9rem;
    border: 1px solid var(--adm-border);
    border-radius: var(--adm-radius);
    background: rgba(255, 255, 255, 0.02);
  }
  /* Inputs e icono: ancho completo */
  .links__row > input,
  .links__icon {
    grid-column: 1 / -1;
  }
  .links__row > input,
  .links__row select {
    padding: 0.6rem 0.7rem;
    font-size: 0.9rem;
  }
  /* Separador full-width antes de la fila de acciones */
  .links__icon {
    padding-bottom: 0.7rem;
    border-bottom: 1px solid var(--adm-hairline);
  }
  /* Toggle + borrar comparten la última fila */
  .links__row > .ui-switch {
    grid-column: 1;
    align-self: center;
    justify-self: start;
  }
  .links__row > .ui-btn {
    grid-column: 2;
    align-self: center;
    justify-self: end;
  }
}
</style>
