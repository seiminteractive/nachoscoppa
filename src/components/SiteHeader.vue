<template>
  <div ref="headerIntroRoot" class="hero__header">
    <header class="hero__nav" :class="{ 'hero__nav--open': navOpen }">
      <RouterLink to="/" class="hero__logo" @click="navOpen = false">
        <img
          class="hero__logo-img"
          :src="logoMark"
          alt="Nacho Scoppa"
          width="200"
          height="48"
          decoding="async"
        />
      </RouterLink>

      <button
        type="button"
        class="hero__burger"
        :aria-expanded="navOpen ? 'true' : 'false'"
        aria-controls="hero-nav-panel"
        aria-label="Abrir o cerrar menú"
        @click="toggleNav"
      >
        <span class="hero__burger-lines" aria-hidden="true">
          <span class="hero__burger-bar" />
          <span class="hero__burger-bar" />
          <span class="hero__burger-bar" />
        </span>
      </button>

      <div id="hero-nav-panel" class="hero__nav-panel">
        <nav class="hero__menu" aria-label="Principal">
          <p class="hero__menu-kicker">
            <span class="hero__menu-kicker-line" aria-hidden="true" />
            <span class="hero__menu-kicker-text">Menú</span>
          </p>
          <RouterLink to="/" class="hero__link" @click="navOpen = false">
            <span class="hero__menu-index" aria-hidden="true">01</span>
            <span class="hero__menu-text">Home</span>
          </RouterLink>
          <a href="/#tracks" class="hero__link" @click="navOpen = false">
            <span class="hero__menu-index" aria-hidden="true">02</span>
            <span class="hero__menu-text">Music</span>
          </a>
          <a href="/#dj-info" class="hero__link" @click="navOpen = false">
            <span class="hero__menu-index" aria-hidden="true">03</span>
            <span class="hero__menu-text">About</span>
          </a>
          <a href="/#live-sets" class="hero__link" @click="navOpen = false">
            <span class="hero__menu-index" aria-hidden="true">04</span>
            <span class="hero__menu-text">Sets</span>
          </a>
          <RouterLink to="/agenda" class="hero__link" @click="navOpen = false">
            <span class="hero__menu-index" aria-hidden="true">05</span>
            <span class="hero__menu-text">Agenda</span>
          </RouterLink>
          <a
            href="https://coppados.com/"
            class="hero__link"
            target="_blank"
            rel="noopener noreferrer"
            @click="navOpen = false"
          >
            <span class="hero__menu-index" aria-hidden="true">06</span>
            <span class="hero__menu-text">Coppados</span>
          </a>
        </nav>

        <div class="hero__nav-panel-foot">
          <p class="hero__nav-foot-kicker">Consultas &amp; booking</p>
          <a href="/#contact" class="hero__cta" @click="navOpen = false">
            <span class="hero__cta-dot" aria-hidden="true" />
            <span class="hero__cta-label">Contacto</span>
          </a>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";
import { RouterLink } from "vue-router";
import { gsap } from "gsap";
import logoMark from "../assets/nombreNacho.webp";

const navOpen = ref(false);
const headerIntroRoot = ref(null);

let introCtx;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function runHeaderIntro() {
  const root = headerIntroRoot.value;
  if (!root) return;

  introCtx?.revert();
  introCtx = gsap.context(() => {
    const logo = root.querySelector(".hero__logo");
    const burger = root.querySelector(".hero__burger");
    const links = root.querySelectorAll(".hero__menu .hero__link");
    const cta = root.querySelector(".hero__nav-panel-foot .hero__cta");
    const menuKicker = root.querySelector(".hero__menu-kicker");

    const isMobileNav =
      typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

    const allEls = [logo, burger, cta, menuKicker, ...links].filter(Boolean);

    if (prefersReducedMotion()) {
      gsap.set(allEls, { opacity: 1, y: 0 });
      return;
    }

    const clearIntro = () => {
      gsap.set(allEls, { clearProps: "transform" });
    };

    if (isMobileNav) {
      const leadEls = [logo, burger].filter(Boolean);
      const D = 1.6;
      const ease = "power3.out";
      const tl = gsap.timeline({ defaults: { ease }, onComplete: clearIntro });
      tl.fromTo(leadEls, { opacity: 0, y: -22 }, { opacity: 1, y: 0, duration: D }, 0);
      if (menuKicker) tl.fromTo(menuKicker, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: D }, 0.2);
      tl.fromTo(links, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: D, stagger: 0.09 }, 0.25);
      if (cta) tl.fromTo(cta, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: D }, 0.38);
    } else {
      /** Desktop: entrada bien suave, sin “cortes”. */
      const D = 1.7;
      const ease = "power3.out";
      const tl = gsap.timeline({ defaults: { ease }, onComplete: clearIntro });
      tl.fromTo(logo, { opacity: 0, y: -22 }, { opacity: 1, y: 0, duration: D }, 0);
      tl.fromTo(
        links,
        { opacity: 0, y: -18 },
        { opacity: 1, y: 0, duration: D, stagger: 0.09 },
        0.15
      );
      if (cta) tl.fromTo(cta, { opacity: 0, y: -18 }, { opacity: 1, y: 0, duration: D }, 0.3);
    }
  }, root);
}

