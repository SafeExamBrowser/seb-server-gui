<template>
    <v-data-table-server
        :headers="headers"
        :items="items"
        :items-length="itemsLength"
        :loading="isLoading"
        @update:options="handleOptionsUpdate"
    >
        <template #[`item.description`]="{ item }">
            {{ formatDescription(item) }}
        </template>
        <template #[`item.examType`]="{ item }">
            {{ formatExamType(item) }}
        </template>
        <template #[`item.actions`]="{ item }">
            <ActionButton
                icon="mdi-pencil"
                :title="$t('general.editButton')"
                @click="handleEdit(item)"
            />
            <ActionButton
                icon="mdi-content-copy"
                :title="$t('general.copyButton')"
                @click="handleCopy(item)"
            />
            <ActionButtonDelete :item="item" @changed="emit('update:items')" />
        </template>
    </v-data-table-server>
</template>

<script setup lang="ts">
import { ExamTemplate } from "@/models/seb-server/examTemplate";
import { DataTableHeader } from "vuetify";
import i18n from "@/i18n";
import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import ActionButton from "@/components/views/seb-server/exam-template/list/components/ActionButton.vue";
import ActionButtonDelete from "@/components/views/seb-server/exam-template/list/components/ActionButtonDelete.vue";
import { tableOptionsSchema, type TableOptions } from "../types";

const emptyValue = "–";

const emit = defineEmits<{
    (e: "update:items"): void;
    (e: "update:options", options: TableOptions): void;
}>();

defineProps<{
    items: ExamTemplate[];
    headers: DataTableHeader<ExamTemplate>[];
    itemsLength: number;
    isLoading: boolean;
}>();

const handleOptionsUpdate = (options: unknown) => {
    emit("update:options", tableOptionsSchema.parse(options));
};

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

const handleEdit = (item: ExamTemplate) => {
    // TODO @alain: navigate to edit page
    console.log("edit", item.name, item.id);
};

const handleCopy = (item: ExamTemplate) => {
    // TODO @alain: copy via server
    console.log("copy", item.name, item.id);
};
</script>
