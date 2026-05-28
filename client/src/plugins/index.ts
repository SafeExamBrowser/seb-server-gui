import pinia from "@/stores";
import router from "@/router/router";
import type { App } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { queryClient } from "@/services/http/queryClient";

export function registerPlugins(app: App) {
    app.use(pinia).use(router).use(VueQueryPlugin, { queryClient });
}
