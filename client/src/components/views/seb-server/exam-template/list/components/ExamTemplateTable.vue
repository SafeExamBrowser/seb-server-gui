<template>
    <v-data-table-server
        hover
        :headers="headers"
        :items="items"
        :items-length="itemsLength"
        :loading="isLoading"
        :items-per-page-options="[10, 20, 50, 100]"
        :sort-by="sortBy"
        @update:options="handleOptionsUpdate"
        @click:row="handleRowClick"
    >
        <template #[`item.description`]="{ item }">
            {{ formatDescription(item) }}
        </template>
        <template #[`item.examType`]="{ item }">
            <v-chip size="small" variant="tonal">
                {{ formatExamType(item) }}
            </v-chip>
        </template>
        <template #[`item.actions`]="{ item }">
            <ActionButton
                icon="mdi-pencil"
                :title="$t('general.editButton')"
                :to="getDetailRoute(item)"
            />
            <ActionButtonCopy :item="item" @changed="emit('update:items')" />
            <ActionButtonDelete :item="item" @changed="emit('update:items')" />
        </template>
    </v-data-table-server>
</template>

<script setup lang="ts">
import { ExamTemplate } from "@/models/seb-server/examTemplate";
import { DataTableHeader } from "vuetify";
import i18n from "@/i18n";
import ActionButton from "@/components/views/seb-server/exam-template/list/components/ActionButton.vue";
import ActionButtonDelete from "@/components/views/seb-server/exam-template/list/components/ActionButtonDelete.vue";
import ActionButtonCopy from "@/components/views/seb-server/exam-template/list/components/ActionButtonCopy.vue";
import { tableOptionsSchema, type TableOptions } from "../types";
import { getRouteName } from "@/router/routeNames";
import { navigateToRoute } from "@/router/navigation";

const emit = defineEmits<{
    (e: "update:items"): void;
    (e: "update:options", options: TableOptions): void;
}>();

defineProps<{
    items: ExamTemplate[];
    headers: DataTableHeader<ExamTemplate>[];
    itemsLength: number;
    isLoading: boolean;
    sortBy: { key: string; order: "asc" | "desc" }[];
}>();

const handleOptionsUpdate = (options: unknown) => {
    emit("update:options", tableOptionsSchema.parse(options));
};

const formatDescription = (item: ExamTemplate) => {
    if (!item.description) {
        return "";
    }

    return item.description;
};

const formatExamType = (item: ExamTemplate) => {
    // TODO @alain: once we have proper api type abstractions, this can be simplified
    if (!item.examType) {
        return "";
    }

    return i18n.global.t(item.examType);
};

const getDetailRoute = (item: ExamTemplate) => ({
    name: getRouteName("ExamTemplateDetail"),
    params: { examTemplateId: item.id },
});

const handleRowClick = (_event: Event, row: { item: ExamTemplate }) => {
    navigateToRoute(getDetailRoute(row.item));
};
</script>
