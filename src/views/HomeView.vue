<template>
  <Hero />
  <SplitRevealSection />
  <FeaturedTrack />
  <MusicSection />
  <LiveSetsSection />
  <section id="press-notes" class="press-notes-region" aria-label="Notas de prensa">
    <DjPressNotes />
  </section>
  <AgendaSection variant="preview" />
  <InstagramFeedSection />
  <SiteFooter />
  <SocialSidebar />
  <!-- Contacto oculto por ahora -->
  <ContactSection v-if="false" />
</template>

<script setup>
import Hero from "../components/Hero.vue";
import SplitRevealSection from "../components/SplitRevealSection.vue";
import FeaturedTrack from "../components/FeaturedTrack.vue";
import MusicSection from "../components/MusicSection.vue";
import LiveSetsSection from "../components/LiveSetsSection.vue";
import DjPressNotes from "../components/DjPressNotes.vue";
import AgendaSection from "../components/AgendaSection.vue";
import InstagramFeedSection from "../components/InstagramFeedSection.vue";
import SiteFooter from "../components/SiteFooter.vue";
import SocialSidebar from "../components/SocialSidebar.vue";
import ContactSection from "../components/ContactSection.vue";
</script>
