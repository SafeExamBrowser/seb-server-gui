<template>
    <v-form
        class="d-flex flex-column h-100"
        :data-testid="`${dataTestId}-filters-container`"
        @keyup.enter="handleSearch"
        @keydown.esc="handleEscape"
    >
        <!------------ header ------------->
        <div
            class="d-flex align-center ga-2 px-4 pt-6 pb-1"
            :style="{ minHeight: '56px' }"
        >
            <v-icon icon="mdi-magnify" color="primary" />
            <span class="text-subtitle-1 font-weight-bold flex-grow-1">
                {{ $t("titles.spSearch") }}
            </span>
            <v-btn
                v-if="clearAllAvailable"
                variant="text"
                color="primary"
                size="small"
                class="text-none"
                :data-testid="`${dataTestId}-search-cancel-button`"
                @click="handleReset"
            >
                <v-icon start size="small" icon="mdi-refresh" />
                {{ $t("general.clearAll") }}
            </v-btn>
        </div>

        <!------------ body ------------->
        <div
            class="flex-grow-1 overflow-y-auto px-4 py-3"
            :style="{ minHeight: 0 }"
        >
            <SpSearchField
                v-model="filters.examName"
                :label="$t('searchForm.examName')"
                :placeholder="$t('spSearch.anyExam')"
                :data-test-id="`${dataTestId}-exam-name`"
            />
            <SpSearchField
                v-model="filters.groupName"
                :label="$t('searchForm.groupName')"
                :placeholder="$t('spSearch.anyGroup')"
                :data-test-id="`${dataTestId}-group-name`"
            />

            <!------------ Login / Machine name ------------->
            <v-expansion-panels v-model="openGroups" multiple class="mb-3 mt-1">
                <v-expansion-panel
                    value="loginMachine"
                    elevation="0"
                    class="border"
                    rounded="lg"
                    :data-testid="`${dataTestId}-login-machine-group`"
                >
                    <v-expansion-panel-title>
                        <v-icon
                            icon="mdi-identifier"
                            color="primary"
                            class="mr-2"
                        />
                        <span class="text-body-small font-weight-bold">
                            {{ $t("searchForm.loginMachineTitle") }}
                        </span>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <SpSearchField
                            v-model="filters.loginName"
                            :label="$t('searchForm.loginName')"
                            :placeholder="$t('spSearch.anyLogin')"
                            :data-test-id="`${dataTestId}-login-name`"
                        />
                        <SpSearchField
                            v-model="filters.ipAddress"
                            :label="$t('searchForm.ipAddress')"
                            :placeholder="$t('spSearch.anyIp')"
                            :data-test-id="`${dataTestId}-ip-address`"
                        />
                        <SpSearchField
                            v-model="filters.machineName"
                            :label="$t('searchForm.machineName')"
                            :placeholder="$t('spSearch.anyMachine')"
                            :data-test-id="`${dataTestId}-machine-name`"
                        />
                    </v-expansion-panel-text>
                </v-expansion-panel>

                <!------------ Metadata ------------->
                <v-expansion-panel
                    value="metadata"
                    elevation="0"
                    class="border mt-3"
                    rounded="lg"
                    :data-testid="`${dataTestId}-metadata-group`"
                >
                    <v-expansion-panel-title>
                        <v-icon
                            icon="mdi-image-outline"
                            color="primary"
                            class="mr-2"
                        />
                        <span class="text-body-small font-weight-bold">
                            {{ $t("searchForm.metadataTitle") }}
                        </span>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <SpSearchField
                            v-model="filters.metadataApplication"
                            :label="spConstants.APPLICATION_METADATA"
                            :placeholder="$t('spSearch.anyApplication')"
                            :data-test-id="`${dataTestId}-metadata-application`"
                        />
                        <SpSearchField
                            v-model="filters.metadataBrowserTitle"
                            :label="spConstants.SEB_BROWSER_TITLE_METADATA"
                            :placeholder="$t('spSearch.anyBrowserTitle')"
                            :data-test-id="`${dataTestId}-metadata-browser-title`"
                        />
                        <SpSearchField
                            v-model="filters.metadataActivityDetails"
                            :label="spConstants.ACTIVITY_DETAILS_METADATA"
                            :placeholder="$t('spSearch.anyActivity')"
                            :data-test-id="`${dataTestId}-metadata-activity-details`"
                        />
                        <SpSearchField
                            v-model="filters.metadataWindowTitle"
                            :label="spConstants.WINDOW_TITLE_METADATA"
                            :placeholder="$t('spSearch.anyWindow')"
                            :data-test-id="`${dataTestId}-metadata-window-title`"
                        />
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>

            <TimeRangeModeSelector
                ref="timeRangeSelector"
                v-model="timeRange"
                clearable
                :data-test-id="dataTestId"
            />
        </div>

        <!------------ footer ------------->
        <v-divider />
        <div class="pa-4">
            <v-btn
                color="primary"
                variant="flat"
                block
                class="text-none"
                :data-testid="`${dataTestId}-search-button`"
                @click="handleSearch"
            >
                <v-icon start icon="mdi-magnify" />
                {{ $t("searchForm.search") }}
            </v-btn>
        </div>
    </v-form>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import {
    VBtn,
    VDivider,
    VExpansionPanel,
    VExpansionPanels,
    VExpansionPanelText,
    VExpansionPanelTitle,
    VForm,
    VIcon,
} from "vuetify/components";

