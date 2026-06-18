<template>
  <UiModal
    :model-value="state.open"
    size="sm"
    @update:model-value="!$event && cancel()"
  >
    <template #header>
      <div class="confirm__head">
        <span class="confirm__icon" :class="`confirm__icon--${state.tone}`" aria-hidden="true">
          <svg v-if="state.tone === 'danger'" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" />
          </svg>
        </span>
        <h2 class="confirm__title">{{ state.title }}</h2>
      </div>
    </template>

    <p v-if="state.message" class="confirm__msg">{{ state.message }}</p>

    <template #footer>
      <UiButton variant="ghost" @click="cancel">{{ state.cancelLabel }}</UiButton>
      <UiButton :variant="state.tone === 'danger' ? 'danger' : 'primary'" @click="ok">
        {{ state.confirmLabel }}
      </UiButton>
    </template>
  </UiModal>
</template>

<script setup>
import UiModal from "./UiModal.vue";
import UiButton from "./UiButton.vue";
import { useConfirmState, _resolveConfirm } from "../../../composables/useConfirm";

const state = useConfirmState();
const ok = () => _resolveConfirm(true);
const cancel = () => _resolveConfirm(false);
</script>

<style scoped>
.confirm__head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.confirm__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  flex: none;
}
.confirm__icon--default {
  background: var(--adm-accent-soft);
  color: var(--adm-accent);
}
.confirm__icon--danger {
  background: var(--adm-danger-soft);
  color: var(--adm-danger);
}
.confirm__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--adm-text);
}
.confirm__msg {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--adm-text-2);
}
</style>
