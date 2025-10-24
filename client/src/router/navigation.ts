import router from "@/router/router";
import { LocationQueryRaw } from "vue-router";

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

export function openUrlInNewTab(url: string) {
    // @ts-ignore ignore
    window.open("", "_blank").location.href = router.resolve(url).href;
}

export function openUrlInNewTabApplicationView(url: string) {
    window.open(url, "_blank");
}
