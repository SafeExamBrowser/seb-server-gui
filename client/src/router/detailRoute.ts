import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import type { RouteLocationAsRelative } from "vue-router";
import { useRouter } from "vue-router";

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
