<template>
    <v-data-table
        :headers="headers"
        :items="useTableItems().value"
        item-key="name"
        hide-default-footer
    >
        <template #top>
            <TableHeader :label="$t('clientGroups.entityNamePlural')">
                <ClientGroupCreate />
            </TableHeader>
        </template>
        <template #item.actions="{ item }">
            <div class="d-flex ga-2 justify-end">
                <ClientGroupUpdate :client-group="item" />
                <ClientGroupDelete :client-group="item" />
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { useTableItems } from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/clientGroupTable/composables/useTableItems";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const headers = [
    {
        title: t("createTemplateExam.steps.clientGroup.fields.name.label"),
        value: "name",
    },
    {
        title: t("createTemplateExam.steps.clientGroup.fields.type.label"),
        value: "type",
    },
    {
        title: t("createTemplateExam.steps.clientGroup.fields.actions.label"),
        value: "actions",
        align: "end" as const,
    },
];
</script>
