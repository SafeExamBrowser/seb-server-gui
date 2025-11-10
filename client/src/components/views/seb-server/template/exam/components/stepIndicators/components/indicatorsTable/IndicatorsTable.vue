<template>
    <v-data-table
        :headers="headers"
        :items="items"
        item-key="name"
        hide-default-footer
    >
        <template #top>
            <TableHeader :label="$t('indicators.entityNamePlural')">
                <IndicatorCreate />
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
            <div class="d-flex ga-2 justify-end">
                <IndicatorUpdate :indicator="item" />
                <IndicatorDelete :indicator="item" />
            </div>
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { useTable } from "./composables/useTable";
import IndicatorCreate from "@/components/views/seb-server/template/exam/components/stepIndicators/components/IndicatorCreate.vue";
import IndicatorDelete from "@/components/views/seb-server/template/exam/components/stepIndicators/components/IndicatorDelete.vue";
import IndicatorUpdate from "@/components/views/seb-server/template/exam/components/stepIndicators/components/IndicatorUpdate.vue";

const { headers, items } = useTable();
</script>
