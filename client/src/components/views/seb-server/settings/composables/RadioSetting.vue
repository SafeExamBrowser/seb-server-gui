<template>
    <v-col class="pt-0 pb-0 pl-0">
        <v-radio-group
            v-model="radioValue"
            :disabled="sebSettingsStore.readonly || disabled"
            hide-details
            @update:model-value="save"
        >
            <v-radio
                v-for="attribute in radioAttributes"
                :key="attribute.value"
                :label="translate(props.label + '.' + attribute.value)"
                :value="attribute.value"
            >
                <v-tooltip
                    v-if="tooltip"
                    activator="parent"
                    location="top left"
                    max-width="400"
                >
                    {{
                        translate(
                            props.label + "." + attribute.value + "_tooltip",
                        )
                    }}
                </v-tooltip>
            </v-radio>
        </v-radio-group>
    </v-col>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";

const sebSettingsStore = useSEBSettingsStore();

const radioValue = ref<string>("0");
const radioAttributes = ref<{ title: string; value: string }[]>([]);

const props = defineProps<{
    name: string;
    label: string;
    tooltip?: boolean;
    disabled?: boolean;
}>();

defineExpose({
    radioValue,
});

const emit = defineEmits(["saved"]);

onMounted(() => {
    radioValue.value = sebSettingsStore.getStringValue(props.name);
    sebSettingsStore.applyAttributes(props.name, null, radioAttributes.value);
});

async function save() {
    sebSettingsStore.saveSingleValue(props.name, radioValue.value);
    emit("saved");
}
</script>
