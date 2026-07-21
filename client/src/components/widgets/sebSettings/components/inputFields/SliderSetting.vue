<template>
    <v-col>
        <v-slider
            v-model="numVal"
            :max="max"
            :min="min"
            :step="step"
            :disabled="disabled"
            hide-details
            @update:focused="
                modelValue.saveSingleValue(name, numVal.toString())
            "
        ></v-slider>
    </v-col>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { SEBSettingsSingeValueModel } from "@/components/widgets/sebSettings/types.ts";

const props = defineProps<{
    modelValue: SEBSettingsSingeValueModel;
    name: string;
    max: number;
    min: number;
    step: number;
    disabled?: boolean;
}>();

const numVal = ref<number>(props.modelValue.getNumberValue(props.name));
</script>
