<template>
    <SearchBar
        v-model="searchInput"
        :applied-search="appliedSearch"
        search-text="monitoringClients.info.searchPlaceholder"
        :filter-sections="filterSections"
        :filter-values="filterValues"
        :actions="bulkActions"
        data-test-id="monitoring-clients"
        @search="handleSearch"
        @clear="handleClearSearch"
        @update:filter-values="handleFilterValuesUpdate"
        @clear-filters="handleClearFilters"
    />

    <!-----------instruction confirm dialog---------->
    <v-dialog v-model="instructionConfirmDialog" max-width="600">
        <InstructionConfirmDialog
            :exam-id="examId"
            :connection-tokens="selectedConnectionTokens"
            :instruction-type="selectedInstructionType"
            :is-cancel-instruction="isSelectedInstructionCancel"
            @close-instruction-confirm-dialog="closeInstructionConfirmDialog"
        >
        </InstructionConfirmDialog>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import * as generalUtils from "@/utils/generalUtils.ts";
import { InstructionEnum } from "@/models/seb-server/instructionEnum.ts";
import { useErrorStore } from "@/stores/seb-server/errorStore.ts";
import { ErrorProps } from "@/models/alertProps.ts";
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import type { SearchBarAction } from "@/components/widgets/searches/types.ts";
import type { TableFilters } from "@/components/widgets/entity-table/types.ts";
import InstructionConfirmDialog from "./InstructionConfirmDialog.vue";
import { useMonitoringClientsFilters } from "@/pages/(app)/monitoring/[examId]/client/composables/useMonitoringClientsFilters.ts";

const props = defineProps<{
    examId: string;
}>();

const emit = defineEmits<{
    (e: "updatePageInfo"): void;
}>();

// stores
const monitoringStore = useMonitoringStore();
const errorStore = useErrorStore();

// exam
const examId = props.examId;

// filters
const { filterValues, filterSections, applyFilterValues, clearAllFilters } =
    useMonitoringClientsFilters();

const searchInput = ref(monitoringStore.searchName ?? undefined);

const appliedSearch = computed(() => monitoringStore.searchName ?? undefined);

watch(
    () => monitoringStore.searchName,
    (searchName) => {
        if (searchName == null) {
            searchInput.value = undefined;
        }
    },
);

function handleSearch() {
    monitoringStore.searchName = searchInput.value || null;
    emit("updatePageInfo");
}

function handleClearSearch() {
    searchInput.value = undefined;
    monitoringStore.searchName = null;
    emit("updatePageInfo");
}

function handleFilterValuesUpdate(next: TableFilters) {
    applyFilterValues(next);
    emit("updatePageInfo");
}

function handleClearFilters() {
    monitoringStore.searchName = null;
    clearAllFilters();
    emit("updatePageInfo");
}

// bulk actions
const bulkActions = computed<SearchBarAction[]>(() => [
    {
        key: "lock",
        icon: "mdi-monitor-lock",
        label: "monitoringClients.info.lockClients",
        variant: "outlined",
        disabled: isScreenLockDisabled,
        onClick: handleLockClients,
    },
    {
        key: "quit",
        icon: "mdi-backspace-outline",
        label: "monitoringClients.info.quitClients",
        variant: "outlined",
        disabled: isSEBQuitDisabled,
        onClick: handleQuitClients,
    },
    {
        key: "cancel",
        icon: "mdi-cancel",
        label: "monitoringClients.info.cancelClients",
        color: "error",
        disabled: isCancelConnectionDisabled,
        onClick: handleCancelClients,
    },
]);

function handleLockClients() {
    openInstructionConfirmDialog(InstructionEnum.SEB_FORCE_LOCK_SCREEN, false);
}

function handleQuitClients() {
    openInstructionConfirmDialog(InstructionEnum.SEB_QUIT, false);
}

function handleCancelClients() {
    openInstructionConfirmDialog(InstructionEnum.SEB_MARK_AS_CANCELLED, true);
}

function isScreenLockDisabled(): boolean {
    return (
        monitoringStore.selectedMonitoringIds.length == 0 ||
        getConnectionTokens(InstructionEnum.SEB_FORCE_LOCK_SCREEN) == null
    );
}

function isSEBQuitDisabled(): boolean {
    return (
        monitoringStore.selectedMonitoringIds.length == 0 ||
        getConnectionTokens(InstructionEnum.SEB_QUIT) == null
    );
}

function isCancelConnectionDisabled(): boolean {
    return (
        monitoringStore.selectedMonitoringIds.length == 0 ||
        getConnectionTokens(InstructionEnum.SEB_MARK_AS_CANCELLED) == null
    );
}

//= ==============instruction confirm dialog====================
const instructionConfirmDialog = ref<boolean>(false);
const selectedInstructionType = ref<InstructionEnum | null>(null);
const isSelectedInstructionCancel = ref<boolean>(false);
const selectedConnectionTokens = ref<string>("");

function openInstructionConfirmDialog(
    instructionType: InstructionEnum | null,
    isCancelInstruction: boolean,
) {
    if (instructionType == null) {
        return;
    }

    const connectionTokens: string | null =
        getConnectionTokens(instructionType);
    if (connectionTokens == null) {
        const errorProps: ErrorProps = {
            color: "error",
            textKey: "no-data",
            timeout: 5000,
        };

        errorStore.showError(errorProps);
        return;
    }

    selectedInstructionType.value = instructionType;
    selectedConnectionTokens.value = connectionTokens;
    isSelectedInstructionCancel.value = isCancelInstruction;

    instructionConfirmDialog.value = true;
}

function closeInstructionConfirmDialog() {
    instructionConfirmDialog.value = false;
}

function getConnectionTokens(instructionType: InstructionEnum): string | null {
    if (monitoringStore.monitoringData == null) {
        return null;
    }

    // get token and add it to list
    const connectionTokens: string[] = [];
    monitoringStore.selectedMonitoringIds.forEach((id) => {
        const row = monitoringStore.monitoringData.get(id);
        if (row) {
            switch (instructionType) {
                case InstructionEnum.SEB_QUIT:
                case InstructionEnum.SEB_FORCE_LOCK_SCREEN: {
                    if (
                        !row.missing &&
                        (row.status == ConnectionStatusEnum.ACTIVE ||
                            row.status ==
                                ConnectionStatusEnum.CONNECTION_REQUESTED ||
                            row.status == ConnectionStatusEnum.READY)
                    ) {
                        connectionTokens.push(row.connectionToken);
                    }
                    break;
                }
                case InstructionEnum.SEB_MARK_AS_CANCELLED: {
                    if (
                        row.status == ConnectionStatusEnum.CLOSED ||
                        row.status == ConnectionStatusEnum.MISSING ||
                        row.missing
                    ) {
                        connectionTokens.push(row.connectionToken);
                    }
                    break;
                }
                default:
            }
        }
    });

    if (connectionTokens.length === 0) {
        return null;
    }

    // create string and return string comma list
    return generalUtils.createStringCommaList(connectionTokens);
}
</script>
