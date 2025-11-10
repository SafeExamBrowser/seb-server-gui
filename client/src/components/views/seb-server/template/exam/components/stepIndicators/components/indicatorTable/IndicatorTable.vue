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
                    :get-item="getEmptyItem"
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
                <IndicatorUpdate :indicator="item" />
                <CrudDelete :item="item" :delete-item="deleteItem" />
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { useTable } from "./composables/useTable";
import IndicatorUpdate from "@/components/views/seb-server/template/exam/components/stepIndicators/components/IndicatorUpdate.vue";

const { headers, items, deleteItem, createItem, getEmptyItem, getFormFields } =
    useTable();
</script>
