<template>
    <v-data-table-server
        :headers="headers"
        :items="items"
        :items-length="totalItems"
        :items-per-page="itemsPerPage"
        :items-per-page-options="itemsPerPageOptions"
        :loading="loading"
        :loading-text="$t('general.loading')"
        :no-data-text="$t('general.noData')"
        @update:options="emit('update:options', $event)"
    >
        <template #item="{ item }">
            <tr @click="onRowClick(getRawItem(item))">
                <td v-for="header in headers" :key="header.key">
                    <template v-if="header.key === 'active'">
                        <v-chip
                            class="text-white font-weight-medium status-chip cursor-pointer"
                            :color="getRawItem(item).active ? 'green' : 'red'"
                            size="small"
                            @click.stop="openStatusDialog(getRawItem(item))"
                        >
                            {{
                                getRawItem(item).active ? "Active" : "Inactive"
                            }}
                        </v-chip>
                    </template>

                    <template v-else-if="header.key === 'actions'">
                        <div class="actions-container">
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
                                @click.stop="openDeleteDialog(getRawItem(item))"
                            />
                        </div>
                    </template>

                    <template v-else-if="header.key === 'institutionId'">
                        {{ getInstitutionName(getRawItem(item)[header.key]) }}
                    </template>

                    <template v-else>
                        {{ getRawItem(item)[header.key] }}
                    </template>
                </td>
            </tr>
        </template>
    </v-data-table-server>

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
import type { SettingsTableHeader } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/settingsTableTypes";
import DeleteDialog from "@/components/views/seb-server/settings-navigation/components/DeleteDialog.vue";
import StatusDialog from "@/components/views/seb-server/settings-navigation/components/StatusDialog.vue";
import { useSettingsNavigation } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsNavigation.ts";
import { useInstitutionNameMap } from "@/components/views/seb-server/settings-navigation/composables/useInstitutionNameMap.ts";
import type { ServerTablePaging } from "@/models/types";

type TableItem = Record<string, unknown>;

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
    }>(),
    {
        totalItems: 0,
        pageCount: 0,
        itemsPerPage: 10,
        route: "",
        itemIdentifierKey: "",
        editable: true,
        deletable: true,
        statusChangeable: true,
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

const hasInstitutionColumn = computed(() =>
    props.headers.some((header) => header.key === "institutionId"),
);

const { getInstitutionName } = useInstitutionNameMap(hasInstitutionColumn);

const itemsPerPageOptions = computed(() => {
    const options = [5];

    if (props.totalItems > 5) {
        options.push(10);
    }

    if (props.totalItems > 10) {
        options.push(15);
    }

    return options;
});
</script>

<style scoped>
:deep(.v-table__wrapper) {
    min-height: 24vh;
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
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
}

:deep(tbody tr:hover) {
    background-color: rgba(33, 92, 175, 0.06);
}

:deep(tbody td) {
    color: #215caf;
    vertical-align: middle !important;
    border-bottom: 1px solid rgba(220, 220, 220, 0.6);
}

:deep(.v-progress-linear) {
    border-radius: 999px;
}

:deep(.v-data-table-rows-no-data td) {
    color: #757575;
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

.actions-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.2rem;
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
    color: #757575;
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
    color: #215caf;
    background-color: rgba(33, 92, 175, 0.1);
}
</style>
