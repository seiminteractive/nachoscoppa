<template>
  <section
    v-if="posts.length > 0"
    id="instagram-feed"
    ref="sectionRef"
    class="ig-feed"
    aria-labelledby="ig-feed-heading"
  >
    <div class="ig-feed__inner">
      <header class="ig-feed__head">
        <p id="ig-feed-heading" class="ig-feed__eyebrow">+ Instagram</p>
        <p class="ig-feed__meta">
          <a
            class="ig-feed__profile-link"
            :href="profileUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            @{{ instagramUsername }}
          </a>
        </p>
      </header>

      <div class="ig-feed__marquee" role="region" aria-label="Publicaciones recientes en carrusel">
        <div class="ig-feed__marquee-viewport">
          <div class="ig-feed__marquee-track">
            <div
              v-for="pass in marqueePasses"
              :key="pass"
              class="ig-feed__marquee-group"
              :aria-hidden="pass === 2 ? 'true' : undefined"
            >
              <a
                v-for="item in strip"
                :key="`${pass}-${item.uid}`"
                class="ig-card"
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div class="ig-card__cover">
                  <img
                    :src="item.image"
                    alt=""
                    width="320"
                    height="320"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { revealOnScroll } from "../composables/scrollReveal";

const JSON_URL = "/data/instagram-posts.json";

/** Copias por post dentro de cada mitad de la pista (ancho >> viewport). */
const POST_STRIP_COPIES = 4;
const marqueePasses = [1, 2];

const sectionRef = ref(null);
const posts = ref([]);
const instagramUsername = ref("nachoscoppa");
const profileUrl = ref("https://www.instagram.com/nachoscoppa/");

const strip = computed(() => {
  const p = posts.value;
  if (!p.length) return [];
  const out = [];
  for (let c = 0; c < POST_STRIP_COPIES; c += 1) {
    for (const post of p) {
      out.push({
        ...post,
        uid: `${post.shortcode}-${c}`,
      });
    }
  }
  return out;
});

/** Reveals independientes (head + carrusel). */
let revealTimelines = [];

onMounted(() => {
  fetch(JSON_URL)
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data?.username) instagramUsername.value = data.username;
      if (data?.profileUrl) profileUrl.value = data.profileUrl;
      const list = data?.posts;
      if (Array.isArray(list) && list.length > 0) {
        posts.value = list.filter((p) => p.image && p.url);
      }
    })
    .catch(() => {});
});

watch(
  () => posts.value.length,
  async (n) => {
    if (n === 0) return;
    await nextTick();

    const section = sectionRef.value;
    if (!(section instanceof HTMLElement)) return;

    revealTimelines.forEach((tl) => tl?.kill());
    revealTimelines = [];

    const head = section.querySelector(".ig-feed__head");
    const marquee = section.querySelector(".ig-feed__marquee");
    if (head) {
      const a = revealOnScroll(head, [head], { once: true });
      if (a) revealTimelines.push(a);
    }
    if (marquee) {
      const b = revealOnScroll(marquee, [marquee], { once: true });
      if (b) revealTimelines.push(b);
    }
    ScrollTrigger.refresh();
  },
);

onUnmounted(() => {
  revealTimelines.forEach((tl) => tl?.kill());
  revealTimelines = [];
});
</script>

<style scoped>
.ig-feed {
  position: relative;
  z-index: 1;
  padding: clamp(2.75rem, 7vw, 4.5rem) var(--site-pad-x, clamp(1rem, 4vw, 3rem))
    clamp(3rem, 8vw, 5rem);
  background: var(--page-bg, #f2f2f2);
  color: #0a0a0a;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.ig-feed__inner {
  max-width: var(--site-content-max, 1320px);
  margin: 0 auto;
}

.ig-feed__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem 1.5rem;
  margin-bottom: clamp(1rem, 2.5vw, 1.5rem);
  padding: 0 clamp(0.15rem, 0.5vw, 0.35rem);
}

.ig-feed__eyebrow {
  margin: 0;
  font-family: "Inter", system-ui, sans-serif;
  font-size: clamp(0.8125rem, 1.2vw, 0.9375rem);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.ig-feed__meta {
  margin: 0;
  font-size: clamp(0.75rem, 1.1vw, 0.875rem);
}

.ig-feed__profile-link {
  color: #52525b;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

.ig-feed__profile-link:hover {
  opacity: 0.65;
}

.ig-feed__marquee {
  position: relative;
  width: 100%;
}

.ig-feed__marquee-viewport {
  overflow: hidden;
  width: 100%;
  mask-image: linear-gradient(90deg, transparent 0%, #000 2%, #000 98%, transparent 100%);
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 2%, #000 98%, transparent 100%);
}

/* Misma velocidad aparente que + Tracks (80s): aquí hay más cards por tira → duración mayor. */
.ig-feed__marquee-track {
  display: flex;
  width: max-content;
  animation: ig-marquee 192s linear infinite;
  will-change: transform;
}

.ig-feed__marquee:hover .ig-feed__marquee-track {
  animation-play-state: paused;
}

.ig-feed__marquee-group {
  display: flex;
  align-items: flex-start;
  gap: clamp(0.65rem, 1.8vw, 1rem);
  padding-inline: clamp(0.35rem, 1vw, 0.5rem);
  flex-shrink: 0;
}

@keyframes ig-marquee {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-50%, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .ig-feed__marquee-track {
    animation: none;
  }

  .ig-feed__marquee-viewport {
    overflow-x: auto;
    overflow-y: hidden;
    mask-image: none;
    -webkit-mask-image: none;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .ig-feed__marquee-viewport::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
}

.ig-card {
  flex: 0 0 auto;
  width: clamp(7.25rem, 12.5vw, 10.25rem);
  text-decoration: none;
  color: inherit;
  border-radius: 0.5rem;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.ig-card:hover {
  transform: translateY(-2px);
  opacity: 0.92;
}

.ig-card:focus-visible {
  outline: 2px solid #0a0a0a;
  outline-offset: 3px;
}

.ig-card__cover {
  aspect-ratio: 1;
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #e4e4e7;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06);
}

.ig-card__cover img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
