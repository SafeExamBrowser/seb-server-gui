import { computed } from "vue";
import { navigateTo } from "@/router/navigation";

type TableItem = Record<string, unknown>;

export function useSettingsNavigation(
    route?: string,
    itemIdentifierKey?: string,
) {
    const identifierKey = computed(() => itemIdentifierKey ?? "uuid");

    function getItemIdentifier(item: TableItem): string | null {
        const identifier = item[identifierKey.value];

        if (identifier === undefined || identifier === null) {
            return null;
        }

        return String(identifier);
    }

    function buildItemRoute(item: TableItem): string {
        if (!route) return "";

        const identifier = getItemIdentifier(item);
        if (!identifier) return "";

        return `${route}/${identifier}`;
    }

    function navigateToItem(item: TableItem) {
        const targetRoute = buildItemRoute(item);

        if (!targetRoute) return;
        navigateTo(targetRoute);
    }

    return {
        identifierKey,
        getItemIdentifier,
        buildItemRoute,
        navigateToItem,
    };
}
