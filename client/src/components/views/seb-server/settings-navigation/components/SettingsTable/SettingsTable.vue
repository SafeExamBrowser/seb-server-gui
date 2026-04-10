<template>
    <div>
        <v-data-table-server
            :headers="headers"
            :items="items"
            :items-length="internalItemsLength"
            :items-per-page="itemsPerPage"
            :items-per-page-options="itemsPerPageOptions"
            :loading="loading"
            :loading-text="$t('general.loading')"
            :no-data-text="$t('general.noData')"
            hide-default-footer
            @update:options="emit('update:options', $event)"
        >
            <template #item="{ item }">
                <tr
                    :class="{ 'table-row--clickable': editable }"
                    @click="onRowClick(getRawItem(item))"
                >
                    <td v-for="header in headers" :key="header.key">
                        <template v-if="header.key === 'active'">
                            <v-chip
                                class="text-white font-weight-medium status-chip cursor-pointer"
                                :color="
                                    getRawItem(item).active ? 'green' : 'red'
                                "
                                size="small"
                                @click.stop="openStatusDialog(getRawItem(item))"
                            >
                                {{
                                    getRawItem(item).active
                                        ? "Active"
                                        : "Inactive"
                                }}
                            </v-chip>
                        </template>

                        <template v-else-if="header.key === 'actions'">
                            <div
                                class="d-flex justify-center align-center ga-1"
                            >
                                <v-icon
                                    v-if="editable"
                                    class="action-icon"
                                    icon="mdi-pencil"
                                    @click.stop="onEdit(getRawItem(item))"
                                />

                                <v-icon
                                    v-if="deletable"
                                    class="action-icon"
                                    icon="mdi-delete"
                                    @click.stop="
                                        openDeleteDialog(getRawItem(item))
                                    "
                                />
                            </div>
                        </template>

                        <template v-else>
                            {{
                                cellFormatters?.[header.key]
                                    ? cellFormatters[header.key](
                                          getRawItem(item)[header.key],
                                          getRawItem(item),
                                      )
                                    : getRawItem(item)[header.key]
                            }}
                        </template>
                    </td>
                </tr>
            </template>

            <template #bottom>
                <div class="table-footer">
                    <div class="table-footer__left-spacer" />

                    <div class="table-footer__pagination-center">
                        <v-pagination
                            v-model="currentPage"
                            :length="pageCount"
                            :total-visible="5"
                            density="comfortable"
                            rounded="circle"
                            prev-icon="mdi-chevron-left"
                            next-icon="mdi-chevron-right"
                            class="table-footer__pagination"
                        />
                    </div>

                    <div class="table-footer__right-controls">
                        <div class="table-footer__page-size">
                            <span class="table-footer__page-size-label">
                                Items per page
                            </span>

                            <v-select
                                v-model="localItemsPerPage"
                                :items="itemsPerPageOptions"
                                variant="outlined"
                                density="compact"
                                hide-details
                                class="table-footer__page-size-select"
                            />
                        </div>
                    </div>
                </div>
            </template>
        </v-data-table-server>
    </div>

    <DeleteDialog
        v-model="deleteDialogOpen"
        :target-route="deleteTargetRoute"
        :translation-key-prefix="translationKeyPrefix"
        @confirm="confirmDelete"
    />

    <StatusDialog
        v-model="statusDialogOpen"
        :active="selectedItemActive"
        :translation-key-prefix="translationKeyPrefix"
        @confirm="confirmStatusChange"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { SettingsTableHeader } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/types.ts";
import DeleteDialog from "@/components/views/seb-server/settings-navigation/components/DeleteDialog.vue";
import StatusDialog from "@/components/views/seb-server/settings-navigation/components/StatusDialog.vue";
import { useSettingsNavigation } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsNavigation.ts";
import type { ServerTablePaging } from "@/models/types";

type TableItem = Record<string, unknown>;
type CellFormatter = (value: unknown, item: TableItem) => string;

const props = withDefaults(
    defineProps<{
        headers: SettingsTableHeader[];
        items: TableItem[];
        loading: boolean;
        totalItems?: number;
        options?: ServerTablePaging;
        itemsPerPage?: number;
        pageCount?: number;
        route?: string;
        itemIdentifierKey?: string;
        editable?: boolean;
        deletable?: boolean;
        statusChangeable?: boolean;
        translationKeyPrefix: string;
        cellFormatters?: Record<string, CellFormatter>;
    }>(),
    {
        pageCount: 0,
        itemsPerPage: 10,
        totalItems: undefined,
        options: undefined,
        route: "",
        itemIdentifierKey: "",
        editable: true,
        deletable: true,
        statusChangeable: true,
        cellFormatters: () => ({}),
    },
);

const emit = defineEmits<{
    delete: [item: TableItem];
    edit: [item: TableItem];
    rowClick: [item: TableItem];
    statusChange: [item: TableItem];
    "update:options": [options: ServerTablePaging];
}>();

const deleteDialogOpen = ref(false);
const statusDialogOpen = ref(false);
const selectedItem = ref<TableItem | null>(null);

const { buildItemRoute, navigateToItem } = useSettingsNavigation(
    props.route,
    props.itemIdentifierKey,
);

