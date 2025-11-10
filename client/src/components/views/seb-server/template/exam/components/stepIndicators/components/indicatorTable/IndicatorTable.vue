<template>
    <v-data-table
        :headers="headers"
        :items="items"
        item-key="name"
        hide-default-footer
    >
        <template #top>
            <TableHeader :label="$t('indicators.entityNamePlural')">
                <CrudCreate
                    :label="$t('indicators.addDialogTitle')"
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
                    `createTemplateExam.steps.indicators.fields.type.types.${item.type}`,
                )
            }}
        </template>
        <template #item.actions="{ item }">
            <div class="d-flex ga-2 justify-end">
                <CrudUpdate
                    :label="$t('indicators.editDialogTitle')"
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
import CrudUpdate from "@/components/widgets/crud/CrudUpdate.vue";
import CrudDelete from "@/components/widgets/crud/CrudDelete.vue";
import CrudCreate from "@/components/widgets/crud/CrudCreate.vue";

const {
    headers,
    items,
    createItem,
    updateItem,
    deleteItem,
    getNewItem,
    getExistingItem,
    getFormFields,
} = useTable();
</script>
