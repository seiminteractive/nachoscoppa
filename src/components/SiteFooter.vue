<template>
  <footer class="site-footer" aria-labelledby="site-footer-heading">
    <div class="site-footer__inner">
      <div class="site-footer__intro">
        <div class="site-footer__intro-top">
          <div class="site-footer__badge-row">
            <span class="site-footer__badge-icon" aria-hidden="true">
              <span class="site-footer__badge-plus">+</span>
            </span>
            <span class="site-footer__badge-label">Seguimos en contacto</span>
          </div>
          <img
            class="site-footer__wordmark"
            :src="logoMark"
            alt=""
            width="200"
            height="48"
            decoding="async"
          />
        </div>

        <p class="site-footer__lede">
          House, groove y sets en vivo — de Rosario a clubes y festivales.
        </p>
      </div>

      <div class="site-footer__grid">
        <div class="site-footer__col">
          <span class="site-footer__col-index" aria-hidden="true">01</span>
          <div class="site-footer__col-body">
            <p class="site-footer__kicker">Navegación</p>
            <nav class="site-footer__nav" aria-label="En esta página">
              <a class="site-footer__nav-link" href="#inicio">
                <span class="site-footer__nav-text">Inicio</span>
                <span class="site-footer__nav-arrow" aria-hidden="true">→</span>
              </a>
              <a class="site-footer__nav-link" href="#tracks">
                <span class="site-footer__nav-text">Tracks</span>
                <span class="site-footer__nav-arrow" aria-hidden="true">→</span>
              </a>
              <a class="site-footer__nav-link" href="#dj-info">
                <span class="site-footer__nav-text">Sobre</span>
                <span class="site-footer__nav-arrow" aria-hidden="true">→</span>
              </a>
              <a class="site-footer__nav-link" href="#live-sets">
                <span class="site-footer__nav-text">Live sets</span>
                <span class="site-footer__nav-arrow" aria-hidden="true">→</span>
              </a>
            </nav>
          </div>
        </div>

        <div class="site-footer__col">
          <span class="site-footer__col-index" aria-hidden="true">02</span>
          <div class="site-footer__col-body">
            <p class="site-footer__kicker">Booking</p>
            <a class="site-footer__link-strong" :href="mailtoHref">{{ bookingEmail }}</a>
            <p class="site-footer__hint">Respuesta habitual en 24–48 h.</p>
          </div>
        </div>

        <div class="site-footer__col">
          <span class="site-footer__col-index" aria-hidden="true">03</span>
          <div class="site-footer__col-body">
            <p class="site-footer__kicker">Press kit</p>
            <div class="site-footer__press-links">
              <a
                class="site-footer__link site-footer__link--row"
                :href="presskitEsUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Español (PDF)</span>
                <span class="site-footer__link-arrow" aria-hidden="true">→</span>
              </a>
              <a
                class="site-footer__link site-footer__link--row"
                :href="presskitEnUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>English (PDF)</span>
                <span class="site-footer__link-arrow" aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="site-footer__rule-wrap" aria-hidden="true">
        <span class="site-footer__rule-accent" />
        <hr class="site-footer__rule" />
      </div>

      <div class="site-footer__bottom">
        <p class="site-footer__legal">
          © {{ year }} Nacho Scoppa. Todos los derechos reservados.
        </p>
        <p class="site-footer__meta">Rosario · Argentina</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import logoMark from "../assets/nombreNacho.png";

const bookingEmail = "booking@nachoscoppa.com";
const presskitEsUrl = "/presskit/nacho-scoppa-es.pdf";
const presskitEnUrl = "/presskit/nacho-scoppa-en.pdf";

const year = new Date().getFullYear();

const mailtoHref = computed(
  () => `mailto:${bookingEmail}?subject=${encodeURIComponent("Booking — Nacho Scoppa")}`,
);
</script>

<style scoped>
.site-footer {
  --sf-black: #0a0a0a;
  --sf-muted: #525252;
  --sf-soft: #737373;
  --sf-pad-x: clamp(1.5rem, 5vw, 4rem);
  position: relative;
  z-index: 2;
  padding: clamp(3.25rem, 9vh, 5.75rem) var(--sf-pad-x) clamp(2.35rem, 6.5vh, 3.75rem);
  background:
    linear-gradient(175deg, rgba(255, 255, 255, 0.55) 0%, transparent 42%),
    linear-gradient(180deg, var(--page-bg, #f2f2f2) 0%, #e9e9e9 100%);
  color: var(--sf-black);
  font-family: "Inter", system-ui, sans-serif;
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  overflow: clip;
}

.site-footer::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, rgba(10, 10, 10, 0.18) 0%, transparent 70%);
  pointer-events: none;
  opacity: 0.9;
}

.site-footer__inner {
  position: relative;
  max-width: min(100%, 92rem);
  margin: 0 auto;
}

.site-footer__intro {
  margin-bottom: clamp(2.75rem, 6vw, 4.25rem);
}

