<template>
  <RouterView />
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";

let rafId = null;

function setRealVh() {
  // window.innerHeight da el alto real del viewport en Safari iOS
  // (excluye la barra de URL y controles del navegador)
  document.documentElement.style.setProperty(
    "--real-vh",
    `${window.innerHeight}px`
  );
}

onMounted(() => {
  setRealVh();
  window.addEventListener("resize", setRealVh);
  // En iOS, orientationchange dispara con el tamaño anterior; esperamos un frame
  window.addEventListener("orientationchange", () => {
    rafId = requestAnimationFrame(setRealVh);
  });
});

onUnmounted(() => {
  window.removeEventListener("resize", setRealVh);
  window.removeEventListener("orientationchange", setRealVh);
  if (rafId) cancelAnimationFrame(rafId);
});
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  --page-bg: #f2f2f2;
  /* Misma columna de contenido que la sección Agenda / fechas */
  --site-content-max: 1320px;
  --site-pad-x: clamp(1rem, 4vw, 3rem);
  /* Anclas (#tracks, #dj-info…): compensar navbar fija en desktop / tablet */
  scroll-padding-top: clamp(3.85rem, 8.9vw, 4.65rem);
}

@media (max-width: 960px) and (min-width: 769px) {
  html {
    scroll-padding-top: clamp(8.6rem, 28.8vw, 11.5rem);
  }
}

@media (max-width: 768px) {
  html {
    scroll-padding-top: 0.35rem;
  }
}

html,
body {
  margin: 0;
  min-height: 100%;
  background: var(--page-bg);
}

body {
  font-family: inherit;
}

#app {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--page-bg);
  font-family: inherit;
  /*
   * Solapamiento entre el hero y “Clientes”: un solo valor global.
   * La sección usa margin-top negativo con esta variable; el padding del contenido NO debe
   * volver a sumar todo este valor (eso recrea el hueco blanco gigante).
   */
  --clients-underlap: clamp(5.5rem, 24vh, 15rem);
  /* Misma lógica que Hero (--header-total): reserva bajo la navbar fija. */
  --site-header-offset: clamp(3.85rem, 8.9vw, 4.65rem);
  /* Live sets: tirar la sección bastante arriba para que el hueco de la animación caiga sobre Music (superposición real). */
  --live-underlap: clamp(18vh, 48vh, min(78vh, calc(100dvh - 4rem)));
}

@media (max-width: 960px) and (min-width: 769px) {
  #app {
    --site-header-offset: clamp(8.6rem, 28.8vw, 11.5rem);
  }
}

/* Contenedor de notas (fuera de Sobre el artista): mismo gutter que agenda */
.press-notes-region {
  --dj-pad-x: var(--site-pad-x);
  position: relative;
  z-index: 1;
  padding-inline: var(--dj-pad-x);
  background: var(--page-bg, #f2f2f2);
}
</style>
