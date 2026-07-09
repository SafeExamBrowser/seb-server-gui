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
                {{ $t("titles.spApplications") }}
            </span>
            <v-btn
                variant="text"
                color="primary"
                size="small"
                class="text-none"
                :data-testid="`${dataTestId}-search-cancel-button`"
                @click="handleReset"
            >
                <v-icon start size="small" icon="mdi-refresh" />
                {{ $t("searchForm.resetAll") }}
            </v-btn>
            <v-btn
                icon="mdi-chevron-left"
                variant="text"
                size="small"
                density="comfortable"
                :aria-label="$t('searchForm.hideSearch')"
                :data-testid="`${dataTestId}-collapse-button`"
                @click="emit('collapse')"
            />
        </div>

        <!------------ body ------------->
        <div
            class="flex-grow-1 overflow-y-auto px-4 py-3"
            :style="{ minHeight: 0 }"
        >
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
import { onMounted, ref } from "vue";
import TimeRangeModeSelector from "@/components/widgets/searches/timeRange/TimeRangeModeSelector.vue";
import {
    buildTimeRangeSummary,
    computeTimeRange,
} from "@/components/widgets/searches/timeRange/timeRangeUtils";
import type { TimeRangeSelection } from "@/components/widgets/searches/timeRange/types";
import type { ApplicationsSearchQuery } from "@/pages/(app)/applications-search/types";

withDefaults(
    defineProps<{
        dataTestId?: string;
    }>(),
    { dataTestId: undefined },
);

const emit = defineEmits<{
    search: [query: ApplicationsSearchQuery];
    collapse: [];
}>();

const createDefaultTimeRange = (): TimeRangeSelection => ({
    mode: undefined,
    periodAmount: 1,
    periodUnit: 4,
    fromDate: undefined,
    fromTime: "00:00",
    toDate: undefined,
    toTime: "23:59",
});

const timeRange = ref<TimeRangeSelection>(createDefaultTimeRange());
const timeRangeSelector = ref<InstanceType<typeof TimeRangeModeSelector>>();

onMounted(() => {
    handleSearch();
});

function handleSearch() {
    const [fromTime, toTime] = computeTimeRange(timeRange.value);

    emit("search", {
        fromTime,
        toTime,
        summary: buildTimeRangeSummary(timeRange.value, fromTime, toTime),
    });
}

function handleEscape() {
    if (timeRangeSelector.value?.isPickerOpen) {
        return;
    }
    handleReset();
}

// Resetting re-runs the default unbounded search right away, mirroring the
// screen proctoring search form.
function handleReset() {
    timeRange.value = createDefaultTimeRange();
    handleSearch();
}
</script>

<style scoped>
:deep(.v-field__input) {
    font-size: 0.8125rem;
}
</style>
