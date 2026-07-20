import { computed } from "vue";
import { z } from "zod";
import { useRoute, useRouter } from "vue-router";
import i18n from "@/i18n";
import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";
import { BasicSettings, Exam } from "@/models/seb-server/exam.ts";
import { GUIAction, useAbilities } from "@/services/ability.ts";
import * as examService from "@/services/seb-server/examService.ts";
import * as monitoringService from "@/services/seb-server/monitoringService.ts";
import { excludeFromDeletion } from "@/services/seb-server/scheduledDeletionService.ts";
import { useMutation } from "@/composables/useMutation.ts";
import { useExam } from "./api/useExam.ts";
import { useExamConfigMapping } from "./api/useExamConfigMapping.ts";
import { useSebLockCheck } from "./api/useSebLockCheck.ts";

const idSchema = z.coerce.number().int().positive();

export const useExamDetailPage = () => {
    const route = useRoute("/(app)/exam-new/[id]/");
    const router = useRouter();
    const ability = useAbilities();
    const parseResult = idSchema.safeParse(route.params.id);
    const examId = parseResult.success ? parseResult.data : undefined;

    const {
        data: exam,
        loading: examLoading,
        error: examError,
    } = useExam(examId);

    const { data: configMapping, loading: configMappingLoading } =
        useExamConfigMapping(examId);

    const loading = computed(
        () => examLoading.value || configMappingLoading.value,
    );

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

    // Exams created "with URL" have no assessment tool attached and allow editing quiz data
    const examWithURL = computed(
        () =>
            exam.value?.lmsSetupId === null ||
            exam.value?.lmsSetupId === undefined,
    );

    const basicSettings = computed<BasicSettings>(() => ({
        quizName: exam.value?.quizName ?? "",
        quiz_description: exam.value?.quiz_description ?? "",
        quiz_start_url: exam.value?.quiz_start_url ?? "",
        quizStartTime: exam.value?.quizStartTime ?? "",
        quizEndTime: exam.value?.quizEndTime ?? "",
        type: exam.value?.type ?? "",
        status: exam.value?.status ?? "",
        followupId: exam.value?.followupId ?? null,
        quitPassword: exam.value?.quitPassword,
        encryptPassword: configMapping.value?.encryptSecret,
    }));

    const basicSettingsEditDisabled = computed(
        () =>
            !ability.canDoExamAction(
                GUIAction.EDIT_EXAM_SETTINGS,
                exam.value ?? null,
            ),
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

    const configMappingMutation = useMutation(
        examService.updateExamConfigMapping,
    );

    const handleBasicSettingsChange = async (value: BasicSettings) => {
        if (!exam.value) {
            return;
        }

        // first update the start encryption password for exam configuration if changed
        if (
            configMapping.value &&
            configMapping.value.encryptSecret !== value.encryptPassword
        ) {
            const updatedMapping = {
                ...configMapping.value,
                encryptSecret: value.encryptPassword,
                confirm_encrypt_secret: value.encryptPassword,
            };
            await configMappingMutation.mutateData(updatedMapping);

            if (!configMappingMutation.error.value) {
                configMapping.value = updatedMapping;
            }
        }

        // then update the exam with new exam data
        const patch: Partial<Exam> = {
            type: value.type,
            followupId: value.followupId ?? null,
            quitPassword: value.quitPassword,
        };

        if (examWithURL.value) {
            patch.quizName = value.quizName;
            patch.quizStartTime = value.quizStartTime;
            patch.quizEndTime = value.quizEndTime;
            patch.additionalAttributes = {
                ...exam.value.additionalAttributes,
                quiz_description: value.quiz_description,
                quiz_start_url: value.quiz_start_url,
            };
        }

        await updateExam(patch);
    };

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
        examWithURL,
        basicSettings,
        basicSettingsEditDisabled,
        handleBasicSettingsChange,
        handleTestRunToggle,
        handleSebLockToggle,
        handleExcludeFromDeletionToggle,
        handleDeleteExam,
    };
};
