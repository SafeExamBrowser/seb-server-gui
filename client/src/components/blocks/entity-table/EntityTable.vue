<template>
    <v-data-table-server
        :headers="computedHeaders"
        :items="items"
        :items-length="internalItemsLength"
        :items-per-page="itemsPerPage"
        :items-per-page-options="itemsPerPageOptions"
        :loading="loading"
        :loading-text="$t('general.loading')"
        :no-data-text="$t('general.noData')"
        hover
        hide-default-footer
        @update:options="emit('update:options', $event)"
    >
        <template #item="{ item }">
            <tr
                :class="{ 'v-data-table__tr--clickable': !!detailRoute }"
                @click="onRowClick(getRawItem(item))"
            >
                <td
                    v-for="header in computedHeaders"
                    :key="header.key"
                    :class="
                        header.align &&
                        `v-data-table-column--align-${header.align}`
                    "
                >
                    <template v-if="header.key === '_actions'">
                        <div class="d-flex justify-center align-center ga-1">
                            <v-hover
                                v-for="action in visibleActions(
                                    getRawItem(item),
                                )"
                                :key="action.key"
                                v-slot="{ isHovering, props: hoverProps }"
                            >
                                <v-btn
                                    v-bind="hoverProps"
                                    :icon="action.icon"
                                    :disabled="
                                        action.disabled?.(getRawItem(item)) ??
                                        false
                                    "
                                    :aria-label="
                                        action.labelKey
                                            ? $t(action.labelKey)
                                            : undefined
                                    "
                                    variant="text"
                                    density="comfortable"
                                    size="small"
                                    rounded="lg"
                                    class="text-medium-emphasis"
                                    :color="
                                        isHovering
                                            ? (action.color ?? 'primary')
                                            : undefined
                                    "
                                    @click.stop="
                                        action.onClick(getRawItem(item))
                                    "
                                />
                            </v-hover>
                        </div>
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
                            >
                                {{ formatCell(header.key, getRawItem(item)) }}
                            </slot>
                        </div>
                    </template>
                </td>
            </tr>
        </template>

        <template #bottom>
            <div class="pt-4">
                <v-divider />

                <v-row no-gutters class="px-5 pt-4 pb-3 align-center">
                    <v-col cols="12" md="4" class="d-none d-md-block" />

                    <v-col cols="12" md="4" class="d-flex justify-center">
                        <v-pagination
                            v-model="currentPage"
                            :length="pageCount"
                            :total-visible="10"
                            active-color="primary"
                            density="comfortable"
                            rounded="lg"
                            variant="text"
                            prev-icon="mdi-chevron-left"
                            next-icon="mdi-chevron-right"
                            class="text-medium-emphasis"
                        />
                    </v-col>

                    <v-col
                        cols="12"
                        md="4"
                        class="d-flex justify-center justify-md-end"
                    >
                        <div
                            class="d-flex flex-wrap align-center justify-center justify-md-end ga-3"
                        >
                            <span
                                class="text-body-2 text-medium-emphasis font-weight-medium text-no-wrap"
                            >
                                {{ translate("general.itemsPerPage") }}
                            </span>

                            <v-select
                                v-model="localItemsPerPage"
                                :items="itemsPerPageOptions"
                                base-color="primary"
                                color="primary"
                                max-width="90"
                                min-width="90"
                                variant="outlined"
                                density="compact"
                                rounded="lg"
                                hide-details
                                class="text-body-2 font-weight-semibold"
                            />
                        </div>
                    </v-col>
                </v-row>
            </div>
        </template>
    </v-data-table-server>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type {
    TableHeader,
    TableItem,
    TableAction,
    CellFormatter,
} from "@/components/blocks/entity-table/types.ts";
import { useTableNavigation } from "@/components/blocks/entity-table/composables/useTableNavigation.ts";
import type { ServerTablePaging } from "@/models/types.ts";
import type { RouteName } from "@/router/routeNames.ts";
import { translate } from "@/utils/generalUtils.ts";

const props = withDefaults(
    defineProps<{
        headers: TableHeader[];
        items: TableItem[];
        loading: boolean;
        options?: ServerTablePaging;
        itemsPerPage?: number;
        pageCount?: number;
        itemsLength?: number;
        detailRoute?: RouteName;
        routeParamKey?: string;
        itemIdentifierKey?: string;
        actions?: TableAction[];
        cellFormatters?: Record<string, CellFormatter>;
    }>(),
    {
        pageCount: 0,
        itemsPerPage: 10,
        itemsLength: undefined,
        options: undefined,
        detailRoute: undefined,
        routeParamKey: undefined,
        itemIdentifierKey: "",
        actions: undefined,
        cellFormatters: () => ({}),
    },
);

const emit = defineEmits<{
    "update:options": [options: ServerTablePaging];
}>();

const { navigateToItem } = useTableNavigation(
    props.detailRoute,
    props.itemIdentifierKey,
    props.routeParamKey,
);

const computedHeaders = computed(() => {
    const base = [...props.headers];
    if (props.actions?.length) {
        base.push({
            title: "",
            key: "_actions",
            sortable: false,
            width: "1%",
            align: "center",
        });
    }
    return base;
});

function getRawItem(item: unknown): TableItem {
    if (
        item &&
        typeof item === "object" &&
        "raw" in item &&
        item.raw &&
        typeof item.raw === "object"
    ) {
        return item.raw as TableItem;
    }
    return item as TableItem;
}

function formatCell(key: string, item: TableItem): string {
    const formatter = props.cellFormatters?.[key];
    if (formatter) return formatter(item[key], item);
    const value = item[key];
    if (value === null || value === undefined) return "";
    return String(value);
}

function visibleActions(item: TableItem): TableAction[] {
    if (!props.actions) return [];
    return props.actions.filter((a) => a.visible?.(item) ?? true);
}

function onRowClick(item: TableItem) {
    if (!props.detailRoute) return;
    navigateToItem(item);
}

const itemsPerPageOptions = computed(() => {
    const opts = [5];
    if (props.pageCount > 1 || props.items.length > 5) opts.push(10);
    if (props.pageCount > 2 || props.items.length > 10) opts.push(15);
    return opts;
});

const currentPage = computed({
    get: () => props.options?.page ?? 1,
    set: (page: number) => {
        emit("update:options", {
            page,
            itemsPerPage: props.options?.itemsPerPage ?? props.itemsPerPage,
            sortBy: props.options?.sortBy ?? [],
        });
    },
});

const localItemsPerPage = computed({
    get: () => props.options?.itemsPerPage ?? props.itemsPerPage,
    set: (itemsPerPage: number) => {
        emit("update:options", {
            page: 1,
            itemsPerPage,
            sortBy: props.options?.sortBy ?? [],
        });
    },
});

const internalItemsLength = computed(() => {
    if (props.itemsLength !== undefined) return props.itemsLength;

    const page = props.options?.page ?? 1;
    const perPage = props.options?.itemsPerPage ?? props.itemsPerPage;

    if (props.pageCount === 0) return props.items.length;
    if (page === props.pageCount) {
        return (props.pageCount - 1) * perPage + props.items.length;
    }
    return props.pageCount * perPage;
});
</script>
