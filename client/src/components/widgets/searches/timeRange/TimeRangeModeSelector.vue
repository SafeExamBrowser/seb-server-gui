<template>
    <v-radio-group v-model="selection.mode" hide-details density="comfortable">
        <!------------ Period ------------->
        <v-sheet
            border
            rounded="lg"
            class="pa-3 mb-4"
            :color="isPeriod ? 'blue-lighten-5' : undefined"
            :class="{ 'opacity-60': !isPeriod }"
        >
            <v-radio
                value="period"
                @pointerdown="handleRadioPointerdown"
                @keyup.space="handleRadioKeyup('period', $event)"
                @click="handleRadioClick('period')"
            >
                <template #label>
                    <span
                        class="text-body-small text-uppercase font-weight-bold text-high-emphasis"
                    >
                        {{ $t("searchForm.period") }}
                    </span>
                </template>
            </v-radio>

            <div class="d-flex align-center ga-2 mt-2">
                <span class="text-body-small font-weight-medium">
                    {{ $t("searchForm.last") }}
                </span>
                <v-text-field
                    v-model.number="selection.periodAmount"
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
                    v-model="selection.periodUnit"
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
            <v-radio
                value="between"
                @pointerdown="handleRadioPointerdown"
                @keyup.space="handleRadioKeyup('between', $event)"
                @click="handleRadioClick('between')"
            >
                <template #label>
                    <span
                        class="text-body-small text-uppercase font-weight-bold text-high-emphasis"
                    >
                        {{ $t("searchForm.between") }}
                    </span>
                </template>
            </v-radio>

            <!-- From: start date + start time -->
            <div
                class="d-flex align-center ga-1 text-body-small text-uppercase font-weight-bold text-medium-emphasis mt-3 mb-1"
            >
                <v-icon
                    icon="mdi-calendar-outline"
                    size="x-small"
                    color="primary"
                />
                {{ $t("searchForm.from") }}
            </div>
            <v-row density="comfortable">
                <v-col cols="7">
                    <v-text-field
                        :model-value="formatDate(selection.fromDate)"
                        :label="$t('searchForm.startDate')"
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
                                v-model="selection.fromDate"
                                color="primary"
                                hide-header
                                show-adjacent-months
                                @update:model-value="fromDateMenu = false"
                            />
                        </v-menu>
                    </v-text-field>
                </v-col>
                <v-col cols="5">
                    <v-text-field
                        :model-value="selection.fromTime"
                        :label="$t('searchForm.startTime')"
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
                                v-model="selection.fromTime"
                                color="primary"
                                format="24hr"
                            />
                        </v-menu>
                    </v-text-field>
                </v-col>
            </v-row>

            <v-divider class="my-3" />

            <!-- To: end date + end time -->
            <div
                class="d-flex align-center ga-1 text-body-small text-uppercase font-weight-bold text-medium-emphasis mb-1"
            >
                <v-icon
                    icon="mdi-calendar-clock"
                    size="x-small"
                    color="primary"
                />
                {{ $t("searchForm.to") }}
            </div>
            <v-row density="comfortable">
                <v-col cols="7">
                    <v-text-field
                        :model-value="formatDate(selection.toDate)"
                        :label="$t('searchForm.endDate')"
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
                                v-model="selection.toDate"
                                color="primary"
                                hide-header
                                show-adjacent-months
                                @update:model-value="toDateMenu = false"
                            />
                        </v-menu>
                    </v-text-field>
                </v-col>
                <v-col cols="5">
                    <v-text-field
                        :model-value="selection.toTime"
                        :label="$t('searchForm.endTime')"
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
                                v-model="selection.toTime"
                                color="primary"
                                format="24hr"
                            />
                        </v-menu>
                    </v-text-field>
                </v-col>
            </v-row>
        </v-sheet>
    </v-radio-group>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { timePeriodUnits } from "@/components/widgets/searches/timeRange/timeRangeUtils";
import type {
    SearchTimeMode,
    TimeRangeSelection,
} from "@/components/widgets/searches/timeRange/types";

const props = withDefaults(
    defineProps<{
        dataTestId?: string;
        // Allow re-clicking the selected mode to de-select it (radios can't
        // natively be cleared).
        clearable?: boolean;
    }>(),
    { dataTestId: undefined, clearable: false },
);

const selection = defineModel<TimeRangeSelection>({ required: true });

// Each date field opens a v-date-picker and each time field a v-time-picker
// via a parent menu.
const fromDateMenu = ref<boolean>(false);
const fromTimeMenu = ref<boolean>(false);
const toDateMenu = ref<boolean>(false);
const toTimeMenu = ref<boolean>(false);

// The active mode captured before a pointer interaction, so re-clicking the
// selected option can de-select it.
let modeBeforeRadioClick: SearchTimeMode | undefined;

const isPeriod = computed(() => selection.value.mode === "period");
const isBetween = computed(() => selection.value.mode === "between");

const isPickerOpen = computed(
    () =>
        fromDateMenu.value ||
        fromTimeMenu.value ||
        toDateMenu.value ||
        toTimeMenu.value,
);

const unitItems = computed(() => timePeriodUnits());

function formatDate(date?: Date): string {
    if (!date) {
        return "";
    }
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    return `${day}.${month}.${date.getFullYear()}`;
}

function handleRadioPointerdown() {
    modeBeforeRadioClick = selection.value.mode;
}

function handleRadioClick(value: SearchTimeMode) {
    if (props.clearable && modeBeforeRadioClick === value) {
        selection.value.mode = undefined;
    }
}

// Space on the already-selected radio fires no click (browsers only
// synthesize one when the checked state changes), so keyboard de-selection
// happens on keyup. The default keyup activation must be cancelled, or the
// browser would re-check the radio right after the clear; selecting an
// unchecked radio is untouched since no clear (and no cancel) happens then.
function handleRadioKeyup(value: SearchTimeMode, event: KeyboardEvent) {
    if (props.clearable && selection.value.mode === value) {
        event.preventDefault();
        selection.value.mode = undefined;
    }
}

defineExpose({ isPickerOpen });
</script>
