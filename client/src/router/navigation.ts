import router from "@/router/router";
import type { RouteName } from "@/router/routeNames";
import type { LocationQueryRaw, RouteLocationNamedRaw } from "vue-router";

export function navigateTo(navPath: string, query?: LocationQueryRaw) {
    router.push({
        path: navPath,
        query,
    });
}

export function addQueryParam(query: LocationQueryRaw) {
    router.push({
        query,
    });
}

export const navigateToRoute = (
    to: Omit<RouteLocationNamedRaw, "name"> & { name: RouteName },
) => {
    router.push(to);
};

export const resolveRoutePath = (name: RouteName): string =>
    router.resolve({ name }).path;

export function openUrlInNewTab(url: string) {
    // @ts-ignore ignore
    window.open("", "_blank").location.href = router.resolve(url).href;
}
