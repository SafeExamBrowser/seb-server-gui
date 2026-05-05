<template>
    <v-col class="pt-5 pb-0 pl-3">
        <v-color-input
            v-model="colorValue"
            :disabled="disabled"
            mode="hex"
            max-width="300"
            :label="translate(label)"
            pip-location="append-inner"
            color-pip
            variant="outlined"
            density="compact"
            @update:model-value="modelValue.saveSingleValue(name, colorValue)"
        >
        </v-color-input>
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
    tooltip?: boolean;
    disabled?: boolean;
}>();

const colorValue = ref<string>(props.modelValue.getStringValue(props.name));
</script>
