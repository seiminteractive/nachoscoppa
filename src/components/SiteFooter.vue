<template>
  <footer ref="footerRootRef" class="site-footer" aria-labelledby="site-footer-heading">
    <div class="site-footer__inner">
      <div class="site-footer__intro">
        <h2 id="site-footer-heading" class="site-footer__visually-hidden">Pie de página</h2>
        <div class="site-footer__intro-row">
          <p class="site-footer__lede">
            De Rosario al mundo.
          </p>
          <img
            class="site-footer__wordmark"
            :src="logoMark"
            alt="Nacho Scoppa"
            width="200"
            height="48"
            decoding="async"
          />
        </div>
      </div>

      <div class="site-footer__main">
        <nav class="site-footer__nav" aria-label="En esta página">
          <a class="site-footer__nav-link" :href="`${hashLinkBase}#inicio`">Inicio</a>
          <a class="site-footer__nav-link" :href="`${hashLinkBase}#tracks`">Tracks</a>
          <a class="site-footer__nav-link" :href="`${hashLinkBase}#dj-info`">Sobre</a>
          <a class="site-footer__nav-link" :href="`${hashLinkBase}#live-sets`">Live sets</a>
        </nav>

        <div class="site-footer__block">
          <p class="site-footer__label">Contacto</p>
          <div class="site-footer__contact-lines">
            <p class="site-footer__contact-line">
              <span class="site-footer__contact-role">Booking</span>
              <a class="site-footer__mailto" :href="mailtoBooking">{{ bookingEmail }}</a>
            </p>
            <p class="site-footer__contact-line">
              <span class="site-footer__contact-role">Entrevistas / notas</span>
              <a class="site-footer__mailto" :href="mailtoPress">{{ pressEmail }}</a>
            </p>
          </div>
        </div>

        <div class="site-footer__block">
          <p class="site-footer__label">Press kit</p>
          <div class="site-footer__press-links">
            <a
              class="site-footer__text-link"
              :href="presskitEsUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Español (PDF)
            </a>
            <a
              class="site-footer__text-link"
              :href="presskitEnUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              English (PDF)
            </a>
          </div>
        </div>

        <div class="site-footer__block site-footer__block--social">
          <p class="site-footer__label">Redes</p>
          <ul class="site-footer__social" aria-label="Redes sociales">
            <li v-for="link in socialLinks" :key="link.name" class="site-footer__social-item">
              <a
                :href="link.href"
                class="site-footer__social-link"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="link.name"
              >
                <Icon :icon="link.icon" class="site-footer__social-icon" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <hr class="site-footer__rule" />

      <div class="site-footer__bottom">
        <p class="site-footer__legal">
          © <span ref="footerYearRef">{{ footerYearFrom }}</span> Nacho Scoppa. Todos los derechos reservados.
        </p>
        <p class="site-footer__meta">Rosario · Argentina</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logoMark from "../assets/nombreNacho.png";
import { socialLinks } from "../data/socialLinks.js";
import { countUpOnScroll } from "../composables/countUpOnScroll";
import { revealTextOnScroll } from "../composables/revealTextOnScroll";

gsap.registerPlugin(ScrollTrigger);

/** Prefijo para anclas internas (p. ej. `/` en `/agenda` → `/#inicio`). */
defineProps({
  hashLinkBase: { type: String, default: "" },
});

const bookingEmail = "aldo@conceptoneagency.com";
const pressEmail = "eugeniacoppados@gmail.com";
const presskitEsUrl = "/presskit/nacho-scoppa-es.pdf";
const presskitEnUrl = "/presskit/nacho-scoppa-en.pdf";

const year = new Date().getFullYear();
const footerYearFrom = Math.max(year - 14, 2000);
const footerRootRef = ref(null);
const footerYearRef = ref(null);
let footerScrollCtx;

const mailtoBooking = computed(
  () => `mailto:${bookingEmail}?subject=${encodeURIComponent("Booking — Nacho Scoppa")}`,
);

const mailtoPress = computed(
  () =>
    `mailto:${pressEmail}?subject=${encodeURIComponent("Entrevista / nota de prensa — Nacho Scoppa")}`,
);

onMounted(() => {
  nextTick(() => {
    const root = footerRootRef.value;
    if (!root) return;
    footerScrollCtx = gsap.context(() => {
      const lede = root.querySelector(".site-footer__lede");
      if (lede) revealTextOnScroll(lede, { trigger: lede, stagger: 0.06, duration: 1.05 });

      const bottom = root.querySelector(".site-footer__bottom");
      const yEl = footerYearRef.value;
      if (bottom && yEl) {
        countUpOnScroll(bottom, yEl, {
          from: footerYearFrom,
          to: year,
          format: (v) => String(Math.round(v)),
        });
      }
    }, root);
    ScrollTrigger.refresh();
  });
});

