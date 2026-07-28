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
                    <ChipThreshold :threshold="threshold" />
                </template>
            </div>
        </template>
    </CrudTable>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import ChipThreshold from "@/components/widgets/chipThreshold/ChipThreshold.vue";
import CrudTable from "@/components/widgets/crudTable/CrudTable.vue";
import { useTable } from "@/components/widgets/indicatorsTable/composables/useTable.ts";
import { IndicatorsTableDeps } from "@/components/widgets/indicatorsTable/types.ts";
import { IndicatorExisting } from "@/models/seb-server/examTemplate.ts";

const { deps } = defineProps<{
    deps: IndicatorsTableDeps;
}>();

const { t } = useI18n();

const TYPE_LABEL_I18N_KEYS: Record<IndicatorExisting["type"], string> = {
    BATTERY_STATUS: "indicators.fields.type.types.BATTERY_STATUS",
    WLAN_STATUS: "indicators.fields.type.types.WLAN_STATUS",
};

const tableConfig = computed(() => useTable(deps));

const getTranslatedType = (item: IndicatorExisting) =>
    t(TYPE_LABEL_I18N_KEYS[item.type]);
</script>
