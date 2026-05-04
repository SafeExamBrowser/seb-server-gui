import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import router from "@/router/router.ts";
import type { RouteLocationAsRelative } from "vue-router";
import { useRouter } from "vue-router";

export const typedTo = (to: RouteLocationAsRelative) => to;

export async function navigateTo(to: RouteLocationAsRelative): Promise<void> {
    await router.push(to);
}

export function openRouteInNewTab(to: RouteLocationAsRelative): void {
    if (typeof window === "undefined") {
        return;
    }

    window.open(router.resolve(to).href, "_blank");
}

export function openProctoringView(
    sessionId: string,
    timestamp?: string,
): void {
    const searchTimestamp = timestamp?.trim();
    openRouteInNewTab({
        name: "/(app)/sp-recording/[sessionId]/",
        params: {
            sessionId,
        },
        query: searchTimestamp
            ? {
                  searchTimestamp,
              }
            : undefined,
    } satisfies RouteLocationAsRelative<"/(app)/sp-recording/[sessionId]/">);
}

export function openProctoringApplicationSearch(
    sessionId: string,
    metadataApp: string,
    metadataWindow: string,
): void {
    openRouteInNewTab({
        name: "/(app)/sp-recording/application-search/[sessionId]/",
        params: {
            sessionId,
        },
        query: {
            ...(metadataApp ? { metadataApp } : {}),
            ...(metadataWindow ? { metadataWindow } : {}),
        },
    } satisfies RouteLocationAsRelative<"/(app)/sp-recording/application-search/[sessionId]/">);
}
//TODO REFACTOR-ROUTER @Rad14nt Let's aim to export only one hook / helper per file. This makes it a lot easier to find our things.
export function buildDetailRoute(
    detailRoute: RouteLocationAsRelative,
    item: TableItem,
    itemIdentifierKey = "uuid",
): RouteLocationAsRelative | null {
    const identifier = item[itemIdentifierKey];

    if (identifier == null) {
        return null;
    }

    const routeName =
        typeof detailRoute.name === "string" ? detailRoute.name : null;
    const paramKey = routeName?.match(/\[([^\]/]+)\]/)?.[1];

    if (!routeName || !paramKey) {
        return detailRoute;
    }

    return {
        name: routeName,
        params: {
            [paramKey]: String(identifier),
        },
        query: detailRoute.query,
        hash: detailRoute.hash,
        replace: detailRoute.replace,
        force: detailRoute.force,
        state: detailRoute.state,
    } as RouteLocationAsRelative;
}

export function useDetailRouteNavigation() {
    const router = useRouter();

    async function pushDetailRoute(
        detailRoute: RouteLocationAsRelative,
        item: TableItem,
        itemIdentifierKey = "uuid",
    ): Promise<void> {
        const target = buildDetailRoute(detailRoute, item, itemIdentifierKey);

        if (!target) {
            return;
        }

        await router.push(target);
    }

    return {
        pushDetailRoute,
    };
}
