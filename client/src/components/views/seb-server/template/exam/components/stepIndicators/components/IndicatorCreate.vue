<template>
    <IndicatorsDialog
        icon-activator="mdi-plus-circle-outline"
        color-activator="primary"
        :label-activator="$t('indicators.addDialogTitle')"
        :label-cancel="$t('general.cancelButton')"
        :label-submit="$t('general.createButton')"
        :get-indicator="getEmptyIndicator"
        @submit="handleCreate"
    />
</template>

<script setup lang="ts">
import {
    getEmptyIndicator,
    useStepIndicatorsStore,
} from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/store/useStepIndicatorsStore";
import { Indicator } from "@/components/views/seb-server/template/exam/components/stepIndicators/types";
import IndicatorsDialog from "./indicatorsDialog/IndicatorsDialog.vue";

const { createIndicator } = useStepIndicatorsStore();

const handleCreate = (indicator: Indicator) => {
    createIndicator(indicator);
};
</script>
