import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("./views/Home.vue"),
  },
  {
    path: "/player/:tag",
    name: "Player",
    component: () => import("./views/Player.vue"),
  },
  {
    path: "/clan/:tag",
    name: "Clan",
    component: () => import("./views/Clan.vue"),
  },
  {
    path: "/cards",
    name: "Cards",
    component: () => import("./views/Cards.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("./views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
      };
    }
  },
});

createApp(App).use(router).mount("#app");
