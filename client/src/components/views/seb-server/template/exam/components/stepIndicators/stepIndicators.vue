<template>
    <StepItem
        :title="$t('createTemplateExam.steps.indicators.title')"
        :subtitle="$t('createTemplateExam.steps.indicators.subtitle')"
    >
        <CrudTable :config="useTable()">
            <template #item.type="{ item }">
                {{ getTranslatedType(item) }}
            </template>
            <template #item.thresholds="{ item }">
                <div class="d-flex flex-wrap ga-1 py-1">
                    <template
                        v-for="threshold in item.thresholds"
                        :key="threshold.value"
                    >
                        <ChipThreshold
                            :threshold="{
                                value: threshold.value,
                                color: threshold.color.slice(1), // strip the '#' from the hex color string
                            }"
                        />
                    </template>
                </div>
            </template>
        </CrudTable>
    </StepItem>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import CrudTable from "@/components/widgets/crudTable/CrudTable.vue";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import { useTable } from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/useTable";
import { Indicator } from "@/components/views/seb-server/template/exam/components/stepIndicators/types";
import ChipThreshold from "@/components/widgets/chipThreshold/ChipThreshold.vue";
const { t } = useI18n();

const getTranslatedType = (item: Indicator) =>
    t(`createTemplateExam.steps.indicators.fields.type.types.${item.type}`);
</script>
