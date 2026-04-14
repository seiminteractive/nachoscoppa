<template>
  <section id="contact" class="contact" aria-labelledby="contact-heading">
    <div class="contact__bg" aria-hidden="true">
      <div class="contact__bg-img" />
      <div class="contact__bg-scrim" />
      <div class="contact__grain" />
    </div>

    <div class="contact__inner">
      <div class="contact__card">
        <p class="contact__brand">nacho scoppa<sup class="contact__brand-reg" aria-hidden="true">®</sup></p>

        <h2 id="contact-heading" class="contact__title">
          <span class="contact__title-strong">Tenés una fecha</span><span class="contact__title-muted"> en mente?</span>
        </h2>

        <form class="contact__form" @submit.prevent="onSubmit">
          <div class="contact__field">
            <label class="contact__label" for="contact-name">Tu nombre*</label>
            <input
              id="contact-name"
              v-model="form.name"
              class="contact__input"
              type="text"
              name="name"
              autocomplete="name"
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div class="contact__field">
            <label class="contact__label" for="contact-email">E-mail*</label>
            <input
              id="contact-email"
              v-model="form.email"
              class="contact__input"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="hola@sitio.com"
              required
            />
          </div>

          <div class="contact__field">
            <label class="contact__label" for="contact-message">Mensaje</label>
            <textarea
              id="contact-message"
              v-model="form.message"
              class="contact__input contact__textarea"
              name="message"
              rows="5"
              placeholder="Tu mensaje"
            />
          </div>

          <button type="submit" class="contact__submit">Enviar mensaje</button>
        </form>

        <p class="contact__legal">
          Al enviar, aceptás nuestros
          <a href="#" class="contact__legal-link">Términos</a>
          y la
          <a href="#" class="contact__legal-link">Política de privacidad.</a>
        </p>
      </div>

      <div class="contact__aside">
        <h3 class="contact__aside-kicker">Hablemos.</h3>
        <div class="contact__aside-lead">
          <p class="contact__aside-lead-line">
            Contame tu proyecto — booking, festival, club o colaboración.
          </p>
          <p class="contact__aside-lead-line">
            Armamos el sonido y la logística a medida.
          </p>
        </div>

        <hr class="contact__rule" />

        <div class="contact__features">
          <div class="contact__feature">
            <span class="contact__feature-icon" aria-hidden="true">
              <svg class="contact__feature-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="11.5" stroke="currentColor" stroke-width="1" />
                <path
                  d="M16 9v7.25l4.2 2.5"
                  stroke="currentColor"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <div class="contact__feature-text">
              <p class="contact__feature-title">Respuesta rápida.</p>
              <p class="contact__feature-body">
                Te escribimos a la brevedad con disponibilidad, rider y próximos pasos para cerrar la fecha.
              </p>
            </div>
          </div>

          <div class="contact__feature">
            <span class="contact__feature-icon" aria-hidden="true">
              <svg class="contact__feature-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 23.5h16M10 19h12M12 14.5h8M14 10h4"
                  stroke="currentColor"
                  stroke-width="1"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <div class="contact__feature-text">
              <p class="contact__feature-title">Pasos claros.</p>
              <p class="contact__feature-body">
                Brief, fee y producción sin vueltas: sabés qué esperar antes y después del show.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive } from "vue";
import heroImg from "../assets/imagenHero.jpg";

/** Fondo difuminado (misma imagen que hero, estética referencia). */
const contactBgImage = `url(${heroImg})`;

/** Cambiá por tu mail de booking. */
const BOOKING_EMAIL = "booking@nachoscoppa.com";

const form = reactive({
  name: "",
  email: "",
  message: "",
});

function onSubmit() {
  const subject = encodeURIComponent(`Contacto web — ${form.name || "Sin nombre"}`);
  const body = encodeURIComponent(
    `Nombre: ${form.name}\nEmail: ${form.email}\n\n${form.message || "(sin mensaje)"}`
  );
  window.location.href = `mailto:${BOOKING_EMAIL}?subject=${subject}&body=${body}`;
}
</script>

<style scoped>
.contact {
  --contact-pad-x: clamp(1.5rem, 4vw, 3rem);
  --contact-black: #000000;
  --contact-white: #ffffff;
  --contact-input-bg: #f5f5f5;
  --contact-title-muted: #737373;
  --contact-placeholder: #737373;
  --contact-aside-body: #ffffff;
  --contact-feature-muted: #999999;
  --contact-legal: #9ca3af;
  position: relative;
  isolation: isolate;
  padding: clamp(3rem, 8vh, 5.5rem) var(--contact-pad-x) clamp(3.25rem, 9vh, 5.75rem);
  color: var(--contact-white);
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

.contact__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.contact__bg-img {
  position: absolute;
  inset: -14%;
  background-image: v-bind(contactBgImage);
  background-size: cover;
  background-position: center;
  filter: blur(26px) brightness(0.38) saturate(0.92);
  transform: scale(1.06);
}

.contact__bg-scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(118deg, rgba(18, 14, 12, 0.55) 0%, transparent 50%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.72) 100%);
}

