<template>
    <div>
        <v-data-table-server
            v-model="selectedIds"
            :headers="headersWithTestIds"
            :item-value="itemKey"
            :items="items"
            :items-length="internalItemsLength"
            :page="currentPage"
            :items-per-page="requestedItemsPerPage"
            :items-per-page-options="itemsPerPageOptions"
            :item-selectable="isItemSelectable"
            :sort-by="sortByForTable"
            :loading="loading"
            :loading-text="$t('general.loading')"
            :no-data-text="$t('general.noData')"
            hover
            hide-default-footer
            :data-testid="`${dataTestId}-table`"
            :show-select="!!selection"
            :select-strategy="selection ? 'page' : undefined"
            @update:options="emit('update:options', $event)"
        >
            <!-- Render a skeleton the height of a full page of rows so the
            table keeps its size during the initial load instead of collapsing
            to a thin bar. Vuetify only shows this slot while loading with no
            rows yet; paging over existing rows keeps the inline progress bar. -->
            <template #loading>
                <v-skeleton-loader :type="loadingSkeletonType" />
            </template>

            <template
                #item="{ item, isSelected, toggleSelect, index, internalItem }"
            >
                <tr
                    :class="{
                        'v-data-table__tr--clickable': isRowClickable(
                            getRawItem(item),
                        ),
                        'bg-blue-lighten-5': isRowActive(getRawItem(item)),
                    }"
                    :tabindex="singleSelect ? 0 : undefined"
                    :data-testid="rowTestId(getRawItem(item), index)"
                    @click="handleRowClick(getRawItem(item))"
                    @keyup.enter="handleRowClick(getRawItem(item))"
                >
                    <td v-if="props.selection">
                        <v-checkbox-btn
                            v-if="!(props.selection.disabled?.(item) ?? true)"
                            :model-value="isSelected(internalItem)"
                            density="compact"
                            @update:model-value="toggleSelect(internalItem)"
                        >
                        </v-checkbox-btn>
                    </td>

                    <td
                        v-for="header in computedHeaders"
                        :key="header.key"
                        :data-testid="`${rowTestId(getRawItem(item), index)}-cell-${header.key}`"
                        :class="
                            header.align &&
                            `v-data-table-column--align-${header.align}`
                        "
                    >
                        <template v-if="header.key === ACTIONS_COLUMN_KEY">
                            <TableRowActions
                                :item="getRawItem(item)"
                                :actions="actions ?? []"
                                :data-test-id="
                                    rowTestId(getRawItem(item), index)
                                "
                            />
                        </template>

                        <template v-else>
                            <div
                                class="d-flex align-center"
                                :class="[
                                    `justify-${header.align || 'start'}`,
                                    header.align === 'end' && 'text-end',
                                ]"
                            >
                                <slot
                                    :name="`cell-${header.key}`"
                                    :item="getRawItem(item)"
                                    :value="getRawItem(item)[header.key]"
                                    :formatted-value="
                                        formatCell(header.key, getRawItem(item))
                                    "
                                    :header="header"
                                    :row-test-id="
                                        rowTestId(getRawItem(item), index)
                                    "
                                    :cell-test-id="`${rowTestId(getRawItem(item), index)}-cell-${header.key}`"
                                >
                                    {{
                                        formatCell(header.key, getRawItem(item))
                                    }}
                                </slot>
                            </div>
                        </template>
                    </td>
                </tr>
            </template>

            <template #bottom>
                <TableFooter
                    :page="currentPage"
                    :items-per-page="currentItemsPerPage"
                    :page-count="resolvedPageCount"
                    :items-per-page-options="itemsPerPageOptions"
                    :data-test-id="dataTestId"
                    @update:page="onPageUpdate"
                    @update:items-per-page="onItemsPerPageUpdate"
                />
            </template>
        </v-data-table-server>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { type RouteLocationAsRelative, useRouter } from "vue-router";

