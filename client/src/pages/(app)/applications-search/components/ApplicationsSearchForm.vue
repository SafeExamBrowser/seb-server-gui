<template>
    <v-form
        class="d-flex flex-column h-100"
        :data-testid="`${dataTestId}-filters-container`"
        @keyup.enter="handleSearch"
        @keyup.esc="handleReset"
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
                {{ $t("applicationsSearch.resetAll") }}
            </v-btn>
            <v-btn
                icon="mdi-chevron-left"
                variant="text"
                size="small"
                density="comfortable"
                :aria-label="$t('applicationsSearch.hideSearch')"
                :data-testid="`${dataTestId}-collapse-button`"
                @click="emit('collapse')"
            />
        </div>

        <!------------ body ------------->
        <div
            class="flex-grow-1 overflow-y-auto px-4 py-3"
            :style="{ minHeight: 0 }"
        >
            <v-radio-group v-model="mode" hide-details density="comfortable">
                <!------------ Period ------------->
                <v-sheet
                    border
                    rounded="lg"
                    class="pa-3 mb-4"
                    :color="isPeriod ? 'blue-lighten-5' : undefined"
                    :class="{ 'opacity-60': !isPeriod }"
                >
                    <v-radio value="period">
                        <template #label>
                            <span
                                class="text-caption text-uppercase font-weight-bold text-high-emphasis"
                            >
                                {{ $t("searchForm.period") }}
                            </span>
                        </template>
                    </v-radio>

                    <div class="d-flex align-center ga-2 mt-2">
                        <span class="text-body-2 font-weight-medium">
                            {{ $t("searchForm.last") }}
                        </span>
                        <v-text-field
                            v-model.number="timePeriodField"
                            :aria-label="$t('searchForm.last')"
                            type="number"
                            min="1"
                            density="compact"
                            hide-details
                            single-line
                            variant="outlined"
                            :disabled="!isPeriod"
                            :style="{ maxWidth: '84px' }"
                            :data-testid="`${dataTestId}-period-amount`"
                        />
                        <v-select
                            v-model="timePeriodSelect"
                            :items="unitItems"
                            density="compact"
                            hide-details
                            variant="outlined"
                            :disabled="!isPeriod"
                            :data-testid="`${dataTestId}-period-unit`"
                        />
                    </div>
                </v-sheet>

                <!------------ Between ------------->
                <v-sheet
                    border
                    rounded="lg"
                    class="pa-3"
                    :color="isBetween ? 'blue-lighten-5' : undefined"
                    :class="{ 'opacity-60': !isBetween }"
                >
                    <v-radio value="between">
                        <template #label>
                            <span
                                class="text-caption text-uppercase font-weight-bold text-high-emphasis"
                            >
                                {{ $t("searchForm.between") }}
                            </span>
                        </template>
                    </v-radio>

                    <!-- From: start date + start time -->
                    <div
                        class="d-flex align-center ga-1 text-caption text-uppercase font-weight-bold text-medium-emphasis mt-3 mb-1"
                    >
                        <v-icon
                            icon="mdi-calendar-outline"
                            size="x-small"
                            color="primary"
                        />
                        {{ $t("applicationsSearch.from") }}
                    </div>
                    <v-row dense>
                        <v-col cols="7">
                            <v-text-field
                                :model-value="formatDate(fromDate)"
                                :label="$t('applicationsSearch.startDate')"
                                :disabled="!isBetween"
                                density="compact"
                                hide-details
                                prepend-inner-icon="mdi-calendar"
                                readonly
                                variant="outlined"
                                :data-testid="`${dataTestId}-from-date`"
                            >
                                <v-menu
                                    v-model="fromDateMenu"
                                    :close-on-content-click="false"
                                    activator="parent"
                                    min-width="0"
                                >
                                    <v-date-picker
                                        v-model="fromDate"
                                        hide-header
                                        show-adjacent-months
                                        @update:model-value="
                                            fromDateMenu = false
                                        "
                                    />
                                </v-menu>
                            </v-text-field>
                        </v-col>
                        <v-col cols="5">
                            <v-text-field
                                :model-value="fromTime"
                                :label="$t('applicationsSearch.startTime')"
                                :disabled="!isBetween"
                                density="compact"
                                hide-details
                                prepend-inner-icon="mdi-clock-time-four-outline"
                                readonly
                                variant="outlined"
                                :data-testid="`${dataTestId}-from-time`"
                            >
                                <v-menu
                                    v-model="fromTimeMenu"
                                    :close-on-content-click="false"
                                    activator="parent"
                                    min-width="0"
                                >
                                    <v-time-picker
                                        v-model="fromTime"
                                        format="24hr"
                                    />
                                </v-menu>
                            </v-text-field>
                        </v-col>
                    </v-row>

                    <v-divider class="my-3" />

                    <!-- To: end date + end time -->
                    <div
                        class="d-flex align-center ga-1 text-caption text-uppercase font-weight-bold text-medium-emphasis mb-1"
                    >
                        <v-icon
                            icon="mdi-calendar-clock"
                            size="x-small"
                            color="primary"
                        />
                        {{ $t("applicationsSearch.to") }}
                    </div>
                    <v-row dense>
                        <v-col cols="7">
                            <v-text-field
                                :model-value="formatDate(toDate)"
                                :label="$t('applicationsSearch.endDate')"
                                :disabled="!isBetween"
                                density="compact"
                                hide-details
                                prepend-inner-icon="mdi-calendar"
                                readonly
                                variant="outlined"
                                :data-testid="`${dataTestId}-to-date`"
                            >
                                <v-menu
                                    v-model="toDateMenu"
                                    :close-on-content-click="false"
                                    activator="parent"
                                    min-width="0"
                                >
                                    <v-date-picker
                                        v-model="toDate"
                                        hide-header
                                        show-adjacent-months
                                        @update:model-value="toDateMenu = false"
                                    />
                                </v-menu>
                            </v-text-field>
                        </v-col>
                        <v-col cols="5">
                            <v-text-field
                                :model-value="toTime"
                                :label="$t('applicationsSearch.endTime')"
                                :disabled="!isBetween"
                                density="compact"
                                hide-details
                                prepend-inner-icon="mdi-clock-time-four-outline"
                                readonly
                                variant="outlined"
                                :data-testid="`${dataTestId}-to-time`"
                            >
                                <v-menu
                                    v-model="toTimeMenu"
                                    :close-on-content-click="false"
                                    activator="parent"
                                    min-width="0"
                                >
                                    <v-time-picker
                                        v-model="toTime"
                                        format="24hr"
                                    />
                                </v-menu>
                            </v-text-field>
                        </v-col>
                    </v-row>
                </v-sheet>
            </v-radio-group>
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
                {{ $t("applicationsSearch.search") }}
            </v-btn>
        </div>
    </v-form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import * as timeUtils from "@/utils/timeUtils";
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

