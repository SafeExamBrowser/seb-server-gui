import { VueQueryPlugin } from "@tanstack/vue-query";
import type { App } from "vue";

import router from "@/router/router";
import { queryClient } from "@/services/http/queryClient";
import pinia from "@/stores";

export function registerPlugins(app: App) {
    app.use(pinia).use(router).use(VueQueryPlugin, { queryClient });
}
