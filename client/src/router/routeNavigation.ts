import type { RouteLocationAsRelative } from "vue-router";
import router from "@/router/router.ts";

export const typedTo = (to: RouteLocationAsRelative) => to;

export function openRouteInNewTab(to: RouteLocationAsRelative): void {
    if (typeof window === "undefined") return;
    window.open(router.resolve(to).href, "_blank");
}