const deleteTargetRoute = computed(() => {
    if (!selectedItem.value) return "";
    return buildItemRoute(selectedItem.value);
});

const selectedItemActive = computed(() => {
    if (!selectedItem.value) return false;
    return Boolean(selectedItem.value.active);
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

function onEdit(item: TableItem) {
    emit("edit", item);

    if (!props.editable) return;
    navigateToItem(item);
}

function onRowClick(item: TableItem) {
    emit("rowClick", item);

    if (!props.editable) return;
    navigateToItem(item);
}

function openDeleteDialog(item: TableItem) {
    selectedItem.value = item;
    deleteDialogOpen.value = true;
}

function confirmDelete() {
    if (!selectedItem.value) return;

    emit("delete", selectedItem.value);
    deleteDialogOpen.value = false;
}

function openStatusDialog(item: TableItem) {
    if (!props.statusChangeable) return;

    selectedItem.value = item;
    statusDialogOpen.value = true;
}

function confirmStatusChange() {
    if (!selectedItem.value) return;

    emit("statusChange", selectedItem.value);
    statusDialogOpen.value = false;
}

const itemsPerPageOptions = computed(() => {
    const options = [5];

    if (props.pageCount > 1 || props.items.length > 5) {
        options.push(10);
    }

    if (props.pageCount > 2 || props.items.length > 10) {
        options.push(15);
    }

    return options;
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
    const page = props.options?.page ?? 1;
    const perPage = props.options?.itemsPerPage ?? props.itemsPerPage;

    if (props.pageCount === 0) {
        return props.items.length;
    }

    if (page === props.pageCount) {
        return (props.pageCount - 1) * perPage + props.items.length;
    }

    return props.pageCount * perPage;
});
</script>

<style scoped>
:deep(.v-table__wrapper) {
    min-height: calc(56px + 5 * 52px);
}

:deep(table) {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
}

:deep(thead tr) {
    background-color: transparent;
}

:deep(tbody tr) {
    transition: background-color 0.15s ease-in-out;
}

:deep(tbody tr.table-row--clickable) {
    cursor: pointer;
}

:deep(tbody tr:hover) {
    background-color: rgba(var(--v-theme-primary), 0.06);
}

:deep(tbody td) {
    color: rgb(var(--v-theme-primary));
    vertical-align: middle !important;
    border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

:deep(.v-progress-linear) {
    border-radius: 999px;
}

:deep(.v-data-table-rows-no-data td) {
    color: rgba(var(--v-theme-on-surface), 0.6);
    text-align: center;
}

:deep(.v-data-table__td:last-child),
:deep(.v-data-table__th:last-child) {
    text-align: center;
}

:deep(.v-chip) {
    font-weight: 500;
}

:deep(.v-btn) {
    text-transform: none;
}

.status-chip {
    min-width: 4.7rem;
    max-width: 6.5rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    transition:
        transform 0.2s ease,
        filter 0.2s ease,
        box-shadow 0.2s ease;
}

.status-chip:hover {
    transform: translateY(-1px) scale(1.03);
    filter: brightness(1.05);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.action-icon {
    color: rgba(var(--v-theme-on-surface), 0.6);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.5rem;
    transition:
        color 0.2s ease,
        background-color 0.2s ease;
}

.action-icon:hover {
    color: rgb(var(--v-theme-primary));
    background-color: rgba(var(--v-theme-primary), 0.1);
}

.table-footer {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    width: 100%;
    padding: 1rem 1.25rem 0.75rem 1.25rem;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
    background: rgb(var(--v-theme-surface));
    column-gap: 1rem;
}

.table-footer__left-spacer {
    min-width: 0;
}

.table-footer__pagination-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.table-footer__right-controls {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-width: 0;
}

.table-footer__page-size {
    display: flex;
    align-items: center;
    gap: 0.65rem;
}

.table-footer__page-size-label {
    color: rgba(var(--v-theme-on-surface), 0.6);
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
}

.table-footer__page-size-select {
    width: 90px;
}

:deep(.table-footer__page-size-select .v-field) {
    border-radius: 10px;
    box-shadow: none;
}

:deep(.table-footer__page-size-select .v-field__input) {
    min-height: 38px;
    color: rgb(var(--v-theme-primary));
    font-weight: 600;
}

:deep(.table-footer__pagination .v-btn) {
    min-width: 34px;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    color: rgba(var(--v-theme-on-surface), 0.6);
    font-weight: 600;
    box-shadow: none;
}

:deep(.table-footer__pagination .v-btn:hover) {
    background-color: rgba(var(--v-theme-primary), 0.08);
    color: rgb(var(--v-theme-primary));
}

:deep(.table-footer__pagination .v-btn--active) {
    background-color: rgba(var(--v-theme-primary), 0.06) !important;
    color: rgb(var(--v-theme-primary)) !important;
    box-shadow: none !important;
}

:deep(.table-footer__pagination .v-btn--active .v-btn__content) {
    color: rgb(var(--v-theme-primary)) !important;
}

@media (max-width: 960px) {
    .table-footer {
        grid-template-columns: 1fr;
        row-gap: 0.75rem;
    }

    .table-footer__pagination-center {
        justify-content: center;
    }

    .table-footer__right-controls {
        justify-content: center;
    }
}
</style>
