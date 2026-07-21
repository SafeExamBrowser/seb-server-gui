<template>
    <ActionButton
        v-if="sebLockVisible"
        :active="sebLockActive"
        :disabled="!sebLockEnabled"
        @click="handleClick"
    >
        {{
            $t(
                sebLockActive
                    ? "examDetail.sidePanel.actions.sebLockApplied"
                    : "examDetail.sidePanel.actions.applySebLock",
            )
        }}
    </ActionButton>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { LMSFeatureEnum } from "@/models/seb-server/assessmentToolEnums.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import ActionButton from "@/pages/(app)/exam-new/[id]/components/ExamSidePanel/components/ActionButton.vue";
import { GUIAction, useAbilities } from "@/services/ability.ts";
import * as generalUtils from "@/utils/generalUtils.ts";

import { useAssessmentTool } from "./composables/api/useAssessmentTool.ts";

const props = defineProps<{
    exam?: Exam;
    sebLockActive?: boolean;
}>();

const emit = defineEmits<{
    toggle: [];
}>();

const ability = useAbilities();

const { data: assessmentTool } = useAssessmentTool(
    () => props.exam?.lmsSetupId,
);

const sebLockVisible = computed(() => {
    if (!assessmentTool.value) {
        return false;
    }

    return generalUtils.hasLMSFeature(
        assessmentTool.value.lmsType,
        LMSFeatureEnum.SEB_RESTRICTION,
    );
});

const sebLockEnabled = computed(() =>
    ability.canDoExamAction(
        GUIAction.APPLY_SEB_RESTRICTION,
        props.exam ?? null,
    ),
);

const handleClick = () => {
    emit("toggle");
};
</script>
