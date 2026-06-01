<template>
    <v-data-table-server
        :headers="computedHeaders"
        :items="items"
        :items-length="internalItemsLength"
        :page="currentPage"
        :items-per-page="requestedItemsPerPage"
        :items-per-page-options="itemsPerPageOptions"
        :sort-by="sortByForTable"
        :loading="loading"
        :loading-text="$t('general.loading')"
        :no-data-text="$t('general.noData')"
        hover
        hide-default-footer
        :data-testid="`${dataTestId}-table`"
        @update:options="emit('update:options', $event)"
    >
        <template #item="{ item, index }">
            <tr
                :class="{ 'v-data-table__tr--clickable': !!detailRoute }"
                :data-testid="rowTestId(getRawItem(item), index)"
                @click="navigateToItem(getRawItem(item))"
            >
                <td
                    v-for="header in computedHeaders"
                    :key="header.key"
                    :data-testid="`${rowTestId(getRawItem(item), index)}-cell-${header.key}`"
                    :class="
                        header.align &&
                        `v-data-table-column--align-${header.align}`
                    "
                >
                    <template v-if="header.key === '_actions'">
                        <TableRowActions
                            :item="getRawItem(item)"
                            :actions="actions ?? []"
                            :data-test-id="rowTestId(getRawItem(item), index)"
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
                                {{ formatCell(header.key, getRawItem(item)) }}
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
</template>

<script setup lang="ts">
import type {
    TableHeader,
    TableItem,
    TableAction,
    CellFormatter,
} from "@/components/widgets/entity-table/types.ts";
import { useTableHeaders } from "@/components/widgets/entity-table/composables/useTableHeaders.ts";
import { useTableItems } from "@/components/widgets/entity-table/composables/useTableItems.ts";
import { useTablePagination } from "@/components/widgets/entity-table/composables/useTablePagination.ts";
import TableRowActions from "@/components/widgets/entity-table/components/TableRowActions.vue";
import TableFooter from "@/components/widgets/entity-table/components/TableFooter.vue";
import type { ServerTablePaging } from "@/models/types.ts";
import { useRouter, type RouteLocationAsRelative } from "vue-router";

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
        detailRoute?: (item: TableItem) => RouteLocationAsRelative | undefined;
        actions?: TableAction[];
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
    },
);

const emit = defineEmits<{
    "update:options": [options: ServerTablePaging];
}>();

const router = useRouter();

const { computedHeaders } = useTableHeaders(
    () => props.headers,
    () => !!props.actions?.length,
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

function rowTestId(item: TableItem, index: number): string {
    const id = item[props.itemKey];
    const suffix = id == null || id === "" ? `index-${index}` : String(id);
    return `${props.dataTestId}-row-${suffix}`;
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
