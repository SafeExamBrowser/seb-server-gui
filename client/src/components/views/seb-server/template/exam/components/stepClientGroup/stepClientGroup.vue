<template>
    <StepItem
        :title="$t('createTemplateExam.steps.clientGroup.title')"
        :subtitle="$t('createTemplateExam.steps.clientGroup.subtitle')"
    >
        <div class="d-flex flex-column ga-8">
            <ScreenProctoringForm v-if="useScreenProctoringStore().enabled" />
            <CrudTable :config="useTable()">
                <template #item.type="{ item }">
                    {{ getTranslatedType(item) }}
                </template>
                <template #item.screenProctoringEnabled="{ item }">
                    <FieldScreenProctoringEnabled :item="item" />
                </template>
            </CrudTable>
        </div>
    </StepItem>
</template>

<script setup lang="ts">
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";
import { ClientGroupForTable } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import CrudTable from "@/components/widgets/crudTable/CrudTable.vue";
import ScreenProctoringForm from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/screenProctoringForm/ScreenProctoringForm.vue";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import { useI18n } from "vue-i18n";
import { useTable } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/useTable";

const { t } = useI18n();

const getTranslatedType = (item: ClientGroupForTable) =>
    t(`createTemplateExam.steps.clientGroup.fields.type.types.${item.type}`);
</script>