/* Textura fina tipo plantilla Framer (grano sobre el fondo oscuro). */
.contact__grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.11;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

.contact__inner {
  position: relative;
  z-index: 2;
  max-width: min(100%, 80rem);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: clamp(2rem, 4.5vw, 3.75rem);
  align-items: start;
}

/* Card: blanco puro, radios muy grandes, casi sin sombra (referencia “clean / shadowless”). */
.contact__card {
  background: var(--contact-white);
  color: var(--contact-black);
  border-radius: clamp(1.75rem, 2.6vw, 2.375rem);
  padding: clamp(1.75rem, 3.2vw, 2.5rem);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
}

.contact__brand {
  margin: 0 0 clamp(1.35rem, 2.5vw, 1.85rem);
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: -0.018em;
  text-transform: lowercase;
  line-height: 1.2;
}

.contact__brand-reg {
  font-size: 0.58em;
  font-weight: 600;
  vertical-align: super;
  margin-left: 0.04em;
}

/* Título: negrita + segunda parte en gris medio (misma lógica que “Have a project” / “in mind?”). */
.contact__title {
  margin: 0 0 clamp(1.35rem, 2.4vw, 1.85rem);
  font-size: clamp(1.35rem, 2.15vw, 1.75rem);
  font-weight: 700;
  line-height: 1.16;
  letter-spacing: -0.032em;
}

.contact__title-strong {
  font-weight: 700;
  color: var(--contact-black);
}

.contact__title-muted {
  font-weight: 700;
  color: var(--contact-title-muted);
}

.contact__form {
  display: flex;
  flex-direction: column;
  gap: clamp(0.95rem, 1.6vw, 1.15rem);
}

.contact__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.contact__label {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: var(--contact-black);
}

.contact__input {
  width: 100%;
  margin: 0;
  padding: 0.72rem 0.88rem;
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.4;
  color: var(--contact-black);
  background: var(--contact-input-bg);
  border: none;
  border-radius: 10px;
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
}

.contact__input::placeholder {
  color: var(--contact-placeholder);
}

.contact__input:hover {
  background: #eeeeee;
}

.contact__input:focus {
  outline: none;
  box-shadow: 0 0 0 1.5px var(--contact-black);
  background: var(--contact-white);
}

.contact__textarea {
  min-height: 7.5rem;
  resize: vertical;
  display: block;
}

/* Botón pill a todo el ancho del formulario (referencia Framer). */
.contact__submit {
  width: 100%;
  margin-top: 0.15rem;
  padding: 0.78rem 1.5rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: -0.012em;
  color: var(--contact-white);
  background: var(--contact-black);
  border: none;
  border-radius: 999px;
  cursor: pointer;
  text-align: center;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.contact__submit:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.contact__submit:active {
  transform: translateY(0);
}

.contact__legal {
  margin: clamp(1.1rem, 2vw, 1.45rem) 0 0;
  font-size: 0.6875rem;
  line-height: 1.5;
  color: var(--contact-legal);
}

.contact__legal-link {
  color: #6b7280;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.18em;
}

.contact__legal-link:hover {
  color: var(--contact-black);
}

/* Columna derecha */
.contact__aside {
  padding-top: 0.5rem;
}

.contact__aside-kicker {
  margin: 0 0 0.85rem;
  font-size: clamp(2.125rem, 4.8vw, 3.125rem);
  font-weight: 700;
  letter-spacing: -0.038em;
  line-height: 1.02;
  color: var(--contact-white);
}

.contact__aside-lead {
  margin: 0 0 1.35rem;
  max-width: 28rem;
}

.contact__aside-lead-line {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.55;
  color: var(--contact-aside-body);
}

.contact__aside-lead-line + .contact__aside-lead-line {
  margin-top: 0.15rem;
}

.contact__rule {
  margin: 0 0 1.35rem;
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.contact__features {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1.25rem, 2.5vw, 2rem);
}

.contact__feature {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  min-width: 0;
}

.contact__feature-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  color: var(--contact-white);
}

.contact__feature-svg {
  width: 1.4rem;
  height: 1.4rem;
}

.contact__feature-title {
  margin: 0 0 0.35rem;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.25;
  color: var(--contact-white);
}

.contact__feature-body {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--contact-feature-muted);
}

@media (max-width: 900px) {
  .contact__inner {
    grid-template-columns: 1fr;
    gap: clamp(2rem, 5vw, 2.75rem);
  }

  .contact__aside {
    padding-top: 0;
  }

  .contact__features {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact__bg-img {
    filter: blur(14px) brightness(0.4) saturate(0.92);
  }

  .contact__submit {
    transition: none;
  }

  .contact__submit:hover {
    transform: none;
  }
}
</style>
