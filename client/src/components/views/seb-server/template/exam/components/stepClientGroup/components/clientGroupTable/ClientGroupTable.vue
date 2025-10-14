<template>
    <v-data-table
        :headers="headers"
        :items="items"
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
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { computed } from "vue";
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";

const { groups } = storeToRefs(useStepClientGroupStore());

// TODO @alain: move all of this somewhere outside (some custom composable maybe)
const fallbackGroup = computed<ClientGroup | undefined>(() => {
    const { collectionStrategy } = useScreenProctoringStore();
    if (!collectionStrategy) {
        return undefined;
    }

    if (collectionStrategy === "EXAM") {
        return {
            id: 0,
            type: "SCREEN_PROCTORING_SINGLE" as const,
            name: "Screen Proctoring Single Group" as const,
        };
    }

    return {
        id: 0,
        type: "SCREEN_PROCTORING_FALLBACK" as const,
        name: "Screen Proctoring Fallback Group" as const,
    };
});

const items = computed<ClientGroup[]>(() => {
    return [...groups.value, fallbackGroup.value].filter(
        (item) => item !== undefined,
    );
});

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
