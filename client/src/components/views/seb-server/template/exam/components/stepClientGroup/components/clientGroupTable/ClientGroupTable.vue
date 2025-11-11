<template>
    <CrudTable :config="useTable()">
        <template #item.type="{ item }">
            {{ getTranslatedType(item) }}
        </template>
        <template #item.screenProctoringEnabled="{ item }">
            <FieldScreenProctoringEnabled :item="item" />
        </template>
    </CrudTable>
</template>

<script setup lang="ts">
import { ClientGroupForTable } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { useTable } from "./composables/useTable";
import CrudTable from "@/components/widgets/crud/CrudTable.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const getTranslatedType = (item: ClientGroupForTable) =>
    t(`createTemplateExam.steps.clientGroup.fields.type.types.${item.type}`);
</script>
