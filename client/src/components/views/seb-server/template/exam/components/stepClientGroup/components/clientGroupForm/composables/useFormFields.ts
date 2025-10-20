import { computed, ModelRef } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types";
import { ClientGroupTransient } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { useI18n } from "vue-i18n";
import { ClientGroupEnum } from "@/models/seb-server/clientGroupEnum";
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";
import { storeToRefs } from "pinia";

export const useFormFields = (clientGroup: ModelRef<ClientGroupTransient>) => {
    const { t } = useI18n();

    const { screenProctoringAllowedForGroups } = storeToRefs(
        useScreenProctoringStore(),
    );

    const isValid = computed<boolean>({
        get: (): boolean => clientGroup.value.isValid,
        set: (value: boolean) => {
            clientGroup.value = { ...clientGroup.value, isValid: value };
        },
    });

    const name = computed<ClientGroupTransient["name"]>({
        get: (): ClientGroupTransient["name"] => clientGroup.value.name,
        set: (value: ClientGroupTransient["name"]) => {
            clientGroup.value = { ...clientGroup.value, name: value };
        },
    });

    const type = computed<ClientGroupTransient["type"]>({
        get: (): ClientGroupTransient["type"] => clientGroup.value.type,
        set: (value: ClientGroupTransient["type"]) => {
            clientGroup.value = {
                ...clientGroup.value,
                type: value,
            };
        },
    });

    const screenProctoringEnabled = computed<
        ClientGroupTransient["screenProctoringEnabled"]
    >({
        get: (): ClientGroupTransient["screenProctoringEnabled"] =>
            clientGroup.value.screenProctoringEnabled,
        set: (value: ClientGroupTransient["screenProctoringEnabled"]) => {
            clientGroup.value = {
                ...clientGroup.value,
                screenProctoringEnabled: value,
            };
        },
    });

    const ipRangeStart = computed<string>({
        get: (): string => clientGroup.value.ipRangeStart || "",
        set: (value: string) => {
            clientGroup.value = { ...clientGroup.value, ipRangeStart: value };
        },
    });

    const ipRangeEnd = computed<string>({
        get: (): string => clientGroup.value.ipRangeEnd || "",
        set: (value: string) => {
            clientGroup.value = { ...clientGroup.value, ipRangeEnd: value };
        },
    });

    const formFields = computed<FormField[]>(() =>
        [
            {
                type: "text" as const,
                name: "name",
                model: name,
                label: t(
                    "createTemplateExam.steps.clientGroup.fields.name.label",
                ),
                placeholder: t(
                    "createTemplateExam.steps.clientGroup.fields.name.placeholder",
                ),
                required: true,
            },
            {
                type: "select" as const,
                name: "type",
                model: type,
                options: [
                    ClientGroupEnum.IP_V4_RANGE,
                    ClientGroupEnum.CLIENT_OS,
                    ClientGroupEnum.NAME_ALPHABETICAL_RANGE,
                ].map((value) => ({
                    value,
                    text: t(
                        `createTemplateExam.steps.clientGroup.fields.type.types.${value}`,
                    ),
                })),
                label: t(
                    "createTemplateExam.steps.clientGroup.fields.type.label",
                ),
                placeholder: t(
                    "createTemplateExam.steps.clientGroup.fields.type.placeholder",
                ),
                required: true,
            },
            screenProctoringAllowedForGroups.value
                ? {
                      type: "switch" as const,
                      name: "screenProctoringEnabled",
                      model: screenProctoringEnabled,
                      label: t(
                          "createTemplateExam.steps.clientGroup.fields.screenProctoringEnabled.label",
                      ),
                  }
                : undefined,
            type.value === ClientGroupEnum.IP_V4_RANGE
                ? {
                      type: "text" as const,
                      name: "ip4RangeStart",
                      model: ipRangeStart,
                      label: t(
                          "createTemplateExam.steps.clientGroup.fields.ipRangeStart.label",
                      ),
                      placeholder: t(
                          "createTemplateExam.steps.clientGroup.fields.ipRangeStart.placeholder",
                      ),
                      required: true,
                  }
                : undefined,
            type.value === ClientGroupEnum.IP_V4_RANGE
                ? {
                      type: "text" as const,
                      name: "ip4RangeEnd",
                      model: ipRangeEnd,
                      label: t(
                          "createTemplateExam.steps.clientGroup.fields.ipRangeEnd.label",
                      ),
                      placeholder: t(
                          "createTemplateExam.steps.clientGroup.fields.ipRangeEnd.placeholder",
                      ),
                      required: true,
                  }
                : undefined,
        ].filter((field) => field !== undefined),
    );

    return {
        isValid,
        formFields,
    };
};
