<template>
  <label class="ui-switch" :class="{ 'ui-switch--on': modelValue }">
    <input
      type="checkbox"
      class="ui-switch__input"
      :checked="modelValue"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="ui-switch__track" aria-hidden="true"><span class="ui-switch__thumb" /></span>
    <span v-if="label || $slots.default" class="ui-switch__label"><slot>{{ label }}</slot></span>
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
.ui-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--adm-text);
  user-select: none;
}
.ui-switch__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.ui-switch__track {
  position: relative;
  flex: none;
  width: 2.55rem;
  height: 1.5rem;
  border-radius: var(--adm-pill);
  background: rgba(255, 255, 255, 0.14);
  transition: background 0.2s var(--adm-ease);
}
.ui-switch__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: calc(1.5rem - 4px);
  height: calc(1.5rem - 4px);
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  transition: transform 0.22s var(--adm-ease);
}
.ui-switch--on .ui-switch__track {
  background: var(--adm-success);
}
.ui-switch--on .ui-switch__thumb {
  transform: translateX(1.05rem);
}
.ui-switch__input:focus-visible + .ui-switch__track {
  box-shadow: var(--adm-ring);
}
.ui-switch__input:disabled ~ * {
  opacity: 0.5;
}
.ui-switch__label { color: var(--adm-text-2); }
</style>
