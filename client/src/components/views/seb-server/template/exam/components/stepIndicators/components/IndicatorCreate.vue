<template>
    <CrudDialog
        icon-activator="mdi-plus-circle-outline"
        color-activator="primary"
        :label-activator="$t('indicators.addDialogTitle')"
        :label-cancel="$t('general.cancelButton')"
        :label-submit="$t('general.createButton')"
        form-id="indicator-form"
        :get-form-fields="getFormFields"
        :get-item="getEmptyIndicator"
        @submit="handleCreate"
    />
</template>

<script setup lang="ts">
import {
    getEmptyIndicator,
    useStepIndicatorsStore,
} from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/store/useStepIndicatorsStore";
import {
    IndicatorTransient,
    indicatorTransientToIndicator,
} from "@/components/views/seb-server/template/exam/components/stepIndicators/types";
import CrudDialog from "@/components/widgets/crud/CrudDialog.vue";
import { useFormFields } from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/useFormFields";

const { createIndicator } = useStepIndicatorsStore();
const { getFormFields } = useFormFields();

const handleCreate = (indicator: IndicatorTransient) => {
    createIndicator(indicatorTransientToIndicator(indicator));
};
</script>
