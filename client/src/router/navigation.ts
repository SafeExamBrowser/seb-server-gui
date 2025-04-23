import router from "@/router/router";

export function navigateTo(navPath: string, query?: {}){
    router.push({
        path: navPath,
        query: query
    });
}

export function addQueryParam(query: {}){
    router.replace({
        query: query
    });

}

export function openUrlInNewTab(url: string){
    //@ts-ignore
    window.open("", "_blank").location.href = router.resolve(url).href;
}