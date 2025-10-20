<template>
    <template v-if="showScreenProctoringEnabled">
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
import { storeToRefs } from "pinia";
import { computed } from "vue";

const { screenProctoringAllowedForGroups } = storeToRefs(
    useScreenProctoringStore(),
);

const showScreenProctoringEnabled = computed<boolean>(() => {
    return (
        screenProctoringAllowedForGroups.value ||
        item.type === "SCREEN_PROCTORING_SINGLE" ||
        item.type === "SCREEN_PROCTORING_FALLBACK"
    );
});

const { item } = defineProps<{
    item: ClientGroupForTable;
}>();
</script>
