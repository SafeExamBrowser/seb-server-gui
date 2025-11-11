<template>
    <v-data-table
        :headers="headers"
        :items="items"
        item-key="name"
        hide-default-footer
    >
        <template #top>
            <TableHeader :label="$t('clientGroups.entityNamePlural')">
                <CrudCreate
                    :label="$t('clientGroups.addDialogTitle')"
                    form-id="form-client-group-create"
                    :disabled="!allowCreate"
                    :get-form-fields="getFormFields"
                    :get-item="getNewItem"
                    :create-item="createItem"
                />
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
                <CrudUpdate
                    :label="$t('clientGroups.editDialogTitle')"
                    form-id="form-client-group-update"
                    :get-form-fields="getFormFields"
                    :get-item="() => getExistingItem(item)"
                    :update-item="updateItem"
                />
                <CrudDelete :item="item" :delete-item="deleteItem" />
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { useTable } from "./composables/useTable";
import CrudCreate from "@/components/widgets/crud/CrudCreate.vue";
import CrudUpdate from "@/components/widgets/crud/CrudUpdate.vue";
import CrudDelete from "@/components/widgets/crud/CrudDelete.vue";
import FieldScreenProctoringEnabled from "@/components/views/seb-server/template/exam/components/stepClientGroup/components/FieldScreenProctoringEnabled.vue";

const {
    headers,
    items,
    allowCreate,
    createItem,
    updateItem,
    deleteItem,
    getNewItem,
    getExistingItem,
    hasActions,
    getFormFields,
} = useTable();
</script>
