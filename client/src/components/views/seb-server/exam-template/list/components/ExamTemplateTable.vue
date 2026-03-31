<template>
    <v-data-table :headers="headers" :items="items">
        <template #[`item.description`]="{ item }">
            {{ formatDescription(item) }}
        </template>
        <template #[`item.examType`]="{ item }">
            {{ formatExamType(item) }}
        </template>
        <template #[`item.actions`]="{ item }">
            <ExamTemplateActionButton
                icon="mdi-delete"
                :title="$t('general.deleteButton')"
                :item="item"
                @click="handleDelete(item)"
            />
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { ExamTemplate } from "@/models/seb-server/examTemplate";
import { DataTableHeader } from "vuetify";
import i18n from "@/i18n";
import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import ExamTemplateActionButton from "./ExamTemplateActionButton.vue";

const emptyValue = "–";

defineProps<{
    items: ExamTemplate[];
    headers: DataTableHeader<ExamTemplate>[];
}>();

const formatDescription = (item: ExamTemplate) => {
    if (!item.description) {
        return emptyValue;
    }

    return item.description;
};

const formatExamType = (item: ExamTemplate) => {
    // TODO @alain: once we have proper api type abstractions, this can be simplified
    if (!item.examType || item.examType === ExamTypeEnum.UNDEFINED) {
        return emptyValue;
    }

    return i18n.global.t(item.examType);
};

const handleDelete = (item: ExamTemplate) => {
    // TODO @alain: delete on server
    console.log("delete", item.name, item.id);
};
</script>
