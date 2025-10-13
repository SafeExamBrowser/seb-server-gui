import pinia from "../stores";
import router from "../router/router";
import type { App } from "vue";
import * as apiService from "@/services/apiService";

export function registerPlugins(app: App) {
    app.use(pinia).use(router);

    apiService.createApi();
    apiService.createApiInterceptor();
}
