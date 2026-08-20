<template>
    <ActionButton v-if="monitorVisible" :to="monitoringRoute">
        {{ $t("examDetail.sidePanel.actions.monitorExam") }}
    </ActionButton>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { Exam } from "@/models/seb-server/exam.ts";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum.ts";
import { typedTo } from "@/router/typedTo.ts";
import { GUIComponent, useAbilities } from "@/services/ability.ts";
import * as generalUtils from "@/utils/generalUtils.ts";

import ActionButton from "./ActionButton.vue";

const props = defineProps<{
    exam?: Exam;
}>();

const ability = useAbilities();

const monitorVisible = computed(() => {
    const status = generalUtils.findEnumValue(
        ExamStatusEnum,
        props.exam?.status,
    );
    return (
        ability.canView(GUIComponent.MONITORING) &&
        (status === ExamStatusEnum.RUNNING ||
            status === ExamStatusEnum.TEST_RUN)
    );
});

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
