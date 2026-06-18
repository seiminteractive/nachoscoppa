import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AgendaView from "../views/AgendaView.vue";
import { getJsonLdGraph, getSeoForRoute } from "../config/seo";
import { applySeo } from "../utils/applySeo";
import { auth, isAdminEmail } from "../lib/firebase";

const AdminLayout = () => import("../views/admin/AdminLayout.vue");
const AdminLogin = () => import("../views/admin/AdminLogin.vue");
const AdminDashboard = () => import("../views/admin/AdminDashboard.vue");
const AdminTracks = () => import("../views/admin/AdminTracks.vue");
const AdminFeatured = () => import("../views/admin/AdminFeatured.vue");
const AdminLabels = () => import("../views/admin/AdminLabels.vue");
const AdminPress = () => import("../views/admin/AdminPress.vue");
const AdminLiveSets = () => import("../views/admin/AdminLiveSets.vue");
const AdminAgenda = () => import("../views/admin/AdminAgenda.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/agenda", name: "agenda", component: AgendaView },
    { path: "/admin/login", name: "admin-login", component: AdminLogin, meta: { admin: true } },
    {
      path: "/admin",
      component: AdminLayout,
      meta: { admin: true, requiresAuth: true },
      children: [
        { path: "", name: "admin", redirect: { name: "admin-dashboard" } },
        { path: "dashboard", name: "admin-dashboard", component: AdminDashboard },
        { path: "tracks", name: "admin-tracks", component: AdminTracks },
        { path: "featured", name: "admin-featured", component: AdminFeatured },
        { path: "labels", name: "admin-labels", component: AdminLabels },
        { path: "press", name: "admin-press", component: AdminPress },
        { path: "livesets", name: "admin-livesets", component: AdminLiveSets },
        { path: "agenda", name: "admin-agenda", component: AdminAgenda },
        { path: "stats", redirect: { name: "admin-dashboard" } },
      ],
    },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved;
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    }
    return { top: 0, left: 0 };
  },
});

function waitForAuth() {
  return new Promise((resolve) => {
    const unsub = auth.onAuthStateChanged((u) => {
      unsub();
      resolve(u);
    });
  });
}

router.beforeEach(async (to) => {
  if (!to.meta?.requiresAuth) return true;
  const user = auth.currentUser ?? (await waitForAuth());
  if (!user || !isAdminEmail(user.email)) {
    return { name: "admin-login", query: { next: to.fullPath } };
  }
  return true;
});

function syncSeo(route) {
  if (route.meta?.admin) {
    document.title = "Admin — Nacho Scoppa";
    return;
  }
  const routeName = route.name ?? "home";
  applySeo(getSeoForRoute(routeName), getJsonLdGraph(routeName));
}

router.afterEach((to) => {
  syncSeo(to);
});

export default router;
