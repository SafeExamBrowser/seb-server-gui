<template>
    <v-col class="pt-0 pb-0 pl-0">
        <v-slider
            v-model="numVal"
            :max="max"
            :min="min"
            :step="step"
            :disabled="sebSettingsStore.readonly || disabled"
            hide-details
            @update:focused="
                sebSettingsStore.saveSingleValue(name, numVal.toString())
            "
        ></v-slider>
    </v-col>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";

const sebSettingsStore = useSEBSettingsStore();
const numVal = ref<number>(0);

const props = defineProps<{
    name: string;
    max: number;
    min: number;
    step: number;
    disabled?: boolean;
}>();

defineExpose({
    numVal,
});

onMounted(() => {
    numVal.value = sebSettingsStore.getNumberValue(props.name);
});
</script>
