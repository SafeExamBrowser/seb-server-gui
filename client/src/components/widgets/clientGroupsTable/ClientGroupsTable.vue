<template>
    <CrudTable :config="tableConfig">
        <template #item.type="{ item }">
            {{ getTranslatedType(item) }}
        </template>
        <template #item.screenProctoringEnabled="{ item }">
            <FieldScreenProctoringEnabled
                :item="item"
                :show="showScreenProctoring(item)"
            />
        </template>
    </CrudTable>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRules } from "vuetify/labs/rules";

import FieldScreenProctoringEnabled from "@/components/widgets/clientGroupsTable/components/FieldScreenProctoringEnabled.vue";
import { useTable } from "@/components/widgets/clientGroupsTable/composables/useTable.ts";
import {
    ClientGroupForTable,
    ClientGroupsTableDeps,
    isFallbackGroup,
} from "@/components/widgets/clientGroupsTable/types.ts";
import CrudTable from "@/components/widgets/crudTable/CrudTable.vue";
import { isScreenProctoringAllowedForGroups } from "@/models/seb-server/screenProctoring.ts";

const { deps } = defineProps<{
    deps: ClientGroupsTableDeps;
}>();

const { t } = useI18n();
const rules = useRules();

const screenProctoringAllowedForGroups = computed<boolean>(() =>
    isScreenProctoringAllowedForGroups(
        deps.screenProctoring.enabled.value,
        deps.screenProctoring.collectionStrategy.value,
    ),
);

const tableConfig = computed(() =>
    useTable(deps, screenProctoringAllowedForGroups, rules),
);

const getTranslatedType = (item: ClientGroupForTable) =>
    t(`clientGroups.fields.type.types.${item.type}`);

const showScreenProctoring = (item: ClientGroupForTable) =>
    screenProctoringAllowedForGroups.value || isFallbackGroup(item);
</script>
