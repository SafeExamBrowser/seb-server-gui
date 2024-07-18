import router from "@/router";

export function navigateTo(navPath: string){
    console.log("navigate to: " + navPath)
    router.push({
        path: navPath
    });
}

export function openUrlInNewTab(url: string){
    //@ts-ignore
    window.open("", "_blank").location.href = router.resolve(url).href;
}