.site-footer__intro-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 1.5rem;
  margin-bottom: clamp(1.35rem, 3.5vw, 2rem);
}

.site-footer__badge-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
}

.site-footer__badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--sf-black);
  color: #fff;
}

.site-footer__badge-plus {
  font-size: 1rem;
  font-weight: 300;
  line-height: 1;
  margin-top: -1px;
}

.site-footer__badge-label {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.55);
}

.site-footer__wordmark {
  display: block;
  height: clamp(1rem, 2.2vw, 1.45rem);
  width: auto;
  max-width: min(42vw, 11rem);
  object-fit: contain;
  object-position: right center;
  filter: brightness(0);
  opacity: 0.88;
}

.site-footer__title {
  margin: 0 0 clamp(1rem, 2.5vw, 1.5rem);
  max-width: min(40rem, 100%);
  font-size: clamp(1.35rem, 3.2vw, 2.35rem);
  font-weight: 700;
  letter-spacing: -0.034em;
  line-height: 1.28;
}

.site-footer__title-line {
  display: block;
}

.site-footer__title-line--dark {
  color: var(--sf-black);
  margin-bottom: 0.2em;
}

.site-footer__title-line--muted {
  color: var(--sf-muted);
  font-weight: 600;
  font-size: 0.92em;
  letter-spacing: -0.028em;
}

.site-footer__lede {
  margin: 0;
  max-width: min(34rem, 100%);
  font-size: clamp(0.9375rem, 1.35vw, 1.0625rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.5;
  color: var(--sf-soft);
}

.site-footer__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: clamp(0.65rem, 1.2vw, 0.9rem);
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.6) inset;
  overflow: hidden;
}

@media (min-width: 720px) {
  .site-footer__grid {
    grid-template-columns: 1.15fr 1fr 1fr;
  }
}

.site-footer__col {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.85rem 1.15rem;
  align-items: start;
  padding: clamp(1.35rem, 3vw, 1.85rem) clamp(1.15rem, 3vw, 1.65rem);
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

@media (min-width: 720px) {
  .site-footer__col {
    border-bottom: none;
    border-right: 1px solid rgba(0, 0, 0, 0.07);
    min-height: 100%;
  }

  .site-footer__col:last-child {
    border-right: none;
  }
}

.site-footer__col:last-child {
  border-bottom: none;
}

.site-footer__col-index {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  font-variant-numeric: tabular-nums;
  color: rgba(10, 10, 10, 0.3);
  line-height: 1.6;
  padding-top: 0.15rem;
}

.site-footer__col-body {
  min-width: 0;
}

.site-footer__kicker {
  margin: 0 0 0.65rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--sf-soft);
}

.site-footer__nav {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.site-footer__nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0;
  font-size: 0.96875rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--sf-black);
  text-decoration: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition:
    opacity 0.2s ease,
    background-color 0.2s ease;
}

.site-footer__nav-link:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.site-footer__nav-link:first-child {
  padding-top: 0;
}

.site-footer__nav-link:hover {
  opacity: 0.55;
}

.site-footer__nav-arrow {
  font-weight: 500;
  opacity: 0.35;
  flex-shrink: 0;
}

.site-footer__link-strong {
  display: inline-block;
  font-size: clamp(0.96875rem, 1.2vw, 1.0625rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--sf-black);
  text-decoration: none;
  word-break: break-word;
  transition: opacity 0.2s ease;
  margin-bottom: 0.45rem;
}

.site-footer__link-strong:hover {
  opacity: 0.55;
}

.site-footer__hint {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.015em;
  color: rgba(82, 82, 82, 0.9);
  line-height: 1.4;
}

.site-footer__press-links {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.site-footer__link {
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--sf-black);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.site-footer__link--row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 0.96875rem;
}

.site-footer__link--row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.site-footer__link--row:first-of-type {
  padding-top: 0;
}

.site-footer__link:hover {
  opacity: 0.5;
}

.site-footer__link-arrow {
  font-weight: 500;
  opacity: 0.4;
  flex-shrink: 0;
}

.site-footer__rule-wrap {
  position: relative;
  margin: clamp(2rem, 4.5vw, 2.85rem) 0 1.35rem;
}

.site-footer__rule-accent {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: clamp(2.5rem, 8vw, 4.5rem);
  height: 2px;
  background: linear-gradient(90deg, var(--sf-black), transparent);
  opacity: 0.2;
  pointer-events: none;
}

.site-footer__rule {
  margin: 0;
  border: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.09);
}

.site-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.65rem 1.75rem;
}

.site-footer__legal {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--sf-muted);
  line-height: 1.45;
}

.site-footer__meta {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(82, 82, 82, 0.85);
}

.site-footer__nav-link:focus-visible,
.site-footer__link-strong:focus-visible,
.site-footer__link:focus-visible {
  outline: 2px solid rgba(10, 10, 10, 0.35);
  outline-offset: 3px;
  border-radius: 2px;
}
</style>
