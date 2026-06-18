import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { getJsonLdGraph, getSeoForRoute } from "./config/seo";
import { applySeo } from "./utils/applySeo";
import "./components/admin/admin.css";

const app = createApp(App).use(router);

router.isReady().then(() => {
  const routeName = router.currentRoute.value.name ?? "home";
  applySeo(getSeoForRoute(routeName), getJsonLdGraph(routeName));
  app.mount("#app");
});
