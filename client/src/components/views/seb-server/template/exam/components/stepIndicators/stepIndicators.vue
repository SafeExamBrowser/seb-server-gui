<template>
    <StepItem
        :title="$t('createTemplateExam.steps.indicators.title')"
        :subtitle="$t('createTemplateExam.steps.indicators.subtitle')"
    >
        <CrudTable :config="useTable()">
            <template #item.type="{ item }">
                {{ getTranslatedType(item) }}
            </template>
        </CrudTable>
    </StepItem>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import CrudTable from "@/components/widgets/crud/CrudTable.vue";
import { useTable } from "./composables/useTable";
import { Indicator } from "@/components/views/seb-server/template/exam/components/stepIndicators/types";
const { t } = useI18n();

const getTranslatedType = (item: Indicator) =>
    t(`createTemplateExam.steps.indicators.fields.type.types.${item.type}`);
</script>
