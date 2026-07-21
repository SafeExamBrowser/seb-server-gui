<template>
    <AssessmentToolForm
        ref="formRef"
        :title="$t('titles.createAssessmentTool')"
        mode="create"
        :data-test-prefix="assessmentToolFormConfig.createTestPrefix"
        @create-submit="handleSubmit"
        @cancel="router.push({ name: '/(app)/assessment-tool/' })"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import type { AssessmentToolCreateRequest } from "@/models/assessmentTool.ts";
import { useCreateAssessmentToolMutation } from "@/pages/(app)/assessment-tool/api/useCreateAssessmentToolMutation.ts";
import { assessmentToolFormConfig } from "@/pages/(app)/assessment-tool/assessmentToolFormConfig.ts";
import AssessmentToolForm from "@/pages/(app)/assessment-tool/components/AssessmentToolForm.vue";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";

definePage({
    meta: {
        titleKey: "titles.createAssessmentTool",
        pageTestId: "create-assessment-tool-page",
        isPageBlue: true,
    },
});

const router = useRouter();
const formRef = ref<InstanceType<typeof AssessmentToolForm>>();
const { mutateAsync: create, error: createMutationError } =
    useCreateAssessmentToolMutation();
const createError = computed(() =>
    toAppErrorOrUndefined(createMutationError.value),
);

const handleSubmit = async (payload: AssessmentToolCreateRequest) => {
    const created = await submitWithFormErrors({
        run: () => create(payload),
        applyErrors: (err) => formRef.value?.applyBackendErrors(err),
        error: createError,
        contextLabel: "assessmenttool",
    });
    if (!created) return;
    await router.push({
        name: "/(app)/assessment-tool/",
        query: { search: created.name },
    });
};
</script>
