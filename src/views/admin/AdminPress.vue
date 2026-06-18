<template>
  <AdminPage title="Entrevistas" subtitle="Carrusel horizontal “PRESS & FEATURES”.">
    <template #actions>
      <UiButton @click="openCreate">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
        Nueva entrevista
      </UiButton>
    </template>

    <p v-if="!items.length" class="empty">Todavía no hay entrevistas.</p>
    <div v-else class="adm-list">
      <div v-for="(t, i) in items" :key="t.id" class="adm-row">
        <div class="adm-row__order">
          <button @click="move(i, -1)" :disabled="i === 0" aria-label="Subir">↑</button>
          <button @click="move(i, 1)" :disabled="i === items.length - 1" aria-label="Bajar">↓</button>
        </div>
        <div class="adm-row__thumb"><img v-if="t.image" :src="t.image" alt="" /></div>
        <div class="adm-row__main">
          <p class="adm-row__title">{{ t.title }}</p>
          <p class="adm-row__meta">{{ t.kicker }}</p>
        </div>
        <div class="adm-row__actions">
          <UiButton variant="secondary" size="sm" @click="openEdit(t)">Editar</UiButton>
          <UiButton variant="danger" size="sm" @click="onDelete(t)">Borrar</UiButton>
        </div>
      </div>
    </div>

    <UiModal v-model="open" :title="editing?.id ? 'Editar entrevista' : 'Nueva entrevista'">
      <form id="press-form" class="adm-form" @submit.prevent="onSave">
        <label class="adm-field adm-field--full">
          <span>Título</span>
          <input v-model="editing.title" required />
        </label>
        <label class="adm-field adm-field--full">
          <span>Kicker</span>
          <input v-model="editing.kicker" placeholder="Portada digital · Italia" />
        </label>
        <label class="adm-field adm-field--full">
          <span>Descripción</span>
          <textarea v-model="editing.description" />
        </label>
        <label class="adm-field adm-field--full">
          <span>URL</span>
          <input v-model="editing.url" type="url" required />
        </label>
        <label class="adm-field adm-field--full">
          <span>Alt de imagen</span>
          <input v-model="editing.imageAlt" />
        </label>
        <div class="adm-field adm-field--full">
          <span>Imagen</span>
          <ImageUpload v-model="editing.image" folder="press" />
        </div>
      </form>
      <template #footer>
        <UiButton variant="ghost" @click="open = false">Cancelar</UiButton>
        <UiButton type="submit" form="press-form" :loading="saving">Guardar</UiButton>
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
import { usePressNotes } from "../../composables/content";
import { createDoc, patchDoc, removeDoc } from "../../composables/useFirestore";

const { items } = usePressNotes();
const editing = ref(blank());
const open = ref(false);
const saving = ref(false);

function blank() {
  return { title: "", kicker: "", description: "", url: "", image: "", imageAlt: "", order: 0 };
}

function openCreate() {
  editing.value = { ...blank(), order: items.value.length };
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
    if (id) await patchDoc(`pressNotes/${id}`, payload);
    else await createDoc("pressNotes", payload);
    open.value = false;
    toast.success(id ? "Entrevista actualizada" : "Entrevista creada");
  } catch (e) {
    toast.error("No se pudo guardar", { description: e?.message });
  } finally {
    saving.value = false;
  }
}

async function onDelete(t) {
  const ok = await confirm({
    title: "Borrar entrevista",
    message: `Se eliminará “${t.title}”.`,
    confirmLabel: "Borrar",
    tone: "danger",
  });
  if (!ok) return;
  await removeDoc(`pressNotes/${t.id}`);
  toast.success("Entrevista borrada");
}

async function move(idx, dir) {
  const a = items.value[idx];
  const b = items.value[idx + dir];
  if (!a || !b) return;
  await Promise.all([
    patchDoc(`pressNotes/${a.id}`, { order: b.order ?? idx + dir }),
    patchDoc(`pressNotes/${b.id}`, { order: a.order ?? idx }),
  ]);
}
</script>
