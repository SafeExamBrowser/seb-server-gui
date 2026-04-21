<template>
    <v-col>
        <v-select
            v-model="selectValue"
            density="compact"
            :label="translate(label)"
            :disabled="sebSettingsStore.readonly || disabled"
            hide-details
            :items="selectAttributes"
            variant="outlined"
            @update:model-value="
                sebSettingsStore.saveSingleValue(name, selectValue)
            "
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
import { ref, onMounted } from "vue";
import { translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";

const sebSettingsStore = useSEBSettingsStore();
const props = defineProps<{
    name: string;
    label: string;
    labels?: boolean;
    tooltip?: boolean;
    disabled?: boolean;
}>();

const selectValue = ref<string>("");
const selectAttributes = ref<{ title: string; value: string }[]>([]);

defineExpose({
    selectValue,
});

onMounted(() => {
    selectValue.value = sebSettingsStore.getStringValue(props.name);
    sebSettingsStore.applyAttributes(
        props.name,
        props.labels ? props.label : null,
        selectAttributes.value,
    );
});
</script>
