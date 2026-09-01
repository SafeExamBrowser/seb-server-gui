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
    >
        <template #footer>
            <v-expand-transition>
                <v-sheet
                    v-if="armedActionMeta"
                    rounded="lg"
                    class="bg-surface-tint d-flex flex-column ga-2 pa-3"
                    data-testid="monitoring-clients-armed-action-panel"
                >
                    <div class="d-flex align-center ga-2">
                        <v-icon
                            size="small"
                            color="primary"
                            :icon="armedActionMeta.icon"
                        />
                        <span class="text-body-medium font-weight-bold">
                            {{ $t(armedActionMeta.titleKey) }}
                        </span>
                    </div>
                    <span class="text-body-small text-medium-emphasis">
                        {{ $t(armedActionMeta.hintKey) }}
                    </span>
                    <v-textarea
                        v-if="isLockActionArmed"
                        v-model="lockMessage"
                        rows="1"
                        max-rows="6"
                        auto-grow
                        density="compact"
                        variant="outlined"
                        bg-color="surface"
                        hide-details
                        :placeholder="
                            $t(
                                'monitoringClients.actions.lockMessagePlaceholder',
                            )
                        "
                        data-testid="monitoring-clients-lock-message-input"
                    />
                    <v-btn
                        color="primary"
                        variant="flat"
                        block
                        class="text-none"
                        :disabled="confirmDisabled"
                        data-testid="monitoring-clients-confirm-action-button"
                        @click="handleConfirmArmedAction"
                    >
                        {{ $t("monitoringClients.actions.confirm") }}
                    </v-btn>
                    <v-btn
                        variant="outlined"
                        block
                        class="text-none"
                        data-testid="monitoring-clients-cancel-action-button"
                        @click="handleCancelArmedAction"
                    >
                        {{ $t("monitoringClients.actions.cancel") }}
                    </v-btn>
                </v-sheet>
            </v-expand-transition>
        </template>
    </SearchBar>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
    VBtn,
    VExpandTransition,
    VIcon,
    VSheet,
    VTextarea,
} from "vuetify/components";

import type { TableFilters } from "@/components/widgets/entity-table/types.ts";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import type { SearchBarAction } from "@/components/widgets/searches/types.ts";
import { MonitoringBulkActionEnum } from "@/models/seb-server/monitoringEnums.ts";
import { useMonitoringClientsActions } from "@/pages/(app)/monitoring/[examId]/client/composables/useMonitoringClientsActions.ts";
import { useMonitoringClientsFilters } from "@/pages/(app)/monitoring/[examId]/client/composables/useMonitoringClientsFilters.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";

const BULK_ACTION_LABEL_I18N_KEYS: Record<MonitoringBulkActionEnum, string> = {
    [MonitoringBulkActionEnum.LOCK]: "monitoringClients.info.lockClients",
    [MonitoringBulkActionEnum.UNLOCK]: "monitoringClients.info.unlockClients",
    [MonitoringBulkActionEnum.QUIT]: "monitoringClients.info.quitClients",
    [MonitoringBulkActionEnum.CANCEL]: "monitoringClients.info.cancelClients",
};

const BULK_ACTION_TITLE_I18N_KEYS: Record<MonitoringBulkActionEnum, string> = {
    [MonitoringBulkActionEnum.LOCK]: "monitoringClients.actions.lockTitle",
    [MonitoringBulkActionEnum.UNLOCK]: "monitoringClients.actions.unlockTitle",
    [MonitoringBulkActionEnum.QUIT]: "monitoringClients.actions.quitTitle",
    [MonitoringBulkActionEnum.CANCEL]: "monitoringClients.actions.cancelTitle",
};

const BULK_ACTION_HINT_I18N_KEYS: Record<MonitoringBulkActionEnum, string> = {
    [MonitoringBulkActionEnum.LOCK]: "monitoringClients.actions.lockHint",
    [MonitoringBulkActionEnum.UNLOCK]: "monitoringClients.actions.unlockHint",
    [MonitoringBulkActionEnum.QUIT]: "monitoringClients.actions.quitHint",
    [MonitoringBulkActionEnum.CANCEL]: "monitoringClients.actions.cancelHint",
};

const BULK_ACTION_ICONS: Record<MonitoringBulkActionEnum, string> = {
    [MonitoringBulkActionEnum.LOCK]: "mdi-monitor-lock",
    [MonitoringBulkActionEnum.UNLOCK]: "mdi-lock-open-outline",
    [MonitoringBulkActionEnum.QUIT]: "mdi-backspace-outline",
    [MonitoringBulkActionEnum.CANCEL]: "mdi-cancel",
};

const props = defineProps<{
    examId: string;
}>();

const emit = defineEmits<{
    (e: "updatePageInfo"): void;
}>();

// stores
const monitoringStore = useMonitoringStore();

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
const {
    armedAction,
    availableActions,
    selectedEligibleRows,
    arm,
    disarm,
    applyArmedAction,
} = useMonitoringClientsActions(examId);

const lockMessage = ref<string>("");

// While an action is armed the action buttons make way for the confirm sheet.
const bulkActions = computed<SearchBarAction[]>(() => {
    if (armedAction.value != null) {
        return [];
    }

    return availableActions.value.map((action) => ({
        key: action.toLowerCase(),
        icon: BULK_ACTION_ICONS[action],
        label: BULK_ACTION_LABEL_I18N_KEYS[action],
        color: action === MonitoringBulkActionEnum.CANCEL ? "error" : "primary",
        variant:
            action === MonitoringBulkActionEnum.CANCEL ? "flat" : "outlined",
        onClick: () => handleArmAction(action),
    }));
});

const armedActionMeta = computed(() => {
    const action = armedAction.value;
    if (action == null) {
        return undefined;
    }

    return {
        icon: BULK_ACTION_ICONS[action],
        titleKey: BULK_ACTION_TITLE_I18N_KEYS[action],
        hintKey: BULK_ACTION_HINT_I18N_KEYS[action],
    };
});

const isLockActionArmed = computed(
    () => armedAction.value === MonitoringBulkActionEnum.LOCK,
);

const confirmDisabled = computed(() => selectedEligibleRows.value.length === 0);

function handleArmAction(action: MonitoringBulkActionEnum) {
    lockMessage.value = "";
    arm(action);
}

function handleCancelArmedAction() {
    disarm();
}

async function handleConfirmArmedAction() {
    await applyArmedAction(lockMessage.value);
    emit("updatePageInfo");
}
</script>
