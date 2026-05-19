<template>
    <v-col>
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
            @update:model-value="saveValue()"
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
import { translate } from "@/utils/generalUtils.ts";
import { SEBSettingsSingeValueModel } from "@/components/widgets/sebSettings/types.ts";

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

async function saveValue() {
    if (numberValue.value) {
        props.modelValue.saveSingleValue(
            props.name,
            numberValue.value.toString(),
        );
    } else {
        if (props.min) {
            numberValue.value = props.min;
            props.modelValue.saveSingleValue(props.name, props.min.toString());
        } else {
            props.modelValue.saveSingleValue(props.name, "");
        }
    }
}
</script>
