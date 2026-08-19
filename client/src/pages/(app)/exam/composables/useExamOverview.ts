import { reactive } from "vue";
import { type RouteLocationAsRelative, useRouter } from "vue-router";

import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useExcludeFromDeletionAction } from "@/pages/(app)/exam/composables/useExcludeFromDeletionAction.ts";
import { GUIAction, useAbilities } from "@/services/ability.ts";
import { translate } from "@/utils/generalUtils.ts";

import { useExamList } from "./useExamList.ts";
import { useExamTableActions } from "./useExamTableActions.ts";
import { useExamTableHeaders } from "./useExamTableHeaders.ts";

export const useExamOverview = () => {
    const router = useRouter();

    const examDetailRoute = (
        item: TableItem,
    ): RouteLocationAsRelative | null =>
        item.id != null
            ? {
                  name: "/(app)/exam/[id]/",
                  params: { id: String(item.id) },
              }
            : null;

    const { headers, cellFormatters } = useExamTableHeaders();

    // add "Exclude from Deletion" header only for Institutional Admins
    const abilities = useAbilities();
    if (abilities.canDo(GUIAction.EXCLUDE_FROM_DELETION)) {
        headers.value.push({
            title: translate(
                `examDetail.sidePanel.actions.excludedFromDeletion`,
            ),
            key: "excludeFromDeletion",
            width: "8%",
            sortable: false,
            align: "center",
        });
    }

    const list = useExamList();

    const excludeFromDeletion = useExcludeFromDeletionAction();
    const toggleExcludeFromDeletion = async (item: TableItem) => {
        await excludeFromDeletion.toggleExcludeFromDeletion(item);
        list.reloadList();
    };

    const actions = useExamTableActions({
        onNavigate: (item) => {
            const target = examDetailRoute(item);
            if (!target) {
                // TODO @andrei implement error handling
                return;
            }
            void router.push(target);
        },
    });

    return {
        list: reactive({
            items: list.items,
            pageCount: list.pageCount,
            errors: list.errors,
            options: list.options,
            headers,
            cellFormatters,
            loading: list.loading,
            detailRoute: examDetailRoute,
            actions,
            searchInputValue: list.searchInputValue,
            searchField: list.searchField,
            selectedFilters: list.selectedFilters,
            filterSections: list.filterSections,
            dateValue: list.dateValue,
            onSearch: list.onSearch,
            onClearSearch: list.onClearSearch,
            setFilters: list.setFilters,
            setDate: list.setDate,
            clearAll: list.clearAll,
            loadItems: list.loadItems,
            toggleExcludeFromDeletion,
        }),
    };
};
