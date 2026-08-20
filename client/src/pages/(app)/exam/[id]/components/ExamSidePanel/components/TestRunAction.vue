<template>
    <ActionButton
        v-if="testRunVisible"
        :active="testRunActive"
        :disabled="!testRunEnabled"
        @click="handleClick"
    >
        {{
            $t(
                testRunActive
                    ? "examDetail.sidePanel.actions.testRunApplied"
                    : "examDetail.sidePanel.actions.applyTestRun",
            )
        }}
    </ActionButton>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { Exam } from "@/models/seb-server/exam.ts";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum.ts";
import { GUIAction, useAbilities } from "@/services/ability.ts";
import * as generalUtils from "@/utils/generalUtils.ts";

import ActionButton from "./ActionButton.vue";

const props = defineProps<{
    exam?: Exam;
}>();

const emit = defineEmits<{
    toggle: [];
}>();

const ability = useAbilities();

const testRunActive = computed(
    () =>
        generalUtils.findEnumValue(ExamStatusEnum, props.exam?.status) ===
        ExamStatusEnum.TEST_RUN,
);

const testRunVisible = computed(() =>
    ability.canDo(GUIAction.APPLY_DISABLE_TEST_RUN),
);

const testRunEnabled = computed(() =>
    ability.canDoExamAction(
        GUIAction.APPLY_DISABLE_TEST_RUN,
        props.exam ?? null,
    ),
);

const handleClick = () => {
    emit("toggle");
};
</script>
