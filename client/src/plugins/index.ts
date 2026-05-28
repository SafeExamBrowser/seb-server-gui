import pinia from "@/stores";
import router from "@/router/router";
import type { App } from "vue";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

const queryClient = new QueryClient();

export function registerPlugins(app: App) {
    app.use(pinia).use(router).use(VueQueryPlugin, { queryClient });
}
