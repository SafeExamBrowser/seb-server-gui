<template>
    <v-row>
        <v-col cols="2/3">
            <v-date-input
                v-if="model?.fromDate"
                v-bind="props.standardProperties"
                ref="fromDate"
                v-model="model.fromDate"
                :label="$t(`${props.label}.labelFrom`)"
                :rules="[checkValidDateRange]"
                append-inner-icon="mdi-calendar"
                density="compact"
                display-date-format="dd.MM.yyyy"
                prepend-icon=""
                variant="outlined"
                @update:focused="updateValidation"
            />
        </v-col>

        <v-col cols="1/3">
            <v-text-field
                v-if="model?.fromTime"
                ref="fromTime"
                :model-value="model.fromTime"
                :rules="[checkValidDateRange]"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                variant="outlined"
                density="compact"
                @update:focused="updateValidation"
            >
                <v-menu
                    v-model="showMenuFrom"
                    :close-on-content-click="false"
                    activator="parent"
                    min-width="0"
                >
                    <v-time-picker
                        v-model="model.fromTime"
                        format="24hr"
                    ></v-time-picker>
                </v-menu>
            </v-text-field>
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="2/3">
            <v-date-input
                v-if="model?.toDate"
                v-bind="props.standardProperties"
                ref="toDate"
                v-model="model.toDate"
                :label="$t(`${props.label}.labelTo`)"
                :rules="[checkValidDateRange]"
                append-inner-icon="mdi-calendar"
                density="compact"
                display-date-format="dd.MM.yyyy"
                prepend-icon=""
                variant="outlined"
                @update:focused="updateValidation"
            />
        </v-col>

        <v-col cols="1/3">
            <v-text-field
                v-if="model?.toTime"
                ref="toTime"
                :model-value="model.toTime"
                :rules="[checkValidDateRange]"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                variant="outlined"
                density="compact"
                @update:focused="updateValidation"
            >
                <v-menu
                    v-model="showMenuTo"
                    :close-on-content-click="false"
                    activator="parent"
                    min-width="0"
                >
                    <v-time-picker
                        v-model="model.toTime"
                        format="24hr"
                    ></v-time-picker>
                </v-menu>
            </v-text-field>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { FormFieldBaseProperties, TimeRange } from "../types";
import { ref, useTemplateRef } from "vue";
import { getTimestampFromDateAndTime } from "@/utils/timeUtils";
import i18n from "@/i18n";

const model = defineModel<TimeRange>();
const showMenuFrom = ref(false);
const showMenuTo = ref(false);

const props = defineProps<{
    label: string;
    standardProperties: FormFieldBaseProperties;
}>();

const fromDateRef = useTemplateRef("fromDate");
const fromTimeRef = useTemplateRef("fromTime");
const toDateRef = useTemplateRef("toDate");
const toTimeRef = useTemplateRef("toTime");

const checkValidDateRange = (): true | string => {
    if (!model.value) {
        return true;
    }
    if (
        getTimestampFromDateAndTime(
            model.value.fromDate,
            model.value.fromTime,
        ) < getTimestampFromDateAndTime(model.value.toDate, model.value.toTime)
    ) {
        return true;
    }
    return i18n.global.t("general.validation.invalidTimeRange");
};

function updateValidation(focus: boolean) {
    if (focus) {
        fromDateRef.value?.resetValidation();
        fromTimeRef.value?.resetValidation();
        toDateRef.value?.resetValidation();
        toTimeRef.value?.resetValidation();
    }
}
</script>
