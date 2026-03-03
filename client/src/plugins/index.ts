import pinia from "../stores";
import router from "../router/router";
import type { App } from "vue";

export function registerPlugins(app: App) {
    app.use(pinia).use(router);
}
