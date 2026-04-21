<template>
    <v-col class="pt-1 pb-1 pl-0">
        <v-checkbox-btn
            v-model="boolVal"
            max-width="600"
            :disabled="sebSettingsStore.readonly || disabled"
            :label="translate(label)"
            @update:model-value="
                sebSettingsStore.saveSingleValue(
                    name,
                    boolVal ? 'true' : 'false',
                )
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
import { ref, onMounted } from "vue";
import { translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";

const sebSettingsStore = useSEBSettingsStore();
const boolVal = ref<boolean>(false);

const props = defineProps<{
    name: string;
    label: string;
    tooltip?: boolean;
    disabled?: boolean;
}>();

defineExpose({
    boolVal,
});

onMounted(() => {
    boolVal.value = sebSettingsStore.getBooleanValue(props.name);
});
</script>
