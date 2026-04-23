<template>
    <v-col class="pt-1 pb-1">
        <v-number-input
            v-model="numberValue"
            density="compact"
            :disabled="disabled"
            :label="showLabel ? translate(label) : ''"
            variant="outlined"
            hide-details
            :min="min"
            :max="max"
            max-width="600"
            @update:focused="saveOnFocusLost($event)"
        >
        </v-number-input>
        <v-tooltip
            v-if="tooltip"
            activator="parent"
            location="top left"
            max-width="400"
        >
            {{ translate(label + "_tooltip") }}
        </v-tooltip>
    </v-col>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { translate } from "@/utils/generalUtils";
import { SEBSettingsSingeValueModel } from "../../types";

const props = defineProps<{
    modelValue: SEBSettingsSingeValueModel;
    name: string;
    label: string;
    showLabel?: boolean;
    tooltip?: boolean;
    disabled?: boolean;
    min?: number;
    max?: number;
}>();

const numberValue = ref<number>(
    Number(props.modelValue.getStringValue(props.name)),
);

defineExpose({
    numberValue,
});

async function saveOnFocusLost(focusIn: boolean) {
    if (!focusIn) {
        if (numberValue.value) {
            props.modelValue.saveSingleValue(
                props.name,
                numberValue.value.toString(),
            );
        } else {
            props.modelValue.saveSingleValue(props.name, "");
        }
    }
}
</script>