function toggleNav() {
  navOpen.value = !navOpen.value;
}

function onNavKeydown(e) {
  if (e.key === "Escape") navOpen.value = false;
}

function onResizeNav() {
  if (typeof window === "undefined") return;
  if (window.innerWidth > 768) navOpen.value = false;
}

watch(navOpen, (open) => {
  if (typeof document === "undefined") return;
  const w = typeof window !== "undefined" ? window.innerWidth : 1024;
  if (w <= 768) {
    document.body.style.overflow = open ? "hidden" : "";
  } else {
    document.body.style.overflow = "";
  }
});

onMounted(() => {
  window.addEventListener("keydown", onNavKeydown);
  window.addEventListener("resize", onResizeNav);
  nextTick(() => runHeaderIntro());
});

onUnmounted(() => {
  window.removeEventListener("keydown", onNavKeydown);
  window.removeEventListener("resize", onResizeNav);
  if (typeof document !== "undefined") document.body.style.overflow = "";
  introCtx?.revert();
  introCtx = null;
});
</script>

<style scoped>
.hero__header {
  --header-total: clamp(3.85rem, 8.9vw, 4.65rem);
  --nav-pad-x: clamp(0.65rem, 2vw, 1.05rem);
  --pad-y-nav: clamp(0.62rem, 1.3vw, 0.88rem);
  --menu-gap: clamp(0.85rem, 2vw, 1.5rem);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 50;
  background: var(--page-bg, #f2f2f2);
  pointer-events: auto;
  font-family: "Inter", system-ui, sans-serif;
}

.hero__nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  column-gap: clamp(0.65rem, 1.8vw, 1.15rem);
  min-height: var(--header-total);
  padding: var(--pad-y-nav) var(--nav-pad-x);
}

.hero__nav-panel {
  display: contents;
}

.hero__burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 0.5rem;
  background: transparent;
  color: #0a0a0a;
  cursor: pointer;
  flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

.hero__burger:focus-visible {
  outline: 2px solid #0a0a0a;
  outline-offset: 2px;
}

.hero__burger-lines {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 1.35rem;
}

.hero__burger-bar {
  display: block;
  height: 2px;
  border-radius: 1px;
  background: currentColor;
  transition: transform 0.25s ease, opacity 0.2s ease;
  transform-origin: center;
}

.hero__nav--open .hero__burger-bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hero__nav--open .hero__burger-bar:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hero__nav--open .hero__burger-bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.hero__logo {
  grid-column: 1;
  justify-self: start;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  line-height: 0;
  text-decoration: none;
  opacity: 0;
}

.hero__logo-img {
  display: block;
  height: clamp(1.15rem, 2.05vw, 1.5rem);
  width: auto;
  max-width: min(38vw, 10rem);
  object-fit: contain;
  object-position: left center;
  filter: brightness(0);
}

.hero__menu {
  grid-column: 2;
  justify-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--menu-gap);
  min-width: 0;
  padding-inline: 0.35rem;
  flex-wrap: nowrap;
}

.hero__link {
  color: #0a0a0a;
  text-decoration: none;
  font-size: clamp(0.8125rem, 1.15vw, 0.9375rem);
  font-weight: 500;
  letter-spacing: -0.015em;
  text-transform: none;
  transition: opacity 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  opacity: 0;
}

