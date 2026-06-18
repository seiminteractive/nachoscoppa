<template>
  <section class="page">
    <header class="page__head">
      <div class="page__head-text">
        <h1 class="page__title">{{ title }}</h1>
        <p v-if="subtitle" class="page__sub">{{ subtitle }}</p>
      </div>
      <div class="page__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="page__body">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 90rem;
}

.page__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--adm-hairline);
}

.page__title {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 1.9rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--adm-text);
}

.page__sub {
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  color: var(--adm-text-2);
  max-width: 42rem;
  line-height: 1.45;
}

.page__actions {
  display: flex;
  gap: 0.6rem;
  flex-shrink: 0;
}

.page__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 560px) {
  .page { gap: 1.15rem; }
  .page__head {
    align-items: stretch;
    flex-direction: column;
    gap: 0.9rem;
  }
  .page__actions { width: 100%; }
  .page__actions :deep(.ui-btn) { width: 100%; }
}
</style>