import TimeRangeModeSelector from "@/components/widgets/searches/timeRange/TimeRangeModeSelector.vue";
import {
    buildTimeRangeSummary,
    computeTimeRange,
} from "@/components/widgets/searches/timeRange/timeRangeUtils";
import type { TimeRangeSelection } from "@/components/widgets/searches/timeRange/types";
import type {
    SpSearchFilterKey,
    SpSearchFilters,
    SpSearchFormState,
    SpSearchQuery,
} from "@/pages/(app)/sp-search/types";
import { createDefaultFormState } from "@/pages/(app)/sp-search/utils/searchFormState";
import * as spConstants from "@/utils/sp-constants";

import SpSearchField from "./SpSearchField.vue";

const props = withDefaults(
    defineProps<{
        // only read on setup; later changes go through `restore`
        initialState: SpSearchFormState;
        dataTestId?: string;
    }>(),
    { dataTestId: undefined },
);

const emit = defineEmits<{
    search: [query: SpSearchQuery];
    collapse: [];
}>();

const filters = reactive<SpSearchFilters>({ ...props.initialState.filters });

const timeRange = ref<TimeRangeSelection>({ ...props.initialState.timeRange });

const openGroups = ref<string[]>([]);
const timeRangeSelector = ref<InstanceType<typeof TimeRangeModeSelector>>();

const clearAllAvailable = computed(
    () =>
        Object.values(filters).some((value) => value !== "") ||
        timeRange.value.mode !== undefined,
);

onMounted(() => {
    handleSearch();
});

function handleSearch() {
    const [fromTime, toTime] = computeTimeRange(timeRange.value);

    emit("search", {
        filters: { ...filters },
        timeRange: { ...timeRange.value },
        fromTime,
        toTime,
        summary: buildTimeRangeSummary(timeRange.value, fromTime, toTime),
    });
}

// Keeps the form field in sync when the parent removes a submitted filter
// chip; the parent re-runs the search from its submitted snapshot.
function clearFilter(key: SpSearchFilterKey) {
    filters[key] = "";
}

function handleEscape() {
    if (timeRangeSelector.value?.isPickerOpen) {
        return;
    }
    handleReset();
}

// Replaces the draft, e.g. when back/forward navigation changes the URL, and
// runs the search right away.
function restore(state: SpSearchFormState) {
    Object.assign(filters, state.filters);
    timeRange.value = { ...state.timeRange };
    handleSearch();
}

// Resetting re-runs the default search right away (previous behaviour of the
// old form's "Cancel" button).
function handleReset() {
    restore(createDefaultFormState());
}

defineExpose({ clearFilter, restore, reset: handleReset });
</script>

<style scoped>
:deep(.v-field__input) {
    font-size: 0.8125rem;
}
</style>
