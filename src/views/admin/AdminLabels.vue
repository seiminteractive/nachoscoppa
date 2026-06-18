<template>
  <AdminPage title="Labels" subtitle="Logos de sellos en el carrusel de “Sobre el artista”.">
    <template #actions>
      <UiButton @click="openCreate">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
        Nuevo label
      </UiButton>
    </template>

    <p v-if="!items.length" class="empty">Todavía no hay labels.</p>
    <div v-else class="adm-list">
      <div v-for="(t, i) in items" :key="t.id" class="adm-row">
        <div class="adm-row__order">
          <button @click="move(i, -1)" :disabled="i === 0" aria-label="Subir">↑</button>
          <button @click="move(i, 1)" :disabled="i === items.length - 1" aria-label="Bajar">↓</button>
        </div>
        <div class="adm-row__thumb">
          <img v-if="t.src" :src="t.src" alt="" />
        </div>
        <div class="adm-row__main">
          <p class="adm-row__title">{{ t.name }}</p>
        </div>
        <div class="adm-row__actions">
          <UiButton variant="secondary" size="sm" @click="openEdit(t)">Editar</UiButton>
          <UiButton variant="danger" size="sm" @click="onDelete(t)">Borrar</UiButton>
        </div>
      </div>
    </div>

    <UiModal v-model="open" :title="editing?.id ? 'Editar label' : 'Nuevo label'">
      <form id="label-form" class="adm-form" @submit.prevent="onSave">
        <label class="adm-field adm-field--full">
          <span>Nombre</span>
          <input v-model="editing.name" required />
        </label>
        <div class="adm-field adm-field--full">
          <span>Logo</span>
          <ImageUpload v-model="editing.src" folder="labels" />
        </div>
      </form>
      <template #footer>
        <UiButton variant="ghost" @click="open = false">Cancelar</UiButton>
        <UiButton type="submit" form="label-form" :loading="saving">Guardar</UiButton>
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
import { useLabels } from "../../composables/content";
import { createDoc, patchDoc, removeDoc } from "../../composables/useFirestore";

const { items } = useLabels();
const editing = ref({ name: "", src: "", order: 0 });
const open = ref(false);
const saving = ref(false);

function openCreate() {
  editing.value = { name: "", src: "", order: items.value.length };
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
    if (id) await patchDoc(`labels/${id}`, payload);
    else await createDoc("labels", payload);
    open.value = false;
    toast.success(id ? "Label actualizado" : "Label creado");
  } catch (e) {
    toast.error("No se pudo guardar", { description: e?.message });
  } finally {
    saving.value = false;
  }
}

async function onDelete(t) {
  const ok = await confirm({
    title: "Borrar label",
    message: `Se eliminará “${t.name}”.`,
    confirmLabel: "Borrar",
    tone: "danger",
  });
  if (!ok) return;
  await removeDoc(`labels/${t.id}`);
  toast.success("Label borrado");
}

async function move(idx, dir) {
  const a = items.value[idx];
  const b = items.value[idx + dir];
  if (!a || !b) return;
  await Promise.all([
    patchDoc(`labels/${a.id}`, { order: b.order ?? idx + dir }),
    patchDoc(`labels/${b.id}`, { order: a.order ?? idx }),
  ]);
}
</script>
