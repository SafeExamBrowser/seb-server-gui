<template>
    <v-data-table
        :headers="headers"
        :items="items"
        item-key="name"
        hide-default-footer
    >
        <template #top>
            <TableHeader :label="$t('indicators.entityNamePlural')">
                <!-- TODO @alain: implement create -->
                <!-- <IndicatorCreate /> -->
            </TableHeader>
        </template>

        <!-- TODO @alain: i18n as soon as there is data -->
        <template #item.type="{ item }">
            {{
                item.type &&
                $t(
                    `createTemplateExam.steps.indicators.fields.type.types.${item.type}`,
                )
            }}
        </template>
        <template #item.actions="{ item }">
            <!--  TODO @alain: implement update/delete -->
            <div class="d-flex ga-2 justify-end">
                <!-- <IndicatorUpdate :indicator="item" />
                <IndicatorDelete :indicator="item" /> -->
                {{ item.id }}
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { useTable } from "./composables/useTable";
const { headers, items } = useTable();
</script>
