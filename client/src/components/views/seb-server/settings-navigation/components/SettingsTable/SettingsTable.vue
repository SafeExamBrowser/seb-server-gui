<template>
    <v-data-table-server
        :headers="headers"
        :items="items"
        :items-length="items.length"
        :items-per-page="5"
        :loading="loading"
        :loading-text="$t('general.loading')"
        :no-data-text="$t('general.noData')"
    >
        <template #item="{ item }">
            <tr @click="onRowClick(getRawItem(item))">
                <td v-for="header in headers" :key="header.key">
                    <template v-if="header.key === 'active'">
                        <v-chip
                            class="text-white font-weight-medium"
                            :color="getRawItem(item).active ? 'green' : 'red'"
                            size="small"
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
        @confirm="confirmDelete"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { SettingsTableHeader } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/settingsTableTypes";
import DeleteDialog from "@/components/views/seb-server/settings-navigation/components/DeleteDialog.vue";
import { useSettingsNavigation } from "@/components/views/seb-server/settings-navigation/components/SettingsTable/composables/useSettingsNavigation.ts";

type TableItem = Record<string, unknown>;

const props = withDefaults(
    defineProps<{
        headers: SettingsTableHeader[];
        items: TableItem[];
        loading: boolean;
        route?: string;
        itemIdentifierKey?: string;
        editable?: boolean;
        deletable?: boolean;
    }>(),
    {
        editable: true,
        deletable: true,
    },
);

const emit = defineEmits<{
    delete: [item: TableItem];
    edit: [item: TableItem];
    rowClick: [item: TableItem];
}>();

const deleteDialogOpen = ref(false);
const selectedItem = ref<TableItem | null>(null);

const { buildItemRoute, navigateToItem } = useSettingsNavigation(
    props.route,
    props.itemIdentifierKey,
);

const deleteTargetRoute = computed(() => {
    if (!selectedItem.value) return "";
    return buildItemRoute(selectedItem.value);
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
</script>

<style scoped>
:deep(.v-data-table) {
    background: transparent;
}

:deep(.v-table) {
    background: transparent;
    border-radius: 0.75rem;
    overflow: hidden;
}

:deep(.v-table__wrapper) {
    min-height: 35vh;
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

:deep(.v-data-table-footer) {
    border-top: 1px solid #dcdcdc;
    padding-top: 0.5rem;
}

:deep(.v-data-table-footer__items-per-page),
:deep(.v-data-table-footer__info),
:deep(.v-data-table-footer__pagination) {
    color: #757575;
    font-size: 0.9rem;
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
