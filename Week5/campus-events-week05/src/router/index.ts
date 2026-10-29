import { createRouter, createWebHistory, type RouterHistory } from "vue-router";
import { getActivePinia } from "pinia";
import { useSessionStore } from "../stores/session";

declare module "vue-router" {
  interface RouteMeta {
    organiserOnly?: boolean;
  }
}

export const routes = [
  {
    path: "/",
    redirect: "/events",
  },
  {
    path: "/events",
    name: "events",
    component: () => import("../pages/EventsPage.vue"),
  },
  {
    path: "/events/new",
    name: "event-new",
    component: () => import("../pages/NewEventPage.vue"),
    meta: { organiserOnly: true },
  },
  {
    path: "/events/:id(\\d+)",
    name: "event-detail",
    component: () => import("../pages/EventDetailPage.vue"),
    props: true,
  },
  {
    path: "/my-bookings",
    name: "my-bookings",
    component: () => import("../pages/MyBookingsPage.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("../pages/NotFoundPage.vue"),
  },
];

export function makeRouter(history: RouterHistory = createWebHistory()) {
  const router = createRouter({ history, routes });

  router.beforeEach((to) => {
    
    if (!getActivePinia()) return;

    const sessionStore = useSessionStore();

    if (to.meta.organiserOnly && !sessionStore.isOrganiser) {
      return { name: "events", query: { denied: "1" } };
    }
  });

  return router;
}

export default makeRouter();