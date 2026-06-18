<template>
  <button
    :type="type"
    class="ui-btn"
    :class="[`ui-btn--${variant}`, `ui-btn--${size}`, { 'ui-btn--block': block, 'ui-btn--icon': icon }]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="ui-btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: "primary" }, // primary | accent | secondary | ghost | danger
  size: { type: String, default: "md" }, // sm | md
  type: { type: String, default: "button" },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  icon: { type: Boolean, default: false },
});
</script>

<style scoped>
.ui-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font: inherit;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: var(--adm-radius-sm);
  transition: background 0.18s var(--adm-ease), border-color 0.18s var(--adm-ease),
    color 0.18s var(--adm-ease), transform 0.12s var(--adm-ease),
    box-shadow 0.18s var(--adm-ease), opacity 0.18s var(--adm-ease);
}

.ui-btn--md {
  padding: 0.55rem 1rem;
  font-size: 0.875rem;
}
.ui-btn--sm {
  padding: 0.4rem 0.7rem;
  font-size: 0.8rem;
  border-radius: 0.6rem;
}
.ui-btn--block {
  width: 100%;
}
.ui-btn--icon.ui-btn--md {
  padding: 0.55rem;
}
.ui-btn--icon.ui-btn--sm {
  padding: 0.4rem;
}

.ui-btn:active:not(:disabled) {
  transform: scale(0.97);
}
.ui-btn:focus-visible {
  outline: none;
  box-shadow: var(--adm-ring);
}
.ui-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

/* Primary — brand white pill */
.ui-btn--primary {
  background: #fff;
  color: #0a0a0a;
  border-radius: var(--adm-pill);
}
.ui-btn--primary:hover:not(:disabled) {
  background: #ededed;
  transform: translateY(-1px);
}
.ui-btn--primary:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

/* Accent — iOS blue */
.ui-btn--accent {
  background: var(--adm-accent);
  color: #fff;
}
.ui-btn--accent:hover:not(:disabled) {
  background: var(--adm-accent-hover);
}

/* Secondary — elevated surface */
.ui-btn--secondary {
  background: var(--adm-surface-2);
  border-color: var(--adm-border);
  color: var(--adm-text);
}
.ui-btn--secondary:hover:not(:disabled) {
  background: var(--adm-surface-hover);
  border-color: var(--adm-border-strong);
}

/* Ghost — transparent */
.ui-btn--ghost {
  background: transparent;
  color: var(--adm-text-2);
}
.ui-btn--ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.06);
  color: var(--adm-text);
}

/* Danger — soft red */
.ui-btn--danger {
  background: var(--adm-danger-soft);
  color: #ff6b61;
}
.ui-btn--danger:hover:not(:disabled) {
  background: rgba(255, 69, 58, 0.26);
  color: #ff8078;
}

.ui-btn__spinner {
  width: 0.85em;
  height: 0.85em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  opacity: 0.85;
  animation: ui-btn-spin 0.6s linear infinite;
}

@keyframes ui-btn-spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .ui-btn { transition: none; }
  .ui-btn:hover { transform: none !important; }
}
</style>
