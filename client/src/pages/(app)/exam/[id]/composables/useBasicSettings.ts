import { computed, type ComputedRef, type Ref } from "vue";

import { useMutation } from "@/composables/useMutation.ts";
import i18n from "@/i18n";
import { ConfigurationExamMapping } from "@/models/seb-server/configurationNode";
import { BasicSettings, Exam } from "@/models/seb-server/exam.ts";
import { GUIAction } from "@/services/ability.ts";
import { notify } from "@/services/notifications/notify.ts";
import * as examService from "@/services/seb-server/examService.ts";

import { useExamActionAccess } from "./useExamActionAccess.ts";

export const useBasicSettings = (
    exam: Ref<Exam | undefined>,
    examWithURL: ComputedRef<boolean>,
    updateExam: (patch: Partial<Exam>) => Promise<void>,
    configMapping: Ref<ConfigurationExamMapping | undefined>,
    refetchExam: () => Promise<void>,
) => {
    const settings = computed<BasicSettings>(() => ({
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
        screenProctoringEnabled:
            exam.value?.additionalAttributes?.enableScreenProctoring === "true",
    }));

    const { hidden: editHidden, disabled: editDisabled } = useExamActionAccess(
        exam,
        GUIAction.EDIT_BASIC_SETTINGS,
    );

    const { disabled: screenProctoringEditDisabled } = useExamActionAccess(
        exam,
        GUIAction.EDIT_SCREEN_PROCTORING,
    );

    const screenProctoringMutation = useMutation((enable: boolean) =>
        examService.activateScreenProctoring(String(exam.value?.id), enable),
    );

    const configMappingMutation = useMutation(
        examService.updateExamConfigMapping,
    );

    const handleChange = async (value: BasicSettings) => {
        if (!exam.value) {
            return;
        }

        const screenProctoringChanged =
            value.screenProctoringEnabled !==
            settings.value.screenProctoringEnabled;

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

        if (!screenProctoringChanged) {
            return;
        }

        // the screen proctoring flag is not part of the exam update; it goes
        // through the dedicated activation endpoint
        await screenProctoringMutation.mutateData(
            value.screenProctoringEnabled,
        );

        if (screenProctoringMutation.error.value) {
            notify.serverError(screenProctoringMutation.error.value, {
                titleOverride: i18n.global.t(
                    "examDetail.boxes.basicSettings.errors.screenProctoringFailed",
                ),
            });

            return;
        }

        await refetchExam();
    };

    return {
        settings,
        editHidden,
        editDisabled,
        screenProctoringEditDisabled,
        handleChange,
    };
};
