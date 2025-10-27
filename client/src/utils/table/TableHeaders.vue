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
                :style="{ width: column.width }"
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
                        @update:model-value="
                            (val) => props.selectAll && props.selectAll(!!val)
                        "
                    />
                    <div></div>
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
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import * as tableUtils from "@/utils/table/tableUtils";
import { useTableStore } from "@/stores/store";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import {
    HeadersSlotProps,
    VDataTableHeaderCellColumnSlotProps,
} from "vuetify/lib/components/VDataTable/VDataTableHeaders.mjs";

type Clickable = { click: () => void };

const tableStore = useTableStore();
const monitoringStore = useMonitoringStore();

// header refs
const headerRefs = ref<Clickable[] | null>(null);

//todo @Rad14nt take a look with alain potentially remove ignores on refactor
// props
const props = defineProps<{
    columns: HeadersSlotProps["columns"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isSorted: (column: any) => boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSortIcon: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toggleSort: (column: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headerRefsProp: any;
    day?: string;
    selectAll?: (value: boolean) => void;
    allSelected?: boolean;
    someSelected?: boolean;
    tableKey?: string;
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
