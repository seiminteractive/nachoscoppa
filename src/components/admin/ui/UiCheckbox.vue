<template>
  <label class="ui-check" :class="{ 'ui-check--on': modelValue }">
    <input
      type="checkbox"
      class="ui-check__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="ui-check__box" aria-hidden="true">
      <svg viewBox="0 0 14 14" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2.5 7.5l3 3 6-7" />
      </svg>
    </span>
    <span v-if="label || $slots.default" class="ui-check__label"><slot>{{ label }}</slot></span>
  </label>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: "" },
  disabled: { type: Boolean, default: false },
});
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.ui-check {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--adm-text-2);
  user-select: none;
}
.ui-check__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.ui-check__box {
  flex: none;
  display: grid;
  place-content: center;
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 0.5rem;
  border: 1px solid var(--adm-border-strong);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0));
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.35);
  color: #fff;
  transition: background 0.18s var(--adm-ease), border-color 0.18s var(--adm-ease),
    box-shadow 0.18s var(--adm-ease), transform 0.12s var(--adm-ease);
}
.ui-check:hover .ui-check__box {
  border-color: rgba(255, 255, 255, 0.35);
}
.ui-check:active .ui-check__box {
  transform: scale(0.92);
}
.ui-check__box svg {
  transform: scale(0.4);
  opacity: 0;
  transition: transform 0.2s var(--adm-ease), opacity 0.16s var(--adm-ease);
}
.ui-check--on .ui-check__box {
  background: linear-gradient(180deg, #3a9bff, var(--adm-accent));
  border-color: transparent;
  box-shadow: 0 2px 6px rgba(10, 132, 255, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
.ui-check--on .ui-check__box svg {
  transform: scale(1);
  opacity: 1;
}
.ui-check__input:focus-visible + .ui-check__box {
  box-shadow: var(--adm-ring);
}
.ui-check__input:disabled ~ * { opacity: 0.5; }
.ui-check--on .ui-check__label { color: var(--adm-text); }
</style>
