import { computed, Ref } from "vue";

import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";
import i18n from "@/i18n";
import { BasicSettings } from "@/models/examTemplate.ts";
import {
    ExamTypeEnum,
    toSelectableExamType,
} from "@/models/seb-server/examFiltersEnum.ts";
import { useConnectionConfigurationQuery } from "@/pages/(app)/connection-configuration/api/useConnectionConfigurationQuery";

export const useBasicSettingsItems = (basicSettings: Ref<BasicSettings>) => {
    const clientConfigId = computed(() =>
        basicSettings.value.clientConfigurationId
            ? String(basicSettings.value.clientConfigurationId)
            : undefined,
    );

    const { data: clientConfiguration, isLoading: loading } =
        useConnectionConfigurationQuery(clientConfigId);

    const clientConfigurationValue = computed(() => {
        if (!clientConfigId.value) {
            return i18n.global.t("general.noData");
        }
        if (loading.value) {
            return i18n.global.t("general.noData");
        }
        if (!clientConfiguration.value) {
            return i18n.global.t("general.noData");
        }

        if (clientConfiguration.value.active) {
            return clientConfiguration.value.name;
        } else {
            return `${clientConfiguration.value.name} - (${i18n.global.t("general.inactive")})`;
        }
    });

    const items = computed<KeyValueItem[]>(() => {
        const result: KeyValueItem[] = [
            {
                key: "name",
                type: "basic",
                label: i18n.global.t("examTemplate.fields.name.label"),
                value: { type: "string", value: basicSettings.value.name },
            },
        ];

        if (
            basicSettings.value.description !== undefined &&
            basicSettings.value.description !== ""
        ) {
            result.push({
                key: "description",
                type: "basic",
                label: i18n.global.t("examTemplate.fields.description.label"),
                value: {
                    type: "string",
                    value: basicSettings.value.description,
                },
            });
        }

        result.push({
            key: "examType",
            type: "basic",
            label: i18n.global.t("examTemplate.fields.examType.label"),
            value: {
                type: "string",
                value: i18n.global.t(
                    toSelectableExamType(basicSettings.value.examType) ??
                        ExamTypeEnum.UNDEFINED,
                ),
            },
        });

        result.push({
            key: "clientConfiguration",
            type: "basic",
            label: i18n.global.t(
                "examTemplate.fields.clientConfiguration.label",
            ),
            value: {
                type: "string",
                value: clientConfigurationValue.value,
            },
        });

        result.push(
            {
                key: "lmsIntegration",
                type: "basic",
                label: i18n.global.t(
                    "examTemplate.fields.lmsIntegration.label",
                ),
                value: {
                    type: "boolean",
                    value: basicSettings.value.lmsIntegration,
                },
            },
            {
                key: "institutionalDefault",
                type: "basic",
                label: i18n.global.t(
                    "examTemplate.fields.institutionalDefault.label",
                ),
                value: {
                    type: "boolean",
                    value: basicSettings.value.institutionalDefault,
                },
            },
            {
                key: "screenProctoringEnabled",
                type: "basic",
                label: i18n.global.t("screenProctoring.enabled.label"),
                value: {
                    type: "boolean",
                    value: basicSettings.value.screenProctoringEnabled,
                },
            },
        );

        return result;
    });

    return { items };
};
