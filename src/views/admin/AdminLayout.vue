<template>
  <div class="admin">
    <div class="admin__bg" aria-hidden="true" />

    <!-- Top bar (solo mobile) -->
    <header class="admin__topbar">
      <div class="admin__brand admin__brand--top">
        <span class="admin__brand-mark">NS</span>
        <span class="admin__brand-text"><strong>Nacho Scoppa</strong></span>
      </div>
      <UiButton variant="ghost" size="sm" icon aria-label="Cerrar sesión" @click="onLogout">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
        </svg>
      </UiButton>
    </header>

    <aside class="admin__sidebar">
      <div class="admin__brand">
        <span class="admin__brand-mark">NS</span>
        <span class="admin__brand-text">
          <strong>Nacho Scoppa</strong>
          <small>Panel de administración</small>
        </span>
      </div>

      <nav class="admin__nav">
        <RouterLink
          v-for="item in nav"
          :key="item.name"
          :to="{ name: item.name }"
          class="admin__link"
        >
          <span class="admin__link-icon" v-html="item.icon" aria-hidden="true" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="admin__user">
        <span class="admin__avatar" aria-hidden="true">{{ initial }}</span>
        <span class="admin__user-email">{{ user?.email }}</span>
        <UiButton variant="ghost" size="sm" icon @click="onLogout" aria-label="Cerrar sesión">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
        </UiButton>
      </div>
    </aside>

    <main class="admin__main">
      <RouterView v-slot="{ Component }">
        <Transition name="admin-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <!-- Bottom nav (solo mobile) -->
    <nav class="admin__bottombar">
      <RouterLink
        v-for="item in nav"
        :key="item.name"
        :to="{ name: item.name }"
        class="admin__tab"
      >
        <span class="admin__tab-icon" v-html="item.icon" aria-hidden="true" />
        <span class="admin__tab-label">{{ item.short }}</span>
      </RouterLink>
    </nav>

    <ConfirmDialog />
    <Toaster theme="dark" position="top-right" rich-colors :offset="18" :gap="10" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import { useAuth } from "../../composables/useAuth";
import { confirm } from "../../composables/useConfirm";
import UiButton from "../../components/admin/ui/UiButton.vue";
import ConfirmDialog from "../../components/admin/ui/ConfirmDialog.vue";

const { user, logout } = useAuth();
const router = useRouter();

const initial = computed(() => (user.value?.email?.[0] || "?").toUpperCase());

