import vuetify from "./vuetify";
import pinia from "../stores";
import router from "../router/router";
import type { App } from "vue";
import * as apiService from "@/services/apiService";

export function registerPlugins(app: App) {
    app.use(vuetify).use(router).use(pinia);

    apiService.createApi();
    apiService.createApiInterceptor();
}
