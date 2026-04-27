<template>
  <aside class="social-sidebar" aria-label="Redes sociales de Nacho Scoppa">
    <ul class="social-sidebar__list">
      <li v-for="link in links" :key="link.name" class="social-sidebar__item">
        <a
          :href="link.href"
          class="social-sidebar__link"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="link.name"
        >
          <Icon :icon="link.icon" class="social-sidebar__icon" aria-hidden="true" />
          <span class="social-sidebar__tooltip" aria-hidden="true">{{ link.name }}</span>
        </a>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { socialLinks as links } from "../data/socialLinks.js";
</script>

<style scoped>
.social-sidebar {
  position: fixed;
  right: clamp(0.75rem, 1.5vw, 1.25rem);
  top: 50%;
  transform: translateY(-50%);
  z-index: 40;
  padding: 0;
  background: transparent;
  pointer-events: auto;
}

.social-sidebar__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.social-sidebar__item {
  display: block;
}

.social-sidebar__link {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 999px;
  background: #ffffff;
  color: #0a0a0a;
  text-decoration: none;
  box-shadow: 0 1px 2px rgba(10, 10, 10, 0.08),
    0 6px 18px rgba(10, 10, 10, 0.08);
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
}

.social-sidebar__link:hover,
.social-sidebar__link:focus-visible {
  transform: scale(1.08);
  background: #0a0a0a;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(10, 10, 10, 0.18),
    0 10px 24px rgba(10, 10, 10, 0.18);
}

.social-sidebar__link:focus-visible {
  outline: 2px solid #0a0a0a;
  outline-offset: 2px;
}

.social-sidebar__icon {
  width: 1rem;
  height: 1rem;
}

.social-sidebar__tooltip {
  position: absolute;
  right: calc(100% + 0.65rem);
  top: 50%;
  transform: translateY(-50%) translateX(4px);
  padding: 0.3rem 0.55rem;
  background: #0a0a0a;
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  border-radius: 0.45rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.social-sidebar__link:hover .social-sidebar__tooltip,
.social-sidebar__link:focus-visible .social-sidebar__tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

@media (max-width: 768px) {
  .social-sidebar {
    display: none;
  }
}
</style>