const { t } = useI18n();

// form state (mirrors the previous Period / Between search form)
const mode = ref<"period" | "between">("period");
const timePeriodField = ref<number>(1);
const timePeriodSelect = ref<number>(4);

// "Between" is split into four fields (start/end date + time). Each date field
// opens a v-date-picker and each time field a v-time-picker via a parent menu.
const fromDate = ref<Date>();
const fromTime = ref<string>("00:00");
const toDate = ref<Date>();
const toTime = ref<string>("23:59");
const fromDateMenu = ref<boolean>(false);
const fromTimeMenu = ref<boolean>(false);
const toDateMenu = ref<boolean>(false);
const toTimeMenu = ref<boolean>(false);

const isPeriod = computed(() => mode.value === "period");
const isBetween = computed(() => mode.value === "between");

const unitItems = computed(() => [
    { title: t("timePeriod.day"), value: 1 },
    { title: t("timePeriod.week"), value: 2 },
    { title: t("timePeriod.month"), value: 3 },
    { title: t("timePeriod.year"), value: 4 },
]);

onMounted(() => {
    // preserve the previous behaviour of searching immediately on load
    handleSearch();
});

function buildSummary(fromTime: string, toTime: string): string {
    if (isPeriod.value) {
        const unitLabel =
            unitItems.value.find(
                (unit) => unit.value === timePeriodSelect.value,
            )?.title ?? "";
        return `${t("searchForm.last")} ${timePeriodField.value} ${unitLabel}`;
    }

    if (!fromTime || !toTime) {
        return t("searchForm.between");
    }

    return `${timeUtils.formatTimestampToFullDate(
        Number(fromTime),
    )} → ${timeUtils.formatTimestampToFullDate(Number(toTime))}`;
}

function formatDate(date?: Date): string {
    if (!date) {
        return "";
    }
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    return `${day}.${month}.${date.getFullYear()}`;
}

// Combine the four "Between" fields into [fromTime, toTime] millisecond strings.
// Returns empty strings until both dates are picked (matches the old cleared-range behaviour).
function computeBetweenRange(): [string, string] {
    if (!fromDate.value || !toDate.value) {
        return ["", ""];
    }

    const from = timeUtils.getTimestampFromDateAndTime(
        new Date(fromDate.value),
        fromTime.value,
    );
    const to = timeUtils.getTimestampFromDateAndTime(
        new Date(toDate.value),
        toTime.value,
    );
    return [from.toString(), to.toString()];
}

function handleSearch() {
    const [fromTimestamp, toTimestamp] = isPeriod.value
        ? timeUtils.calcTimePeriod(
              timePeriodSelect.value,
              timePeriodField.value,
          )
        : computeBetweenRange();

    emit("search", {
        fromTime: fromTimestamp,
        toTime: toTimestamp,
        summary: buildSummary(fromTimestamp, toTimestamp),
    });
}

function handleReset() {
    mode.value = "period";
    timePeriodField.value = 1;
    timePeriodSelect.value = 2;
    fromDate.value = undefined;
    fromTime.value = "00:00";
    toDate.value = undefined;
    toTime.value = "23:59";
    handleSearch();
}
</script>
