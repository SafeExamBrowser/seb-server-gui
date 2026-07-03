<template>
    <LoadingFallbackComponent
        :loading="loading"
        :errors="fetchError ? [fetchError] : []"
    >
        <AssessmentToolForm
            v-if="tool"
            ref="formRef"
            :title="$t('titles.assessmentToolEdit')"
            mode="edit"
            :initial-tool="tool"
            :data-test-prefix="assessmentToolFormConfig.editTestPrefix"
            @edit-submit="handleSubmit"
            @cancel="router.push({ name: '/(app)/assessment-tool/' })"
        />
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AssessmentToolForm from "@/pages/(app)/assessment-tool/components/AssessmentToolForm.vue";
import { assessmentToolFormConfig } from "@/pages/(app)/assessment-tool/assessmentToolFormConfig.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useAssessmentToolQuery } from "@/pages/(app)/assessment-tool/api/useAssessmentToolQuery.ts";
import { useEditAssessmentToolMutation } from "@/pages/(app)/assessment-tool/api/useEditAssessmentToolMutation.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import type { AssessmentToolEditRequest } from "@/models/assessmentTool.ts";

definePage({
    meta: {
        titleKey: "titles.assessmentToolEdit",
        pageTestId: "edit-assessment-tool-page",
        isPageBlue: true,
    },
});

const route = useRoute("/(app)/assessment-tool/[id]/");
const router = useRouter();

const formRef = ref<InstanceType<typeof AssessmentToolForm>>();
const id = computed(() => {
    const value = route.params.id;
    return typeof value === "string" ? value : undefined;
});
const {
    data: tool,
    isPending: loading,
    error: fetchQueryError,
} = useAssessmentToolQuery(id);
const fetchError = computed(() => toAppErrorOrUndefined(fetchQueryError.value));

const { mutateAsync: save, error: saveMutationError } =
    useEditAssessmentToolMutation();
const saveError = computed(() =>
    toAppErrorOrUndefined(saveMutationError.value),
);

const handleSubmit = async (payload: AssessmentToolEditRequest) => {
    const saved = await submitWithFormErrors({
        run: () => save(payload),
        applyErrors: (err) => formRef.value?.applyBackendErrors(err),
        error: saveError,
        contextLabel: "assessmenttool",
    });
    if (!saved) return;
    await router.push({ name: "/(app)/assessment-tool/" });
};
</script>
