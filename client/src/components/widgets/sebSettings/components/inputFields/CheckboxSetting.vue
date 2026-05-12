<template>
    <v-col class="pt-1 pb-1 pl-0">
        <v-checkbox-btn
            v-model="boolVal"
            max-width="600"
            :disabled="disabled"
            :label="translate(label)"
            @update:model-value="save"
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
import { translate } from "@/utils/generalUtils.ts";
import { SEBSettingsSingeValueModel } from "@/components/widgets/sebSettings/types.ts";

const props = defineProps<{
    modelValue: SEBSettingsSingeValueModel;
    name: string;
    label: string;
    tooltip?: boolean;
    disabled?: boolean;
    invertValue?: boolean;
}>();

const boolVal = ref<boolean>(getValue());

defineExpose({
    boolVal,
});

const emit = defineEmits(["saved"]);

async function save() {
    var value: string = props.invertValue
        ? boolVal.value
            ? "false"
            : "true"
        : boolVal.value
          ? "true"
          : "false";
    props.modelValue.saveSingleValue(props.name, value);
    emit("saved");
}

function getValue(): boolean {
    if (props.invertValue) {
        return !props.modelValue.getBooleanValue(props.name);
    } else {
        return props.modelValue.getBooleanValue(props.name);
    }
}
</script>
