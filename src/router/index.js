import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AgendaView from "../views/AgendaView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/agenda", name: "agenda", component: AgendaView },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved;
    if (to.hash) {
      return { el: to.hash, behavior: "smooth" };
    }
    return { top: 0, left: 0 };
  },
});

export default router;
