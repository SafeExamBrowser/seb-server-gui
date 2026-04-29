import { computed } from "vue";
import { useRouter } from "vue-router";
import type { RouteLocationAsRelative } from "vue-router";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";

export function useTableNavigation(
    detailRoute?: RouteLocationAsRelative,
    itemIdentifierKey?: string,
) {
    const router = useRouter();
    const identifierKey = computed(() => itemIdentifierKey ?? "uuid");

    function getItemIdentifier(item: TableItem): string | null {
        const identifier = item[identifierKey.value];

        if (identifier === undefined || identifier === null) {
            return null;
        }

        return String(identifier);
    }

    function navigateToItem(item: TableItem) {
        if (!detailRoute) return;

        const identifier = getItemIdentifier(item);
        if (!identifier) return;

        const routeName =
            typeof detailRoute.name === "string" ? detailRoute.name : null;

        const paramKey = routeName?.match(/\[([^\]/]+)\]/)?.[1];

        if (!routeName || !paramKey) {
            void router.push(detailRoute);
            return;
        }

        void router.push({
            name: routeName,
            params: {
                [paramKey]: identifier,
            },
            query: detailRoute.query,
            hash: detailRoute.hash,
            replace: detailRoute.replace,
            force: detailRoute.force,
            state: detailRoute.state,
        } as RouteLocationAsRelative);
    }

    return {
        identifierKey,
        navigateToItem,
    };
}
