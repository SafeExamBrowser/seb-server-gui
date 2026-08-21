<template>
    <NotFoundPage
        v-if="notFound"
        :message="$t('assessmentToolConnections.notFound.message')"
        :back-link="notFoundBackLink"
    />
    <LoadingFallbackComponent
        v-else
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
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

import NotFoundPage from "@/components/layout/pages/NotFoundPage.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import type { AssessmentToolEditRequest } from "@/models/assessmentTool.ts";
import { useAssessmentToolQuery } from "@/pages/(app)/assessment-tool/api/useAssessmentToolQuery.ts";
import { useEditAssessmentToolMutation } from "@/pages/(app)/assessment-tool/api/useEditAssessmentToolMutation.ts";
import { assessmentToolFormConfig } from "@/pages/(app)/assessment-tool/assessmentToolFormConfig.ts";
import AssessmentToolForm from "@/pages/(app)/assessment-tool/components/AssessmentToolForm.vue";
import { typedTo } from "@/router/typedTo";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import {
    isNotFoundError,
    toAppErrorOrUndefined,
} from "@/services/errors/toAppError.ts";

definePage({
    meta: {
        titleKey: "titles.assessmentToolEdit",
        pageTestId: "edit-assessment-tool-page",
        isPageBlue: true,
        requiredComponent: "EDIT_ASSESSMENT_TOOL",
    },
});

const route = useRoute("/(app)/assessment-tool/[id]/");
const router = useRouter();
const { t } = useI18n();

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

const notFound = computed(() => isNotFoundError(fetchError.value));

const notFoundBackLink = {
    label: t("assessmentToolConnections.notFound.backToList"),
    to: typedTo({ name: "/(app)/assessment-tool/" }),
};

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
