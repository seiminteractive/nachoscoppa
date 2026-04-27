<template>
  <div class="agenda-page">
    <SiteHeader />
    <AgendaSection variant="full" />
    <SiteFooter hash-link-base="/" />
    <SocialSidebar />
  </div>
</template>

<script setup>
import SiteHeader from "../components/SiteHeader.vue";
import AgendaSection from "../components/AgendaSection.vue";
import SiteFooter from "../components/SiteFooter.vue";
import SocialSidebar from "../components/SocialSidebar.vue";
</script>

<style scoped>
.agenda-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--page-bg, #f2f2f2);
  /* Misma reserva que el hero bajo el header fijo (SiteHeader.vue) */
  padding-top: clamp(3.85rem, 8.9vw, 4.65rem);
}

@media (max-width: 960px) and (min-width: 769px) {
  .agenda-page {
    padding-top: clamp(8.6rem, 28.8vw, 11.5rem);
  }
}

@media (max-width: 768px) {
  .agenda-page {
    padding-top: 0;
  }
}
</style>
