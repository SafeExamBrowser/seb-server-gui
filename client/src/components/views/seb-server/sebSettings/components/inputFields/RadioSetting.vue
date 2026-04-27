<template>
    <v-col class="pt-0 pb-0 pl-0">
        <v-radio-group
            v-model="radioValue"
            :disabled="disabled"
            hide-details
            :label="showLabel ? translate(label + '.title') : ''"
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
        <v-tooltip
            v-if="labelTooltip"
            activator="parent"
            location="top left"
            max-width="400"
        >
            {{ translate(props.label + "_tooltip") }}
        </v-tooltip>
    </v-col>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { translate } from "@/utils/generalUtils";
import { SEBSettingsSingeValueModel, SEBValueAttributes } from "../../types";

const props = defineProps<{
    modelValue: SEBSettingsSingeValueModel;
    name: string;
    label: string;
    showLabel?: boolean;
    labelTooltip?: boolean;
    tooltip?: boolean;
    disabled?: boolean;
}>();

const radioValue = ref<string>(props.modelValue.getStringValue(props.name));
const radioAttributes = ref<SEBValueAttributes[]>(
    props.modelValue.getAttributes(props.name, null),
);

defineExpose({
    radioValue,
});

const emit = defineEmits(["saved"]);

async function save() {
    props.modelValue.saveSingleValue(props.name, radioValue.value);
    emit("saved");
}
</script>
