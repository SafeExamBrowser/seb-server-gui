<template>
    <v-col class="pt-1 pb-1">
        <v-text-field
            v-model="textVal"
            density="compact"
            :disabled="sebSettingsStore.readonly || disabled"
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
import { ref, onMounted } from "vue";
import { translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";

const sebSettingsStore = useSEBSettingsStore();
const textVal = ref<string>("");

const props = defineProps<{
    name: string;
    label: string;
    showLabel?: boolean;
    tooltip?: boolean;
    disabled?: boolean;
}>();

defineExpose({
    textVal,
});

onMounted(() => {
    textVal.value = sebSettingsStore.getStringValue(props.name);
});

async function saveOnFocusLost(focusIn: boolean) {
    if (!focusIn) {
        if (textVal.value) {
            sebSettingsStore.saveSingleValue(props.name, textVal.value);
        } else {
            sebSettingsStore.saveSingleValue(props.name, "");
        }
    }
}
</script>
