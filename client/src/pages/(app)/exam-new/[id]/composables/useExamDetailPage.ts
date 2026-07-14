import { computed } from "vue";
import { z } from "zod";
import { useRoute, useRouter } from "vue-router";
import i18n from "@/i18n";
import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";
import * as examService from "@/services/seb-server/examService.ts";
import * as monitoringService from "@/services/seb-server/monitoringService.ts";
import { excludeFromDeletion } from "@/services/seb-server/scheduledDeletionService.ts";
import { useMutation } from "@/composables/useMutation.ts";
import { useExam } from "./api/useExam.ts";
import { useSebLockCheck } from "./api/useSebLockCheck.ts";

const idSchema = z.coerce.number().int().positive();

export const useExamDetailPage = () => {
    const route = useRoute("/(app)/exam-new/[id]/");
    const router = useRouter();
    const parseResult = idSchema.safeParse(route.params.id);
    const examId = parseResult.success ? parseResult.data : undefined;

    const { data: exam, loading, error: examError } = useExam(examId);

    const { data: sebLockActive, fetchData: refreshSebLockActive } =
        useSebLockCheck(examId);

    const notFound = computed(
        () =>
            examError.value?.kind === "backend" &&
            examError.value.status === 404,
    );

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
            link: { name: "/(app)/exam/" },
        },
        ...(exam.value ? [{ label: title.value }] : []),
    ]);

    // Calling the test-run endpoint again while the test run is active, disables it
    const testRunMutation = useMutation((id: number) =>
        monitoringService.applyTestRun(String(id)),
    );

    const handleTestRunToggle = async () => {
        if (examId === undefined) {
            return;
        }

        const updatedExam = await testRunMutation.mutateData(examId);

        if (!updatedExam) {
            return;
        }

        exam.value = updatedExam;
    };

    const sebLockMutation = useMutation(async (id: number, enable: boolean) => {
        if (enable) {
            await examService.addSEBLock(String(id));
            return;
        }

        await examService.removeSEBLock(String(id));
    });

    const handleSebLockToggle = async () => {
        if (examId === undefined) {
            return;
        }

        await sebLockMutation.mutateData(examId, !sebLockActive.value);

        if (sebLockMutation.error.value) {
            return;
        }

        await refreshSebLockActive();
    };

    const excludeFromDeletionMutation = useMutation(
        (id: number, exclude: boolean) => excludeFromDeletion(id, exclude),
    );

    const handleExcludeFromDeletionToggle = async () => {
        if (examId === undefined || !exam.value) {
            return;
        }

        const exclude = !exam.value.excludeFromDeletion;
        await excludeFromDeletionMutation.mutateData(examId, exclude);

        if (excludeFromDeletionMutation.error.value) {
            return;
        }

        exam.value = { ...exam.value, excludeFromDeletion: exclude };
    };

    const deleteExamMutation = useMutation((id: number) =>
        examService.deleteExam(String(id)),
    );

    const handleDeleteExam = async () => {
        if (examId === undefined) {
            return;
        }

        await deleteExamMutation.mutateData(examId);

        if (deleteExamMutation.error.value) {
            return;
        }

        await router.push({ name: "/(app)/exam/" });
    };

    return {
        examId,
        exam,
        loading,
        notFound,
        errors,
        title,
        breadCrumb,
        sebLockActive,
        handleTestRunToggle,
        handleSebLockToggle,
        handleExcludeFromDeletionToggle,
        handleDeleteExam,
    };
};
