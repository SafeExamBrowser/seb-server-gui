import { createRouter, createWebHistory } from "vue-router";
import { handleHotUpdate, routes as autoRoutes } from "vue-router/auto-routes";

import { installGuards } from "./guards";

export const router = createRouter({
    history: createWebHistory(),
    routes: autoRoutes,
});

installGuards(router);

if (import.meta.hot) {
    handleHotUpdate(router);
}

export default router;
