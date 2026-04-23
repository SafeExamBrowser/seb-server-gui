<template>
    <v-col class="pt-1 pb-1 pl-0">
        <v-checkbox-btn
            v-model="boolVal"
            max-width="600"
            :disabled="disabled"
            :label="translate(label)"
            @update:model-value="
                modelValue.saveSingleValue(name, boolVal ? 'true' : 'false')
            "
        ></v-checkbox-btn>
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
    tooltip?: boolean;
    disabled?: boolean;
}>();

const boolVal = ref<boolean>(props.modelValue.getBooleanValue(props.name));

defineExpose({
    boolVal,
});
</script>
