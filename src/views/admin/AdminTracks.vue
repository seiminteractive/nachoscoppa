<template>
  <AdminPage title="Tracks" subtitle="Carrusel de tracks en la sección Music.">
    <template #actions>
      <UiButton @click="openCreate">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
        Nuevo track
      </UiButton>
    </template>

    <p v-if="!tracks.length" class="empty">Todavía no hay tracks.</p>
    <div v-else class="adm-list">
      <div v-for="(t, i) in tracks" :key="t.id" class="adm-row">
        <div class="adm-row__order">
          <button @click="move(i, -1)" :disabled="i === 0" aria-label="Subir">↑</button>
          <button @click="move(i, 1)" :disabled="i === tracks.length - 1" aria-label="Bajar">↓</button>
        </div>
        <div class="adm-row__thumb">
          <img v-if="t.cover" :src="t.cover" alt="" />
        </div>
        <div class="adm-row__main">
          <p class="adm-row__title">{{ t.title }}</p>
          <p class="adm-row__meta">{{ t.label }} · {{ t.year }}</p>
        </div>
        <div class="adm-row__actions">
          <UiButton variant="secondary" size="sm" @click="openEdit(t)">Editar</UiButton>
          <UiButton variant="danger" size="sm" @click="onDelete(t)">Borrar</UiButton>
        </div>
      </div>
    </div>

    <UiModal v-model="open" :title="editing?.id ? 'Editar track' : 'Nuevo track'">
      <form id="track-form" class="adm-form" @submit.prevent="onSave">
        <label class="adm-field">
          <span>Título</span>
          <input v-model="editing.title" required />
        </label>
        <label class="adm-field">
          <span>Label</span>
          <input v-model="editing.label" />
        </label>
        <label class="adm-field">
          <span>Año</span>
          <input v-model="editing.year" />
        </label>
        <label class="adm-field">
          <span>URL del track</span>
          <input v-model="editing.spotifyUrl" type="url" placeholder="Spotify, Beatport, SoundCloud…" />
        </label>
        <div class="adm-field adm-field--full">
          <span>Cover</span>
          <ImageUpload v-model="editing.cover" folder="tracks" />
        </div>
      </form>
      <template #footer>
        <UiButton variant="ghost" @click="open = false">Cancelar</UiButton>
        <UiButton type="submit" form="track-form" :loading="saving">Guardar</UiButton>
      </template>
    </UiModal>
  </AdminPage>
</template>

<script setup>
import { ref } from "vue";
import { toast } from "vue-sonner";
import AdminPage from "../../components/admin/AdminPage.vue";
import ImageUpload from "../../components/admin/ImageUpload.vue";
import UiButton from "../../components/admin/ui/UiButton.vue";
import UiModal from "../../components/admin/ui/UiModal.vue";
import { confirm } from "../../composables/useConfirm";
import { useTracks } from "../../composables/content";
import { createDoc, patchDoc, removeDoc } from "../../composables/useFirestore";

const { items: tracks } = useTracks();
const editing = ref(blank());
const open = ref(false);
const saving = ref(false);

function blank() {
  return { title: "", label: "", year: "", cover: "", spotifyUrl: "", order: 0 };
}

function openCreate() {
  editing.value = { ...blank(), order: tracks.value.length };
  open.value = true;
}

function openEdit(t) {
  editing.value = { ...t };
  open.value = true;
}

async function onSave() {
  saving.value = true;
  try {
    const { id, ...payload } = editing.value;
    if (id) await patchDoc(`tracks/${id}`, payload);
    else await createDoc("tracks", payload);
    open.value = false;
    toast.success(id ? "Track actualizado" : "Track creado");
  } catch (e) {
    toast.error("No se pudo guardar", { description: e?.message });
  } finally {
    saving.value = false;
  }
}

async function onDelete(t) {
  const ok = await confirm({
    title: "Borrar track",
    message: `Se eliminará “${t.title}”. Esta acción no se puede deshacer.`,
    confirmLabel: "Borrar",
    tone: "danger",
  });
  if (!ok) return;
  await removeDoc(`tracks/${t.id}`);
  toast.success("Track borrado");
}

async function move(idx, dir) {
  const a = tracks.value[idx];
  const b = tracks.value[idx + dir];
  if (!a || !b) return;
  await Promise.all([
    patchDoc(`tracks/${a.id}`, { order: b.order ?? idx + dir }),
    patchDoc(`tracks/${b.id}`, { order: a.order ?? idx }),
  ]);
}
</script>
