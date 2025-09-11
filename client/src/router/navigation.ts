import router from "@/router/router";

export function navigateTo(navPath: string, query?: {}) {
    router.push({
        path: navPath,
        query,
    });
}

export function addQueryParam(query: {}) {
    router.push({
        query,
    });
}

export function openUrlInNewTab(url: string) {
    // @ts-ignore
    window.open("", "_blank").location.href = router.resolve(url).href;
}

export function openUrlInNewTabApplicationView(url: string) {
    window.open(url, "_blank");
}