onUnmounted(() => {
  footerScrollCtx?.revert();
});
</script>

<style scoped>
.site-footer {
  --sf-ink: #0a0a0a;
  --sf-pad-x: var(--site-pad-x, clamp(1rem, 4vw, 3rem));
  position: relative;
  z-index: 2;
  padding: clamp(2.5rem, 6vh, 4rem) var(--sf-pad-x) clamp(2rem, 5vh, 3.25rem);
  background: var(--sf-ink);
  color: #f5f5f5;
  font-family: "Inter", system-ui, sans-serif;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.site-footer__inner {
  max-width: min(100%, var(--site-content-max, 1320px));
  margin: 0 auto;
}

.site-footer__visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.site-footer__intro {
  margin-bottom: clamp(2rem, 4.5vw, 2.75rem);
  padding-bottom: clamp(1.5rem, 3vw, 2rem);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.site-footer__intro-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem 1.5rem;
}

.site-footer__lede {
  margin: 0;
  flex: 1 1 12rem;
  max-width: min(28rem, 100%);
  font-size: clamp(0.875rem, 1.15vw, 0.96875rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.45;
  color: rgba(245, 245, 245, 0.58);
}

.site-footer__wordmark {
  display: block;
  height: clamp(0.95rem, 2vw, 1.25rem);
  width: auto;
  max-width: min(40vw, 10rem);
  object-fit: contain;
  object-position: right center;
  filter: brightness(0) invert(1);
  opacity: 0.92;
}

.site-footer__main {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1.75rem, 4vw, 2.5rem);
}

@media (min-width: 640px) {
  .site-footer__main {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 960px) {
  .site-footer__main {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.15fr) minmax(0, 0.85fr) minmax(0, 1fr);
    align-items: start;
    gap: clamp(1.5rem, 3vw, 2.75rem);
  }
}

.site-footer__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem 1.25rem;
  align-items: center;
}

.site-footer__nav-link {
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #f5f5f5;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.site-footer__nav-link:hover {
  opacity: 0.65;
}

.site-footer__label {
  margin: 0 0 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(245, 245, 245, 0.45);
}

.site-footer__contact-lines {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.site-footer__contact-line {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.site-footer__contact-role {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(245, 245, 245, 0.5);
  letter-spacing: -0.01em;
}

.site-footer__mailto {
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #ffffff;
  text-decoration: none;
  word-break: break-word;
  transition: opacity 0.2s ease;
}

.site-footer__mailto:hover {
  opacity: 0.75;
}

.site-footer__press-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.45rem;
}

.site-footer__text-link {
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #f5f5f5;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.site-footer__text-link:hover {
  opacity: 0.65;
}

.site-footer__block--social .site-footer__label {
  margin-bottom: 0.65rem;
}

.site-footer__social {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.site-footer__social-item {
  display: block;
}

.site-footer__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #f5f5f5;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.14);
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.site-footer__social-link:hover,
.site-footer__social-link:focus-visible {
  transform: translateY(-1px);
  background: #ffffff;
  color: var(--sf-ink);
  border-color: #ffffff;
}

.site-footer__social-icon {
  width: 1rem;
  height: 1rem;
}

.site-footer__rule {
  margin: clamp(1.75rem, 4vw, 2.5rem) 0 1.25rem;
  border: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
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
  color: rgba(245, 245, 245, 0.52);
  line-height: 1.45;
}

.site-footer__meta {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(245, 245, 245, 0.45);
}

.site-footer__nav-link:focus-visible,
.site-footer__mailto:focus-visible,
.site-footer__text-link:focus-visible,
.site-footer__social-link:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.45);
  outline-offset: 3px;
}

/* Una columna (<640px): todo centrado; press kit en fila */
@media (max-width: 639px) {
  .site-footer__intro {
    margin-bottom: clamp(1.35rem, 3.5vw, 1.85rem);
    padding-bottom: clamp(1rem, 2.5vw, 1.35rem);
  }

  .site-footer__intro-row {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.65rem;
  }

  .site-footer__lede {
    /* Evita flex-grow: el bloque no debe estirarse y vaciar espacio hasta el wordmark */
    flex: 0 1 auto;
    width: 100%;
    max-width: 22rem;
    text-align: center;
  }

  .site-footer__wordmark {
    object-position: center;
    max-width: min(75vw, 11rem);
    height: clamp(1rem, 4.2vw, 1.15rem);
  }

  .site-footer__main {
    text-align: center;
  }

  .site-footer__nav {
    justify-content: center;
  }

  .site-footer__block {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .site-footer__contact-lines {
    align-items: center;
  }

  .site-footer__contact-line {
    align-items: center;
    text-align: center;
  }

  .site-footer__press-links {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0.5rem 1.1rem;
  }

  .site-footer__social {
    justify-content: center;
  }

  .site-footer__bottom {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
