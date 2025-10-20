<template>
    <template v-if="useScreenProctoringStore().enabled">
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
import { ClientGroupForTable } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";

const { item } = defineProps<{
    item: ClientGroupForTable;
}>();
</script>
