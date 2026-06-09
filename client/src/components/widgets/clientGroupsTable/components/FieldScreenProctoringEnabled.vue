<template>
    <template v-if="show">
        <v-icon
            :icon="
                item.screenProctoringEnabled
                    ? 'mdi-checkbox-marked-outline'
                    : 'mdi-checkbox-blank-outline'
            "
        />

        <span class="d-sr-only">
            {{
                item.screenProctoringEnabled
                    ? $t("general.true")
                    : $t("general.false")
            }}
        </span>
    </template>
</template>

<script setup lang="ts">
import { ClientGroupForTable } from "@/components/widgets/clientGroupsTable/types.ts";

defineProps<{
    item: ClientGroupForTable;
    show: boolean;
}>();
</script>
