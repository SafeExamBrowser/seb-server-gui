<template>
    <tr>
        <template
            v-for="(column, index) in props.columns"
            :key="column.key ?? index"
        >
            <th
                :class="[
                    column.key == 'data-table-select' ? 'pl-4' : '',
                    column.align === 'center' ? 'text-center' : '',
                ]"
                :style="getHeaderCellStyle(column)"
            >
                <!------------------------sorting---------------------------------->
                <span
                    v-if="column.sortable"
                    ref="headerRefs"
                    :aria-label="getHeaderDescription(column, isSorted)"
                    class="mr-2 cursor-pointer font-weight-bold"
                    role="button"
                    tabindex="0"
                    @click="() => props.toggleSort(column)"
                    @keydown="
                        tableUtils.handleTabKeyEvent($event, 'sort', index, {
                            headerRefs: headerRefs,
                        })
                    "
                >
                    {{ column.title }}
                </span>
                <span v-else>
                    {{ column.title }}
                </span>

                <template v-if="props.isSorted(column)">
                    <v-icon :icon="props.getSortIcon(column)"></v-icon>
                </template>

                <!------------------------selection-------------------------------->
                <template
                    v-if="
                        column.key == 'data-table-select' &&
                        props.selectAll != null
                    "
                >
                    <v-checkbox-btn
                        :indeterminate="
                            props.someSelected && !props.allSelected
                        "
                        :model-value="props.allSelected"
                        @update:model-value="handleSelectAll"
                    />
                    <div></div>
                </template>

                <!------------------------monitoring: bulk action selection-------->
                <template
                    v-if="
                        column.key == 'select' &&
                        tableKey == 'monitoringClients' &&
                        props.selectAll != null
                    "
                >
                    <div :style="selectionCellInnerStyle(!!selectionActive, 0)">
                        <v-checkbox-btn
                            v-if="selectionActive"
                            :indeterminate="
                                props.someSelected && !props.allSelected
                            "
                            :model-value="props.allSelected"
                            @update:model-value="handleSelectAll"
                        />
                    </div>
                </template>

                <!------------------------sp: session search: delete----------------------->
                <template
                    v-if="
                        column.key == 'data-table-expand' &&
                        tableKey == 'session'
                    "
                >
                    <v-btn
                        class="pr-4"
                        :disabled="!someSelected"
                        icon="mdi-delete"
                        variant="text"
                        @click="emit('openDeleteSessionsDialog')"
                    >
                    </v-btn>
                </template>

                <!------------------------sp: session search: show name / ip--------------------------->
                <template
                    v-if="column.key == 'clientName' && tableKey == 'session'"
                >
                    <v-btn
                        :aria-label="
                            tableStore.isIpDisplayList[
                                tableUtils.getSessionListIndex(props.day!)
                            ].isIp
                                ? 'show login name'
                                : 'show IP'
                        "
                        :icon="
                            tableStore.isIpDisplayList[
                                tableUtils.getSessionListIndex(props.day!)
                            ].isIp
                                ? 'mdi-toggle-switch-outline'
                                : 'mdi-toggle-switch-off-outline'
                        "
                        rounded="sm"
                        variant="flat"
                        @click="toggleNameIpSwitch()"
                    >
                    </v-btn>
                </template>
                <!----------------------------------------------------------------->

                <template
                    v-if="
                        tableKey == 'monitoringClients' &&
                        column.key == 'status' &&
                        !tableStore.isIndicatorExpandButtonDisabled &&
                        (monitoringStore.batteryIndicatorId != null ||
                            monitoringStore.wlanIndicatorId != null)
                    "
                >
                    <v-btn
                        :aria-label="
                            tableStore.isIndicatorsExpanded
                                ? 'hide exam details'
                                : 'show exam details'
                        "
                        :icon="
                            tableStore.isIndicatorsExpanded
                                ? 'mdi-arrow-expand-left'
                                : 'mdi-arrow-expand-right'
                        "
                        rounded="sm"
                        size="small"
                        variant="flat"
                        @click="
                            tableStore.isIndicatorsExpanded
                                ? emit('removeIndicatorHeaders')
                                : emit('addIndicatorHeaders')
                        "
                    >
                    </v-btn>
                </template>
            </th>
        </template>
    </tr>
</template>
<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, StyleValue } from "vue";
import { VBtn, VCheckboxBtn, VIcon } from "vuetify/components";
import {
    HeadersSlotProps,
    VDataTableHeaderCellColumnSlotProps,
} from "vuetify/lib/components/VDataTable/VDataTableHeaders.mjs";

import {
    SELECTION_CELL_STYLE,
    selectionCellInnerStyle,
} from "@/pages/(app)/monitoring/[examId]/client/composables/useMonitoringClientsActions.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { useTableStore } from "@/stores/store";
import * as tableUtils from "@/utils/table/tableUtils";

const tableStore = useTableStore();
const monitoringStore = useMonitoringStore();

type Clickable = { click: () => void };

// header refs
const headerRefs = ref<(Clickable | null)[] | null>(null);

// props
const props = defineProps<{
    columns: HeadersSlotProps["columns"];
    isSorted: HeadersSlotProps["isSorted"];
    getSortIcon: HeadersSlotProps["getSortIcon"];
    toggleSort: HeadersSlotProps["toggleSort"];
    headerRefsProp: (Clickable | null)[] | null;
    day?: string;
    selectAll?: (value: boolean) => void;
    allSelected?: boolean;
    someSelected?: boolean;
    tableKey?: string;
    selectionActive?: boolean;
}>();

// emits
const emit = defineEmits<{
    addIndicatorHeaders: [];
    removeIndicatorHeaders: [];
    openDeleteSessionsDialog: [];
}>();

onBeforeMount(() => {
    headerRefs.value = props.headerRefsProp;
});

onBeforeUnmount(() => {
    headerRefs.value = null;
});

function handleSelectAll(value: boolean | null) {
    props.selectAll?.(!!value);
}

function getHeaderCellStyle(
    column: VDataTableHeaderCellColumnSlotProps["column"],
): StyleValue {
    if (props.tableKey === "monitoringClients" && column.key === "select") {
        return SELECTION_CELL_STYLE;
    }
    return { width: column.width };
}

function toggleNameIpSwitch() {
    if (!props.day) return;
    const index = tableUtils.getSessionListIndex(props.day);
    const entry = tableStore.isIpDisplayList[index];
    if (!entry) return;
    entry.isIp = !entry.isIp;
}

function getHeaderDescription(
    column: VDataTableHeaderCellColumnSlotProps["column"],
    isSortedFn: VDataTableHeaderCellColumnSlotProps["isSorted"],
): string {
    const headerDesc = `Header: ${column.title}, sort order: `;

    if (!isSortedFn(column)) return `${headerDesc} none`;

    const icon = props.getSortIcon(column);
    if (icon === "$sortAsc") return `${headerDesc} ascending`;
    if (icon === "$sortDesc") return `${headerDesc} descending`;
    return `${headerDesc} none`;
}
</script>

<style scoped></style>
