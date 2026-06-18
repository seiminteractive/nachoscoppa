<template>
  <div class="upload">
    <div v-if="modelValue" class="upload__preview">
      <img :src="modelValue" alt="" />
      <button type="button" class="upload__remove" aria-label="Quitar imagen" @click="$emit('update:modelValue', '')">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
    <label class="upload__drop" :class="{ 'upload__drop--busy': busy }">
      <input type="file" accept="image/*" @change="onPick" :disabled="busy" />
      <span v-if="busy" class="upload__busy">
        <span class="upload__spinner" aria-hidden="true" /> Subiendo… {{ progress }}%
      </span>
      <span v-else class="upload__drop-inner">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
        </svg>
        {{ modelValue ? "Reemplazar imagen" : "Subir imagen" }}
      </span>
    </label>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { toast } from "vue-sonner";
import { uploadFile } from "../../composables/useStorage";

const props = defineProps({
  modelValue: { type: String, default: "" },
  folder: { type: String, required: true },
});
const emit = defineEmits(["update:modelValue"]);

const busy = ref(false);
const progress = ref(0);

async function onPick(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  busy.value = true;
  progress.value = 0;
  try {
    const { url } = await uploadFile(props.folder, file);
    emit("update:modelValue", url);
    toast.success("Imagen subida");
  } catch (err) {
    toast.error("No se pudo subir la imagen", { description: err.message });
  } finally {
    busy.value = false;
    e.target.value = "";
  }
}
</script>

<style scoped>
.upload {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.upload__preview {
  position: relative;
  width: 7rem;
  height: 7rem;
  border-radius: var(--adm-radius);
  overflow: hidden;
  background: var(--adm-surface-2);
  border: 1px solid var(--adm-border);
  flex: none;
}
.upload__preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.upload__remove {
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  border: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  color: #fff;
  cursor: pointer;
  transition: background 0.15s var(--adm-ease);
}
.upload__remove:hover { background: rgba(0, 0, 0, 0.85); }

.upload__drop {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 11rem;
  padding: 1.4rem 1.25rem;
  border: 1.5px dashed var(--adm-border-strong);
  border-radius: var(--adm-radius);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--adm-text-2);
  cursor: pointer;
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 0.18s var(--adm-ease), background 0.18s var(--adm-ease),
    color 0.18s var(--adm-ease);
}
.upload__drop:hover {
  border-color: var(--adm-accent);
  background: var(--adm-accent-soft);
  color: var(--adm-text);
}
.upload__drop input { display: none; }
.upload__drop--busy { opacity: 0.8; cursor: progress; }

.upload__drop-inner,
.upload__busy {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.upload__spinner {
  width: 0.9rem;
  height: 0.9rem;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: upload-spin 0.6s linear infinite;
}
@keyframes upload-spin { to { transform: rotate(360deg); } }
</style>