const ic = (path) =>
  `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const nav = [
  { name: "admin-dashboard", label: "Dashboard", short: "Inicio", icon: ic('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>') },
  { name: "admin-featured", label: "Track destacado", short: "Destacado", icon: ic('<path d="M12 3l2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 16.9 6.8 19.3l1-5.9L3.5 9.2l5.9-.9z"/>') },
  { name: "admin-tracks", label: "Tracks", short: "Tracks", icon: ic('<circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><path d="M9 18V5l12-2v11"/>') },
  { name: "admin-labels", label: "Labels", short: "Labels", icon: ic('<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10z"/><circle cx="7.5" cy="7.5" r="1.5"/>') },
  { name: "admin-press", label: "Entrevistas", short: "Press", icon: ic('<path d="M4 5h16v11H8l-4 4z"/>') },
  { name: "admin-livesets", label: "Sets en vivo", short: "Sets", icon: ic('<rect x="3" y="3" width="18" height="14" rx="2"/><path d="M10 8l5 3-5 3z" fill="currentColor"/><path d="M8 21h8"/>') },
  { name: "admin-agenda", label: "Agenda", short: "Agenda", icon: ic('<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>') },
];

async function onLogout() {
  const ok = await confirm({
    title: "Cerrar sesión",
    message: "Vas a salir del panel de administración.",
    confirmLabel: "Cerrar sesión",
  });
  if (!ok) return;
  await logout();
  router.push({ name: "admin-login" });
}
</script>

<style scoped>
.admin {
  position: relative;
  display: grid;
  grid-template-columns: 16.5rem minmax(0, 1fr);
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--adm-bg);
  color: var(--adm-text);
}

.admin__bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: var(--adm-bg-grad);
  pointer-events: none;
}

/* Top bar & bottom bar: solo mobile */
.admin__topbar,
.admin__bottombar {
  display: none;
}

/* Sidebar */
.admin__sidebar {
  position: sticky;
  top: 0;
  z-index: 1;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem 1rem;
  background: var(--adm-sidebar);
  backdrop-filter: blur(24px) saturate(160%);
  border-right: 1px solid var(--adm-border);
}

.admin__brand {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.35rem 0.5rem;
}
.admin__brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 0.7rem;
  background: linear-gradient(145deg, #fff, #d4d4d8);
  color: #0a0a0a;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  box-shadow: var(--adm-shadow-sm);
}
.admin__brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  min-width: 0;
}
.admin__brand-text strong {
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.admin__brand-text small {
  font-size: 0.7rem;
  color: var(--adm-text-3);
}

.admin__nav {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  overflow-y: auto;
}

.admin__link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.7rem;
  border-radius: var(--adm-radius-sm);
  color: var(--adm-text-2);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.16s var(--adm-ease), color 0.16s var(--adm-ease);
}
.admin__link-icon {
  display: inline-flex;
  color: var(--adm-text-3);
  transition: color 0.16s var(--adm-ease);
}
.admin__link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--adm-text);
}
.admin__link:hover .admin__link-icon { color: var(--adm-text-2); }
.admin__link.router-link-active {
  background: rgba(255, 255, 255, 0.1);
  color: var(--adm-text);
  box-shadow: inset 0 0 0 1px var(--adm-hairline);
}
.admin__link.router-link-active .admin__link-icon {
  color: var(--adm-accent);
}

.admin__user {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem;
  border-radius: var(--adm-radius);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--adm-hairline);
}
.admin__avatar {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--adm-accent-soft);
  color: var(--adm-accent);
  font-size: 0.85rem;
  font-weight: 700;
}
.admin__user-email {
  flex: 1;
  min-width: 0;
  font-size: 0.75rem;
  color: var(--adm-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin__main {
  position: relative;
  z-index: 1;
  padding: 2.25rem clamp(1.25rem, 3vw, 3rem);
  overflow-x: hidden;
}

/* Route transition */
.admin-fade-enter-active,
.admin-fade-leave-active {
  transition: opacity 0.2s var(--adm-ease), transform 0.2s var(--adm-ease);
}
.admin-fade-enter-from { opacity: 0; transform: translateY(8px); }
.admin-fade-leave-to { opacity: 0; transform: translateY(-4px); }

@media (max-width: 820px) {
  .admin {
    grid-template-columns: 1fr;
  }

  /* Sidebar de desktop oculto */
  .admin__sidebar {
    display: none;
  }

  /* Top bar fija */
  .admin__topbar {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.65rem 1rem;
    padding-top: calc(0.65rem + env(safe-area-inset-top));
    background: var(--adm-sidebar);
    backdrop-filter: blur(24px) saturate(160%);
    border-bottom: 1px solid var(--adm-border);
  }
  .admin__brand--top { padding: 0; }
  .admin__brand--top .admin__brand-mark {
    width: 1.85rem;
    height: 1.85rem;
    border-radius: 0.6rem;
  }
  .admin__brand--top .admin__brand-text strong { font-size: 0.875rem; }

  .admin__main {
    padding: 1.25rem 1rem;
    padding-bottom: calc(5.5rem + env(safe-area-inset-bottom));
  }

  /* Bottom nav fija */
  .admin__bottombar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    display: flex;
    gap: 0.15rem;
    padding: 0.4rem 0.5rem;
    padding-bottom: calc(0.4rem + env(safe-area-inset-bottom));
    background: rgba(14, 14, 16, 0.82);
    backdrop-filter: blur(24px) saturate(160%);
    border-top: 1px solid var(--adm-border);
    overflow-x: auto;
    scrollbar-width: none;
  }
  .admin__bottombar::-webkit-scrollbar { display: none; }

  .admin__tab {
    flex: 1 1 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
    padding: 0.4rem 0.15rem;
    border-radius: var(--adm-radius-sm);
    text-decoration: none;
    color: var(--adm-text-3);
    transition: color 0.15s var(--adm-ease), background 0.15s var(--adm-ease);
  }
  .admin__tab-icon { display: inline-flex; }
  .admin__tab-label {
    max-width: 100%;
    font-size: 0.6rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .admin__tab.router-link-active {
    color: var(--adm-accent);
    background: var(--adm-accent-soft);
  }
}

@media (prefers-reduced-motion: reduce) {
  .admin-fade-enter-active,
  .admin-fade-leave-active { transition: none; }
}
</style>
