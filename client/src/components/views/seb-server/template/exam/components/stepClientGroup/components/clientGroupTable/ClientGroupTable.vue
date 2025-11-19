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
        <template #item.type="{ item }">
            {{
                item.type &&
                $t(
                    `createTemplateExam.steps.clientGroup.fields.type.types.${item.type}`,
                )
            }}
        </template>
        <template #item.screenProctoringEnabled="{ item }">
            <FieldScreenProctoringEnabled :item="item" />
        </template>
        <template #item.actions="{ item }">
            <div v-if="hasActions(item)" class="d-flex ga-2 justify-end">
                <ClientGroupUpdate :client-group="item" />
                <ClientGroupDelete :client-group="item" />
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { useTable } from "./composables/useTable";
import { ClientGroupForTable } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import FieldScreenProctoringEnabled from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/clientGroupTable/components/FieldScreenProctoringEnabled.vue";
import ClientGroupUpdate from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/ClientGroupUpdate.vue";
import ClientGroupDelete from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/ClientGroupDelete.vue";
import ClientGroupCreate from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/ClientGroupCreate.vue";
import TableHeader from "@/components/widgets/TableHeader.vue";
const { headers, items } = useTable();

const hasActions = (item: ClientGroupForTable) =>
    item.type !== "SCREEN_PROCTORING_SINGLE" &&
    item.type !== "SCREEN_PROCTORING_FALLBACK";
</script>
