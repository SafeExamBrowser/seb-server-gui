<template>
    <IndicatorsDialog
        icon-activator="mdi-pencil"
        color-activator="medium-emphasis"
        size-activator="small"
        :label-activator="$t('clientGroups.editDialogTitle')"
        :label-cancel="$t('general.cancelButton')"
        :label-submit="$t('general.saveButton')"
        :get-indicator="getIndicator"
        @submit="handleUpdate"
    />
</template>

<script setup lang="ts">
import { useStepIndicatorsStore } from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/store/useStepIndicatorsStore";
import IndicatorsDialog from "@/components/views/seb-server/template/exam/components/stepIndicators/components/indicatorsDialog/IndicatorsDialog.vue";
import { Indicator } from "@/components/views/seb-server/template/exam/components/stepIndicators/types";
const { updateIndicator } = useStepIndicatorsStore();

const props = defineProps<{
    indicator: Indicator;
}>();

const getIndicator = () => {
    return {
        ...props.indicator,
    };
};

const handleUpdate = (indicator: Indicator) => {
    updateIndicator(indicator);
};
</script>
