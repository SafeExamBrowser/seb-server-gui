<template>
    <CrudDialog
        icon-activator="mdi-pencil"
        color-activator="medium-emphasis"
        size-activator="small"
        :label-activator="$t('indicators.editDialogTitle')"
        :label-cancel="$t('general.cancelButton')"
        :label-submit="$t('general.saveButton')"
        form-id="indicator-form"
        :get-form-fields="getFormFields"
        :get-item="() => ({ ...props.indicator })"
        @submit="handleUpdate"
    />
</template>

<script setup lang="ts">
import { useStepIndicatorsStore } from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/store/useStepIndicatorsStore";
import { useFormFields } from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/useFormFields";
import { IndicatorTransient } from "@/components/views/seb-server/template/exam/components/stepIndicators/types";
import { indicatorTransientToIndicator } from "@/components/views/seb-server/template/exam/components/stepIndicators/types";
import CrudDialog from "@/components/widgets/crud/CrudDialog.vue";
const { updateIndicator } = useStepIndicatorsStore();
const { getFormFields } = useFormFields();

const props = defineProps<{
    indicator: IndicatorTransient;
}>();

const handleUpdate = (indicator: IndicatorTransient) => {
    updateIndicator(indicatorTransientToIndicator(indicator));
};
</script>