import TableFooter from "@/components/widgets/entity-table/components/TableFooter.vue";
import TableRowActions from "@/components/widgets/entity-table/components/TableRowActions.vue";
import {
    ACTIONS_COLUMN_KEY,
    useTableHeaders,
} from "@/components/widgets/entity-table/composables/useTableHeaders.ts";
import { useTableItems } from "@/components/widgets/entity-table/composables/useTableItems.ts";
import { useTablePagination } from "@/components/widgets/entity-table/composables/useTablePagination.ts";
import type {
    CellFormatter,
    TableAction,
    TableHeader,
    TableItem,
    TableRowSelect,
    TableSingleSelect,
} from "@/components/widgets/entity-table/types.ts";
import type { ServerTablePaging } from "@/models/types.ts";

const props = withDefaults(
    defineProps<{
        headers: TableHeader[];
        items: TableItem[];
        loading: boolean;
        dataTestId: string;
        options?: ServerTablePaging;
        itemsPerPage?: number;
        pageCount?: number;
        itemsLength?: number;
        // TODO @andrei: prefer undefined over null here (legacy overviews still return null)
        detailRoute?: (
            item: TableItem,
        ) => RouteLocationAsRelative | null | undefined;
        actions?: TableAction[];
        selection?: TableRowSelect;
        singleSelect?: TableSingleSelect;
        cellFormatters?: Record<string, CellFormatter>;
        itemKey?: string;
    }>(),
    {
        pageCount: 0,
        itemsPerPage: 10,
        itemsLength: undefined,
        options: undefined,
        detailRoute: undefined,
        actions: undefined,
        cellFormatters: () => ({}),
        itemKey: "id",
        selection: undefined,
        singleSelect: undefined,
    },
);

const selectedIds = props.selection?.selectionModel;

const emit = defineEmits<{
    "update:options": [options: ServerTablePaging];
    "click:row": [item: TableItem];
}>();

const router = useRouter();

const { computedHeaders } = useTableHeaders(
    () => props.headers,
    () => !!props.actions?.length,
);

const headersWithTestIds = computed<TableHeader[]>(() =>
    computedHeaders.value.map((header) =>
        header.key === ACTIONS_COLUMN_KEY
            ? header
            : {
                  ...header,
                  headerProps: {
                      ...header.headerProps,
                      "data-testid": `${props.dataTestId}-header-${header.key}`,
                  },
              },
    ),
);

const { getRawItem, formatCell } = useTableItems(() => props.cellFormatters);

const {
    currentPage,
    currentItemsPerPage,
    requestedItemsPerPage,
    resolvedPageCount,
    itemsPerPageOptions,
    internalItemsLength,
    sortByForTable,
    onPageUpdate,
    onItemsPerPageUpdate,
} = useTablePagination({
    options: () => props.options,
    itemsPerPage: () => props.itemsPerPage,
    pageCount: () => props.pageCount,
    items: () => props.items,
    itemsLength: () => props.itemsLength,
    emit: (options) => emit("update:options", options),
});

// One skeleton row per requested page item, so the placeholder matches the
// height of the loaded table and there is no layout shift when data arrives.
const loadingSkeletonType = computed(
    () => `table-row@${requestedItemsPerPage.value}`,
);

function rowTestId(item: TableItem, index: number): string {
    const id = item[props.itemKey];
    const suffix = id == null || id === "" ? `index-${index}` : String(id);
    return `${props.dataTestId}-row-${suffix}`;
}

function isItemSelectable(item: TableItem): boolean {
    if (!props.selection) {
        return false;
    }

    return !(props.selection.disabled?.(item) ?? true);
}

// A row is clickable when it has a navigation target (detailRoute) or when the
// table is in single-select mode, so rows without a destination (e.g.
// non-editable accounts) don't get the pointer cursor or trigger navigation.
function isRowClickable(item: TableItem): boolean {
    if (props.singleSelect) {
        return true;
    }

    return !!props.detailRoute?.(item);
}

// In single-select mode, highlight the row whose itemKey matches the currently
// selected value.
function isRowActive(item: TableItem): boolean {
    return (
        props.singleSelect?.activeKey !== undefined &&
        item[props.itemKey] === props.singleSelect.activeKey
    );
}

function handleRowClick(item: TableItem) {
    if (props.singleSelect) {
        emit("click:row", item);
        return;
    }

    void navigateToItem(item);
}

async function navigateToItem(item: TableItem) {
    if (!props.detailRoute) return;
    const target = props.detailRoute(item);
    if (!target) {
        // TODO @andrei implement error handling
        return;
    }
    await router.push(target);
}
</script>
