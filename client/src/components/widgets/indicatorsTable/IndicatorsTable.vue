<template>
    <CrudTable :config="tableConfig">
        <template #item.type="{ item }">
            {{ getTranslatedType(item) }}
        </template>
        <template #item.thresholds="{ item }">
            <div class="d-flex flex-wrap ga-1 py-1">
                <template
                    v-for="threshold in item.thresholds"
                    :key="threshold.value"
                >
                    <ChipThreshold
                        :threshold="{
                            value: threshold.value,
                            color: threshold.color.slice(1), // strip the '#' from the hex color string
                        }"
                    />
                </template>
            </div>
        </template>
    </CrudTable>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import CrudTable from "@/components/widgets/crudTable/CrudTable.vue";
import ChipThreshold from "@/components/widgets/chipThreshold/ChipThreshold.vue";
import { useTable } from "@/components/widgets/indicatorsTable/composables/useTable.ts";
import {
    Indicator,
    IndicatorsTableDeps,
} from "@/components/widgets/indicatorsTable/types.ts";
import { computed } from "vue";

const { deps } = defineProps<{
    deps: IndicatorsTableDeps;
}>();

const { t } = useI18n();

const tableConfig = computed(() => useTable(deps));

const getTranslatedType = (item: Indicator) =>
    t(`indicators.fields.type.types.${item.type}`);
</script>
