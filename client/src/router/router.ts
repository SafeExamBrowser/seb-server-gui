import { createRouter, createWebHistory } from "vue-router";
import { routes as autoRoutes, handleHotUpdate } from "vue-router/auto-routes";
import { installGuards } from "./guards";

// `(app)` is alphabetically before `(public)`. Without this reorder,
// the auth layout can win the `/` matcher tie and cause a redirect loop.
const routes = [...autoRoutes].sort((a, b) => {
    if (a.name === "/(app)") return 1;
    if (b.name === "/(app)") return -1;
    return 0;
});

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

installGuards(router);

if (import.meta.hot) {
    handleHotUpdate(router);
}

export default router;
