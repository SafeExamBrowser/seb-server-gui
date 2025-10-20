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
        <template #item.actions="{ item }">
            <div v-if="hasActions(item)" class="d-flex ga-2 justify-end">
                <ClientGroupUpdate :client-group="item" />
                <ClientGroupDelete :client-group="item" />
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";
import { useTable } from "./composables/useTable";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";

const { headers, items } = useTable();

const hasActions = (item: ClientGroup) =>
    item.type === ClientGroupEnum.IP_V4_RANGE ||
    item.type === ClientGroupEnum.CLIENT_OS ||
    item.type === ClientGroupEnum.NAME_ALPHABETICAL_RANGE;
</script>
