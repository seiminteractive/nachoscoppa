<template>
  <Teleport to="body">
    <Transition name="ui-modal">
      <div
        v-if="modelValue"
        class="ui-modal admin"
        role="dialog"
        aria-modal="true"
        @click.self="onBackdrop"
      >
        <div class="ui-modal__card" :class="`ui-modal__card--${size}`">
          <header v-if="title || $slots.header" class="ui-modal__head">
            <slot name="header">
              <div>
                <h2 class="ui-modal__title">{{ title }}</h2>
                <p v-if="subtitle" class="ui-modal__sub">{{ subtitle }}</p>
              </div>
            </slot>
            <button type="button" class="ui-modal__close" aria-label="Cerrar" @click="close">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div class="ui-modal__body">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="ui-modal__foot">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch, onBeforeUnmount } from "vue";

function onKey(e) {
  if (e.key === "Escape") close();
}

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  size: { type: String, default: "md" }, // sm | md | lg
  closeOnBackdrop: { type: Boolean, default: true },
});
const emit = defineEmits(["update:modelValue", "close"]);

function close() {
  emit("update:modelValue", false);
  emit("close");
}
function onBackdrop() {
  if (props.closeOnBackdrop) close();
}

let prevOverflow = "";
watch(
  () => props.modelValue,
  (open) => {
    if (typeof document === "undefined") return;
    if (open) {
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    } else {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    }
  },
);
onBeforeUnmount(() => {
  if (typeof document !== "undefined") document.body.style.overflow = prevOverflow;
  if (typeof window !== "undefined") window.removeEventListener("keydown", onKey);
});
</script>

<style scoped>
.ui-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 1.25rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px) saturate(120%);
}

.ui-modal__card {
  width: 100%;
  max-height: calc(100dvh - 2.5rem);
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0)),
    var(--adm-elevated);
  border: 1px solid var(--adm-border-strong);
  border-radius: var(--adm-radius-lg);
  box-shadow: var(--adm-shadow-lg);
  overflow: hidden;
}
.ui-modal__card--sm { max-width: 26rem; }
.ui-modal__card--md { max-width: 40rem; }
.ui-modal__card--lg { max-width: 52rem; }

.ui-modal__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 1.25rem 0.9rem;
  border-bottom: 1px solid var(--adm-hairline);
}

.ui-modal__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--adm-text);
}

.ui-modal__sub {
  margin: 0.25rem 0 0;
  font-size: 0.825rem;
  color: var(--adm-text-2);
}

.ui-modal__close {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 0;
  background: rgba(255, 255, 255, 0.06);
  color: var(--adm-text-2);
  cursor: pointer;
  transition: background 0.15s var(--adm-ease), color 0.15s var(--adm-ease);
}
.ui-modal__close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--adm-text);
}

.ui-modal__body {
  padding: 1.25rem;
  overflow-y: auto;
}

.ui-modal__foot {
  display: flex;
  gap: 0.6rem;
  justify-content: flex-end;
  padding: 1rem 1.25rem;
  border-top: 1px solid var(--adm-hairline);
  background: rgba(0, 0, 0, 0.2);
}

/* Transition */
.ui-modal-enter-active,
.ui-modal-leave-active {
  transition: opacity 0.25s var(--adm-ease);
}
.ui-modal-enter-active .ui-modal__card,
.ui-modal-leave-active .ui-modal__card {
  transition: transform 0.28s var(--adm-ease), opacity 0.28s var(--adm-ease);
}
.ui-modal-enter-from,
.ui-modal-leave-to { opacity: 0; }
.ui-modal-enter-from .ui-modal__card,
.ui-modal-leave-to .ui-modal__card {
  transform: translateY(12px) scale(0.97);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .ui-modal-enter-active,
  .ui-modal-leave-active,
  .ui-modal-enter-active .ui-modal__card,
  .ui-modal-leave-active .ui-modal__card { transition: none; }
}
</style>
