<template>
  <AdminPage title="Sets en vivo" subtitle="Lista de sets en la sección negra.">
    <template #actions>
      <UiButton @click="openCreate">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14" /></svg>
        Nuevo set
      </UiButton>
    </template>

    <p v-if="!items.length" class="empty">Todavía no hay sets.</p>
    <div v-else class="adm-list">
      <div v-for="(t, i) in items" :key="t.id" class="adm-row">
        <div class="adm-row__order">
          <button @click="move(i, -1)" :disabled="i === 0" aria-label="Subir">↑</button>
          <button @click="move(i, 1)" :disabled="i === items.length - 1" aria-label="Bajar">↓</button>
        </div>
        <div class="adm-row__thumb"><img v-if="t.previewSrc" :src="t.previewSrc" alt="" /></div>
        <div class="adm-row__main">
          <p class="adm-row__title">{{ t.title }}</p>
          <p class="adm-row__meta">{{ t.date }} · {{ t.venue }} — {{ t.city }}</p>
        </div>
        <div class="adm-row__actions">
          <UiButton variant="secondary" size="sm" @click="openEdit(t)">Editar</UiButton>
          <UiButton variant="danger" size="sm" @click="onDelete(t)">Borrar</UiButton>
        </div>
      </div>
    </div>

    <UiModal v-model="open" :title="editing?.id ? 'Editar set' : 'Nuevo set'">
      <form id="set-form" class="adm-form" @submit.prevent="onSave">
        <label class="adm-field adm-field--full">
          <span>Título</span>
          <input v-model="editing.title" required />
        </label>
        <label class="adm-field">
          <span>Fecha (texto)</span>
          <input v-model="editing.date" placeholder="7 jun 2025" />
        </label>
        <label class="adm-field">
          <span>Venue</span>
          <input v-model="editing.venue" />
        </label>
        <label class="adm-field">
          <span>Ciudad</span>
          <input v-model="editing.city" />
        </label>
        <label class="adm-field">
          <span>Texto del botón</span>
          <input v-model="editing.listenLabel" placeholder="Ver en YouTube" />
        </label>
        <label class="adm-field adm-field--full">
          <span>Stream URL</span>
          <input v-model="editing.streamUrl" type="url" />
        </label>
        <label class="adm-field adm-field--full">
          <span>Detalle</span>
          <textarea v-model="editing.detail" />
        </label>
        <label class="adm-field adm-field--full">
          <span>Extra (opcional)</span>
          <input v-model="editing.extra" />
        </label>
        <div class="adm-field adm-field--full">
          <span>Preview</span>
          <ImageUpload v-model="editing.previewSrc" folder="livesets" />
        </div>
      </form>
      <template #footer>
        <UiButton variant="ghost" @click="open = false">Cancelar</UiButton>
        <UiButton type="submit" form="set-form" :loading="saving">Guardar</UiButton>
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
import { useLiveSets } from "../../composables/content";
import { createDoc, patchDoc, removeDoc } from "../../composables/useFirestore";

const { items } = useLiveSets();
const editing = ref(blank());
const open = ref(false);
const saving = ref(false);

function blank() {
  return {
    title: "", date: "", venue: "", city: "", detail: "", extra: "",
    listenLabel: "Ver en YouTube", streamUrl: "", previewSrc: "", order: 0,
  };
}

function openCreate() {
  editing.value = { ...blank(), order: items.value.length };
  open.value = true;
}
function openEdit(t) {
  editing.value = { ...t, extra: t.extra ?? "" };
  open.value = true;
}

async function onSave() {
  saving.value = true;
  try {
    const { id, ...payload } = editing.value;
    payload.extra = payload.extra?.trim() || null;
    if (id) await patchDoc(`liveSets/${id}`, payload);
    else await createDoc("liveSets", payload);
    open.value = false;
    toast.success(id ? "Set actualizado" : "Set creado");
  } catch (e) {
    toast.error("No se pudo guardar", { description: e?.message });
  } finally {
    saving.value = false;
  }
}

async function onDelete(t) {
  const ok = await confirm({
    title: "Borrar set",
    message: `Se eliminará “${t.title}”.`,
    confirmLabel: "Borrar",
    tone: "danger",
  });
  if (!ok) return;
  await removeDoc(`liveSets/${t.id}`);
  toast.success("Set borrado");
}

async function move(idx, dir) {
  const a = items.value[idx];
  const b = items.value[idx + dir];
  if (!a || !b) return;
  await Promise.all([
    patchDoc(`liveSets/${a.id}`, { order: b.order ?? idx + dir }),
    patchDoc(`liveSets/${b.id}`, { order: a.order ?? idx }),
  ]);
}
</script>
