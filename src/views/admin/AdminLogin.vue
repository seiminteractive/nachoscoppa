<template>
  <div class="login">
    <aside class="login__aside" aria-hidden="true">
      <div class="login__aside-img" :style="{ backgroundImage: `url(${asideImg})` }" />
      <div class="login__aside-scrim" />
      <div class="login__aside-content">
        <img class="login__aside-logo" :src="logoMark" alt="" width="220" height="48" />
      </div>
    </aside>

    <main class="login__main">
      <div class="login__inner">
        <img class="login__logo" :src="logoMark" alt="Nacho Scoppa" width="220" height="48" />

        <header class="login__head">
          <h1 class="login__title">Panel de administración</h1>
          <p class="login__sub">Ingresá con tu cuenta autorizada.</p>
        </header>

        <form class="login__form" @submit.prevent="onSubmit">
          <div class="login__field">
            <label class="login__label" for="login-email">Email</label>
            <input
              id="login-email"
              v-model="email"
              class="login__input"
              type="email"
              autocomplete="email"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div class="login__field">
            <label class="login__label" for="login-password">Contraseña</label>
            <div class="login__inputWrap">
              <input
                id="login-password"
                v-model="password"
                class="login__input"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                class="login__toggle"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? "Ocultar" : "Ver" }}
              </button>
            </div>
          </div>

          <p v-if="error" class="login__error">{{ error }}</p>

          <button type="submit" class="login__submit" :disabled="loading">
            <span v-if="loading" class="login__spinner" aria-hidden="true"></span>
            {{ loading ? "Ingresando…" : "Ingresar" }}
          </button>
        </form>

        <p class="login__legal">Acceso restringido a cuentas autorizadas.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "../../composables/useAuth";
import { isAdminEmail } from "../../lib/firebase";
import logoMark from "../../assets/nombreNacho.webp";
import asideImg from "../../assets/nachoVertical.webp";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const showPassword = ref(false);

const { login, user, ready, isAdmin } = useAuth();
const router = useRouter();
const route = useRoute();

watchEffect(() => {
  if (ready.value && user.value && isAdmin.value) {
    const next = typeof route.query.next === "string" ? route.query.next : "/admin/dashboard";
    router.replace(next);
  }
});

async function onSubmit() {
  error.value = "";
  if (!isAdminEmail(email.value)) {
    error.value = "Este email no está autorizado.";
    return;
  }
  loading.value = true;
  try {
    await login(email.value.trim(), password.value);
  } catch (e) {
    error.value = e?.code === "auth/invalid-credential"
      ? "Email o contraseña incorrectos."
      : (e?.message || "No se pudo iniciar sesión.");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 1fr;
  background: var(--page-bg, #f2f2f2);
  color: #0a0a0a;
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Panel lateral con imagen (solo desktop) */
.login__aside {
  display: none;
}

.login__aside-img {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center 18%;
  transform: scale(1.02);
}

.login__aside-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.12) 0%,
    rgba(0, 0, 0, 0.18) 45%,
    rgba(0, 0, 0, 0.72) 100%
  );
}

.login__aside-content {
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: clamp(2rem, 3.5vw, 3rem);
}

.login__aside-logo {
  height: clamp(1.4rem, 2vw, 1.85rem);
  width: auto;
  object-fit: contain;
  object-position: left center;
  filter: brightness(0) invert(1);
}

/* Columna del formulario */
.login__main {
  display: grid;
  place-items: center;
  padding: clamp(1.5rem, 5vw, 3rem);
}

.login__inner {
  width: 100%;
  max-width: 22rem;
  display: flex;
  flex-direction: column;
}

.login__logo {
  height: clamp(1.35rem, 4vw, 1.7rem);
  width: auto;
  object-fit: contain;
  object-position: left center;
  filter: brightness(0);
  margin-bottom: clamp(2.5rem, 7vw, 3.5rem);
}

.login__head {
  margin-bottom: clamp(1.5rem, 4vw, 2rem);
}

.login__title {
  margin: 0 0 0.4rem;
  font-size: clamp(1.5rem, 4vw, 1.85rem);
  font-weight: 700;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.login__sub {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.5;
  color: #737373;
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.login__label {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #0a0a0a;
}

.login__inputWrap {
  position: relative;
  display: flex;
  align-items: center;
}

.login__input {
  width: 100%;
  margin: 0;
  padding: 0.8rem 0.95rem;
  font: inherit;
  font-size: 0.9375rem;
  line-height: 1.4;
  color: #0a0a0a;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
  box-sizing: border-box;
}

.login__input::placeholder {
  color: #9ca3af;
}

.login__inputWrap .login__input {
  padding-right: 4rem;
}

.login__input:hover {
  border-color: rgba(0, 0, 0, 0.22);
}

.login__input:focus {
  outline: none;
  border-color: #0a0a0a;
  box-shadow: 0 0 0 3px rgba(10, 10, 10, 0.08);
}

.login__toggle {
  position: absolute;
  right: 0.5rem;
  padding: 0.35rem 0.5rem;
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: #737373;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.15s ease;
}

.login__toggle:hover {
  color: #0a0a0a;
}

.login__error {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: #b91c1c;
}

.login__submit {
  width: 100%;
  margin-top: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.85rem 1.5rem;
  font: inherit;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.012em;
  color: #ffffff;
  background: #0a0a0a;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.login__submit:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.login__submit:active:not(:disabled) {
  transform: translateY(0);
}

.login__submit:disabled {
  opacity: 0.55;
  cursor: progress;
}

.login__spinner {
  width: 0.95rem;
  height: 0.95rem;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: login-spin 0.6s linear infinite;
}

@keyframes login-spin {
  to { transform: rotate(360deg); }
}

.login__legal {
  margin: clamp(2rem, 6vw, 2.75rem) 0 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: #9ca3af;
}

/* Split en desktop */
@media (min-width: 900px) {
  .login {
    grid-template-columns: 1.05fr 1fr;
  }

  .login__aside {
    position: relative;
    display: block;
    overflow: hidden;
    margin: clamp(0.75rem, 1vw, 1rem);
    border-radius: clamp(1.25rem, 1.6vw, 1.75rem);
  }

  /* En desktop el wordmark del aside ya cumple, ocultamos el de la columna */
  .login__logo {
    display: none;
  }

  .login__main {
    padding: clamp(2rem, 4vw, 4rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .login__submit,
  .login__submit:hover {
    transition: none;
    transform: none;
  }
}
</style>