.hero__link:hover {
  opacity: 0.55;
  color: #0a0a0a;
}

.hero__cta {
  grid-column: 3;
  justify-self: end;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.38rem 1.15rem 0.38rem 0.8rem;
  border-radius: 999px;
  background: var(--page-bg, #f2f2f2);
  color: #0a0a0a;
  border: 1px solid rgba(0, 0, 0, 0.18);
  text-decoration: none;
  font-size: clamp(0.8125rem, 1.15vw, 0.9375rem);
  font-weight: 600;
  letter-spacing: -0.015em;
  white-space: nowrap;
  flex-shrink: 0;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  opacity: 0;
}

.hero__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.28);
}

.hero__cta-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #000;
  flex-shrink: 0;
}

.hero__nav-panel-foot {
  display: contents;
}

.hero__menu-kicker {
  display: none;
  margin: 0;
  align-items: center;
  gap: 0.75rem;
}

.hero__menu-kicker-line {
  display: block;
  flex: 1;
  max-width: 4.5rem;
  height: 1px;
  background: linear-gradient(90deg, rgba(10, 10, 10, 0.35), rgba(10, 10, 10, 0));
}

.hero__menu-kicker-text {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.42);
  white-space: nowrap;
}

.hero__menu-index {
  display: none;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  font-variant-numeric: tabular-nums;
  color: rgba(10, 10, 10, 0.32);
  line-height: 1;
}

.hero__nav-foot-kicker {
  display: none;
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(10, 10, 10, 0.38);
}

@keyframes heroMenuFadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1200px) {
  .hero__header {
    --menu-gap: clamp(0.85rem, 2.4vw, 1.65rem);
  }
}

@media (max-width: 960px) and (min-width: 769px) {
  .hero__header {
    --header-total: clamp(8.6rem, 28.8vw, 11.5rem);
  }
}

@media (max-width: 960px) {
  .hero__nav {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    row-gap: 1rem;
  }

  .hero__logo {
    grid-column: unset;
    justify-self: unset;
  }

  .hero__menu {
    grid-column: unset;
    justify-self: unset;
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    row-gap: 0.65rem;
    column-gap: var(--menu-gap);
    padding-inline: 0;
  }

  .hero__cta {
    grid-column: unset;
    justify-self: unset;
    align-self: flex-end;
    width: fit-content;
  }
}

