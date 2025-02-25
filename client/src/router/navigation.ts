import router from "@/router/router";

export function navigateTo(navPath: string){
    router.push({
        path: navPath
    });
}

export function openUrlInNewTab(url: string){
    //@ts-ignore
    window.open("", "_blank").location.href = router.resolve(url).href;
}