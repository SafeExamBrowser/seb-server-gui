import { computed, type ComputedRef, type Ref } from "vue";

import { useMutation } from "@/composables/useMutation.ts";
import { ConfigurationExamMapping } from "@/models/seb-server/configurationNode";
import { BasicSettings, Exam } from "@/models/seb-server/exam.ts";
import { GUIAction } from "@/services/ability.ts";
import * as examService from "@/services/seb-server/examService.ts";

import { useExamActionAccess } from "./useExamActionAccess.ts";

export const useBasicSettings = (
    exam: Ref<Exam | undefined>,
    examWithURL: ComputedRef<boolean>,
    updateExam: (patch: Partial<Exam>) => Promise<void>,
    configMapping: Ref<ConfigurationExamMapping | undefined>,
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
    }));

    const { hidden: editHidden, disabled: editDisabled } = useExamActionAccess(
        exam,
        GUIAction.EDIT_BASIC_SETTINGS,
    );

    const configMappingMutation = useMutation(
        examService.updateExamConfigMapping,
    );

    const handleChange = async (value: BasicSettings) => {
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

    return {
        settings,
        editHidden,
        editDisabled,
        handleChange,
    };
};
