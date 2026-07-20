<template>
    <ActionButton v-if="monitorVisible" :to="monitoringRoute">
        {{ $t("examDetail.sidePanel.actions.monitorExam") }}
    </ActionButton>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { GUIAction, useAbilities } from "@/services/ability.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import { typedTo } from "@/router/typedTo.ts";
import ActionButton from "./ActionButton.vue";

const props = defineProps<{
    exam?: Exam;
}>();

const ability = useAbilities();

const monitorVisible = computed(() =>
    ability.canDoExamAction(GUIAction.SHOW_MONITORING, props.exam ?? null),
);

const monitoringRoute = computed(() => {
    if (!props.exam) {
        return undefined;
    }

    return typedTo({
        name: "/(app)/monitoring/[examId]/",
        params: { examId: String(props.exam.id) },
    });
});
</script>
