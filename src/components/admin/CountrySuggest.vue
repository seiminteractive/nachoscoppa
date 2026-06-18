<template>
  <div class="csg" @focusout="onFocusOut">
    <div class="csg__input">
      <span v-if="selectedCode" :class="`fi fi-${selectedCode.toLowerCase()}`" aria-hidden="true" />
      <input
        ref="inputRef"
        :value="modelValue"
        type="text"
        autocomplete="off"
        :placeholder="placeholder"
        :required="required"
        @input="onInput"
        @focus="open = true"
        @keydown.down.prevent="move(1)"
        @keydown.up.prevent="move(-1)"
        @keydown.enter.prevent="onEnter"
        @keydown.esc="open = false"
      />
    </div>
    <ul v-if="open && matches.length" class="csg__list" role="listbox">
      <li
        v-for="(c, i) in matches"
        :key="c.code"
        :class="['csg__opt', { 'csg__opt--active': i === active }]"
        role="option"
        :aria-selected="i === active"
        @mousedown.prevent="pick(c)"
        @mouseenter="active = i"
      >
        <span :class="`fi fi-${c.code.toLowerCase()}`" aria-hidden="true" />
        <span class="csg__opt-name">{{ c.name }}</span>
        <span class="csg__opt-code">{{ c.code }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import "flag-icons/css/flag-icons.min.css";
import { COUNTRIES, normalize } from "../../lib/countries";

const props = defineProps({
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "España" },
  required: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "select"]);

const inputRef = ref(null);
const open = ref(false);
const active = ref(0);

const selectedCode = computed(() => {
  const n = normalize(props.modelValue);
  return COUNTRIES.find((c) => normalize(c.name) === n)?.code || "";
});

const matches = computed(() => {
  const q = normalize(props.modelValue);
  if (!q) return COUNTRIES.slice(0, 8);
  const starts = [];
  const contains = [];
  for (const c of COUNTRIES) {
    const n = normalize(c.name);
    if (n.startsWith(q)) starts.push(c);
    else if (n.includes(q)) contains.push(c);
  }
  return [...starts, ...contains].slice(0, 8);
});

function onInput(e) {
  emit("update:modelValue", e.target.value);
  open.value = true;
  active.value = 0;
}

function move(dir) {
  open.value = true;
  const n = matches.value.length;
  if (!n) return;
  active.value = (active.value + dir + n) % n;
}

function onEnter() {
  if (open.value && matches.value[active.value]) pick(matches.value[active.value]);
}

function pick(c) {
  emit("update:modelValue", c.name);
  emit("select", c);
  open.value = false;
}

function onFocusOut(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) open.value = false;
}
</script>

<style scoped>
.csg {
  position: relative;
}
.csg__input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--adm-bg);
  border: 1px solid var(--adm-border);
  border-radius: var(--adm-radius-sm);
  padding: 0 0.75rem;
  transition: border-color 0.18s var(--adm-ease), box-shadow 0.18s var(--adm-ease);
}
.csg__input:focus-within {
  border-color: var(--adm-accent);
  box-shadow: var(--adm-ring);
}
.csg__input .fi {
  flex: none;
  width: 1.1rem;
  height: 0.8rem;
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}
.csg__input input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: 0;
  padding: 0.6rem 0;
  color: var(--adm-text);
  font: inherit;
  font-size: 0.9rem;
  outline: none;
}
.csg__list {
  position: absolute;
  z-index: 5;
  top: calc(100% + 0.35rem);
  left: 0;
  right: 0;
  margin: 0;
  padding: 0.3rem;
  list-style: none;
  max-height: 14rem;
  overflow-y: auto;
  background: var(--adm-elevated);
  border: 1px solid var(--adm-border-strong);
  border-radius: var(--adm-radius);
  box-shadow: var(--adm-shadow-lg);
}
.csg__opt {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.5rem 0.55rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
}
.csg__opt--active {
  background: var(--adm-accent-soft);
}
.csg__opt .fi {
  flex: none;
  width: 1.2rem;
  height: 0.85rem;
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
}
.csg__opt-name {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--adm-text);
}
.csg__opt-code {
  flex: none;
  font-size: 0.7rem;
  color: var(--adm-text-3);
  letter-spacing: 0.05em;
}
</style>
