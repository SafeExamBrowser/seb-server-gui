<template>
    <v-col>
        <v-select
            v-model="selectValue"
            max-width="600"
            density="compact"
            :label="translate(label)"
            :disabled="disabled"
            hide-details
            :items="selectAttributes"
            variant="outlined"
            @update:model-value="modelValue.saveSingleValue(name, selectValue)"
        >
        </v-select>
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
import { SEBSettingsSingeValueModel, SEBValueAttributes } from "../../types.ts";

const props = defineProps<{
    modelValue: SEBSettingsSingeValueModel;
    name: string;
    label: string;
    labels?: boolean;
    tooltip?: boolean;
    disabled?: boolean;
}>();

const selectValue = ref<string>(props.modelValue.getStringValue(props.name));
const selectAttributes = ref<SEBValueAttributes[]>(
    props.modelValue.getAttributes(
        props.name,
        props.labels ? props.label : null,
    ),
);

// defineExpose({
//     selectValue,
// });
</script>
