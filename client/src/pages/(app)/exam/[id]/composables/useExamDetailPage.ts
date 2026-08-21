import { computed } from "vue";
import { useRoute } from "vue-router";
import { z } from "zod";

import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";
import { useMutation } from "@/composables/useMutation.ts";
import i18n from "@/i18n";
import { Exam } from "@/models/seb-server/exam.ts";
import { isNotFoundError } from "@/services/errors/toAppError.ts";
import * as examService from "@/services/seb-server/examService.ts";

import { useDeleteExamAction } from "./actions/useDeleteExamAction.ts";
import { useSebLockAction } from "./actions/useSebLockAction.ts";
import { useTestRunAction } from "./actions/useTestRunAction.ts";
import { useExam } from "./api/useExam.ts";
import { useExamConfigMapping } from "./api/useExamConfigMapping.ts";
import { useBasicSettings } from "./useBasicSettings.ts";
import { useSebSettings } from "./useSebSettings.ts";
import { useSupervisorsBox } from "./useSupervisorsBox.ts";

const idSchema = z.coerce.number().int().positive();

export const useExamDetailPage = () => {
    const route = useRoute("/(app)/exam/[id]/");
    const parseResult = idSchema.safeParse(route.params.id);
    const examId = parseResult.success ? parseResult.data : undefined;

    const {
        data: exam,
        loading: examLoading,
        error: examError,
    } = useExam(examId);

    const {
        data: configMapping,
        loading: configMappingLoading,
        error: configMappingError,
    } = useExamConfigMapping(examId);

    // Exams created "with URL" have no assessment tool attached and allow editing quiz data
    const examWithURL = computed(
        () =>
            exam.value?.lmsSetupId === null ||
            exam.value?.lmsSetupId === undefined,
    );

    const updateExamMutation = useMutation((updated: Exam) =>
        examService.updateExam(updated),
    );

    const updateExam = async (patch: Partial<Exam>) => {
        if (!exam.value) {
            return;
        }

        const examUpdated = await updateExamMutation.mutateData({
            ...exam.value,
            ...patch,
        });

        if (!examUpdated) {
            return;
        }

        exam.value = examUpdated;
    };

    const basicSettings = useBasicSettings(
        exam,
        examWithURL,
        updateExam,
        configMapping,
    );
    const sebSettings = useSebSettings(exam, configMapping);
    const supervisors = useSupervisorsBox(exam, updateExam);

    const loading = computed(
        () =>
            examLoading.value ||
            configMappingLoading.value ||
            supervisors.loading.value,
    );

    const notFound = computed(() => isNotFoundError(examError.value));

    const errors = computed(() => {
        const messages = [];

        if (!parseResult.success) {
            messages.push(
                i18n.global.t("examDetail.errors.invalidId", {
                    id: route.params.id,
                }),
            );
        }

        if (examError.value && !notFound.value) {
            messages.push(examError.value);
        }

        if (configMappingError.value) {
            messages.push(configMappingError.value);
        }

        if (sebSettings.error.value) {
            messages.push(sebSettings.error.value);
        }

        if (supervisors.error.value) {
            messages.push(supervisors.error.value);
        }

        return messages;
    });

    const title = computed(() => {
        if (exam.value) {
            return exam.value.quizName;
        }

        if (loading.value) {
            return "";
        }

        return i18n.global.t("titles.examDetails");
    });

    const breadCrumb = computed<BreadCrumbItem[]>(() => [
        {
            label: i18n.global.t("titles.exams"),
            link: {
                name: "/(app)/exam/",
                query: { status: "UP_COMING,TEST_RUN,RUNNING" },
            },
        },
        ...(exam.value ? [{ label: title.value }] : []),
    ]);

    const { handleTestRunToggle } = useTestRunAction(exam, examId);
    const { sebLockActive, handleSebLockToggle } = useSebLockAction(examId);
    const { handleDeleteExam } = useDeleteExamAction(examId);

    return {
        examId,
        exam,
        loading,
        notFound,
        errors,
        title,
        breadCrumb,
        sebLockActive,
        examWithURL,
        basicSettings,
        sebSettings,
        supervisors,
        actions: {
            handleTestRunToggle,
            handleSebLockToggle,
            handleDeleteExam,
        },
    };
};
