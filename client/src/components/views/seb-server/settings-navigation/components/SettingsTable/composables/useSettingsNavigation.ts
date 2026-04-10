import { computed } from "vue";
import { useRouter } from "vue-router";
import { navigateToRoute } from "@/router/navigation";
import type { RouteName } from "@/router/routeNames";
import type { TableItem } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/types.ts";

export function useSettingsNavigation(
    detailRoute?: RouteName,
    itemIdentifierKey?: string,
    routeParamKey?: string,
) {
    const router = useRouter();
    const identifierKey = computed(() => itemIdentifierKey ?? "uuid");
    const paramKey = computed(
        () => routeParamKey ?? itemIdentifierKey ?? "uuid",
    );

    function getItemIdentifier(item: TableItem): string | null {
        const identifier = item[identifierKey.value];

        if (identifier === undefined || identifier === null) {
            return null;
        }

        return String(identifier);
    }

    function buildItemRoute(item: TableItem): string {
        if (!detailRoute) return "";

        const identifier = getItemIdentifier(item);
        if (!identifier) return "";

        return router.resolve({
            name: detailRoute,
            params: { [paramKey.value]: identifier },
        }).path;
    }

    function navigateToItem(item: TableItem) {
        if (!detailRoute) return;

        const identifier = getItemIdentifier(item);
        if (!identifier) return;

        navigateToRoute({
            name: detailRoute,
            params: { [paramKey.value]: identifier },
        });
    }

    return {
        identifierKey,
        getItemIdentifier,
        buildItemRoute,
        navigateToItem,
    };
}