@media (max-width: 768px) {
  .hero__header {
    position: relative;
    z-index: 300;
    --header-total: auto;
  }

  .hero__nav {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto;
    align-items: center;
    justify-items: stretch;
    position: relative;
    z-index: 1;
    min-height: 0;
    padding-top: 0.65rem;
    padding-bottom: 0.65rem;
  }

  .hero__logo {
    grid-column: 1;
    grid-row: 1;
    justify-self: start;
    position: relative;
    z-index: 260;
  }

  .hero__burger {
    display: flex;
    grid-column: 2;
    grid-row: 1;
    justify-self: end;
    position: relative;
    z-index: 260;
  }

  .hero__nav-panel {
    position: fixed;
    inset: 0;
    z-index: 250;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: 0;
    width: 100%;
    height: 100dvh;
    max-height: none;
    margin: 0;
    padding: max(5.25rem, calc(env(safe-area-inset-top) + 3.25rem))
      clamp(1.35rem, 6vw, 2rem) max(1.35rem, env(safe-area-inset-bottom));
    box-sizing: border-box;
    background:
      linear-gradient(165deg, rgba(255, 255, 255, 0.55) 0%, transparent 38%),
      linear-gradient(180deg, var(--page-bg, #f2f2f2) 0%, #e8e8e8 100%);
    border-top: none;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    transform: translateY(-0.5rem);
    transition:
      opacity 0.35s ease,
      visibility 0.35s ease,
      transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .hero__nav-panel::before {
    content: "";
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, rgba(10, 10, 10, 0.2) 0%, transparent 72%);
    pointer-events: none;
    opacity: 0.85;
  }

  .hero__nav--open .hero__nav-panel {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    transform: translateY(0);
  }

  .hero__nav--open .hero__menu-kicker {
    animation: heroMenuFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.05s backwards;
  }

  .hero__nav--open .hero__menu .hero__link:nth-child(2) {
    animation: heroMenuFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.1s backwards;
  }

  .hero__nav--open .hero__menu .hero__link:nth-child(3) {
    animation: heroMenuFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.15s backwards;
  }

  .hero__nav--open .hero__menu .hero__link:nth-child(4) {
    animation: heroMenuFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.2s backwards;
  }

  .hero__nav--open .hero__menu .hero__link:nth-child(5) {
    animation: heroMenuFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.25s backwards;
  }

  .hero__nav--open .hero__menu .hero__link:nth-child(6) {
    animation: heroMenuFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.3s backwards;
  }

  .hero__nav--open .hero__menu .hero__link:nth-child(7) {
    animation: heroMenuFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.35s backwards;
  }

  .hero__nav--open .hero__nav-panel-foot {
    animation: heroMenuFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.4s backwards;
  }

  .hero__menu-kicker {
    display: flex;
    width: 100%;
    padding-bottom: 1.1rem;
    margin-bottom: 0.35rem;
    border-bottom: 1px solid rgba(10, 10, 10, 0.08);
  }

  .hero__menu-index {
    display: block;
  }

  .hero__nav-foot-kicker {
    display: block;
  }

  .hero__nav-panel-foot {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.55rem;
    flex-shrink: 0;
    margin-top: auto;
    padding-top: clamp(1.35rem, 4.5vh, 2.15rem);
    border-top: 1px solid rgba(10, 10, 10, 0.1);
  }

  .hero__menu {
    grid-column: unset;
    grid-row: unset;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    flex-wrap: nowrap;
    gap: 0;
    width: 100%;
    min-height: 0;
    padding-inline: 0;
  }

  .hero__menu .hero__link {
    display: grid;
    grid-template-columns: minmax(2rem, 2.35rem) minmax(0, 1fr);
    gap: 0.85rem 1.1rem;
    align-items: baseline;
    width: 100%;
    box-sizing: border-box;
    padding: clamp(0.95rem, 2.8vh, 1.35rem) 0;
    border-bottom: 1px solid rgba(10, 10, 10, 0.07);
    font-size: clamp(1.45rem, 6.2vw, 2rem);
    font-weight: 600;
    letter-spacing: -0.035em;
    line-height: 1.05;
    text-align: left;
    color: #0a0a0a;
    -webkit-tap-highlight-color: transparent;
    transition:
      color 0.2s ease,
      transform 0.2s ease;
  }

  .hero__menu .hero__link:last-of-type {
    border-bottom: none;
  }

  .hero__menu .hero__link:active {
    transform: scale(0.985);
  }

  .hero__menu .hero__link:focus-visible {
    outline: 2px solid rgba(10, 10, 10, 0.28);
    outline-offset: 3px;
    border-radius: 2px;
  }

  .hero__nav-panel .hero__cta {
    grid-column: unset;
    grid-row: unset;
    justify-self: stretch;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0;
    padding: clamp(1rem, 3vh, 1.25rem) 0;
    border: none;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    font-size: clamp(1.2rem, 4.8vw, 1.5rem);
    font-weight: 600;
    letter-spacing: -0.03em;
    color: #0a0a0a;
    -webkit-tap-highlight-color: transparent;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  .hero__nav-panel .hero__cta::after {
    content: "";
    flex: 1 1 auto;
    max-width: 5rem;
    height: 1px;
    background: rgba(10, 10, 10, 0.2);
  }

  .hero__nav-panel .hero__cta:hover {
    transform: none;
    box-shadow: none;
    border: none;
    opacity: 0.55;
  }

  .hero__nav-panel .hero__cta:active {
    transform: scale(0.985);
  }

  .hero__nav-panel .hero__cta:focus-visible {
    outline: 2px solid rgba(10, 10, 10, 0.28);
    outline-offset: 3px;
    border-radius: 2px;
  }

  .hero__nav-panel .hero__cta-dot {
    display: none;
  }
}

@media (max-width: 768px) and (prefers-reduced-motion: reduce) {
  .hero__nav-panel {
    transform: none;
    transition:
      opacity 0.2s ease,
      visibility 0.2s ease;
  }

  .hero__nav--open .hero__menu-kicker,
  .hero__nav--open .hero__menu .hero__link,
  .hero__nav--open .hero__nav-panel-foot {
    animation: none;
  }
}
</style>
