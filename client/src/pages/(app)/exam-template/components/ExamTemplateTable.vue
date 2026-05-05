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
                :to="examTemplateDetailRoute(item) ?? undefined"
            />
            <ActionButtonCopy :item="item" @changed="emit('update:items')" />
            <ActionButtonDelete :item="item" @changed="emit('update:items')" />
        </template>
    </v-data-table-server>
</template>

<script setup lang="ts">
import { ExamTemplate } from "@/models/seb-server/examTemplate.ts";
import { DataTableHeader } from "vuetify";
import i18n from "@/i18n";
import ActionButton from "@/pages/(app)/exam-template/components/ActionButton.vue";
import ActionButtonDelete from "@/pages/(app)/exam-template/components/ActionButtonDelete.vue";
import ActionButtonCopy from "@/pages/(app)/exam-template/components/ActionButtonCopy.vue";
import { tableOptionsSchema, type TableOptions } from "../types/types.ts";
import { useRouter } from "vue-router";
import type { RouteLocationAsRelative } from "vue-router";

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

const router = useRouter();

const examTemplateDetailRoute = (
    item: ExamTemplate,
): RouteLocationAsRelative | null =>
    item.id != null
        ? {
              name: "/(app)/exam-template/[id]/",
              params: { id: String(item.id) },
          }
        : null;

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

const handleRowClick = (_event: Event, row: { item: ExamTemplate }) => {
    const target = examTemplateDetailRoute(row.item);
    if (!target) {
        // TODO @andrei implement error handling
        return;
    }
    void router.push(target);
};
</script>
