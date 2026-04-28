<template>
    <v-col class="pt-1 pb-1">
        <v-text-field
            v-model="textVal"
            density="compact"
            :disabled="disabled"
            :label="showLabel ? translate(label) : ''"
            variant="outlined"
            hide-details
            @update:focused="saveOnFocusLost($event)"
        >
        </v-text-field>
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
}>();

const textVal = ref<string>(props.modelValue.getStringValue(props.name));

defineExpose({
    textVal,
});

async function saveOnFocusLost(focusIn: boolean) {
    if (!focusIn) {
        if (textVal.value) {
            props.modelValue.saveSingleValue(props.name, textVal.value);
        } else {
            props.modelValue.saveSingleValue(props.name, "");
        }
    }
}
</script>
