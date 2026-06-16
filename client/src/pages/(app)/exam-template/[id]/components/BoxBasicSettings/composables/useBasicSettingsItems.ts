import { computed, Ref } from "vue";
import { useI18n } from "vue-i18n";
import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";
import { useClientConfigurationNames } from "@/composables/useClientConfigurationNames.ts";
import {
    ExamTypeEnum,
    toSelectableExamType,
} from "@/models/seb-server/examFiltersEnum.ts";
import { BasicSettings } from "@/models/seb-server/examTemplate.ts";

export const useBasicSettingsItems = (basicSettings: Ref<BasicSettings>) => {
    const { t } = useI18n();

    const {
        data: clientConfigurationNames,
        loading: loadingClientConfigurationNames,
    } = useClientConfigurationNames();

    const clientConfigurationValue = computed(() => {
        if (!basicSettings.value.clientConfigurationId) {
            return t("general.noData");
        }

        // avoid flickering by waiting for the names request to resolve
        if (loadingClientConfigurationNames.value) {
            return "";
        }

        return (
            clientConfigurationNames.value?.find(
                (clientConfiguration) =>
                    clientConfiguration.modelId ===
                    String(basicSettings.value.clientConfigurationId),
            )?.name ?? t("general.noData")
        );
    });

    const items = computed<KeyValueItem[]>(() => {
        const result: KeyValueItem[] = [
            {
                key: "name",
                type: "basic",
                label: t("examTemplate.fields.name.label"),
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
                label: t("examTemplate.fields.description.label"),
                value: {
                    type: "string",
                    value: basicSettings.value.description,
                },
            });
        }

        result.push({
            key: "examType",
            type: "basic",
            label: t("examTemplate.fields.examType.label"),
            value: {
                type: "string",
                value: t(
                    toSelectableExamType(basicSettings.value.examType) ??
                        ExamTypeEnum.UNDEFINED,
                ),
            },
        });

        result.push({
            key: "clientConfiguration",
            type: "basic",
            label: t("examTemplate.fields.clientConfiguration.label"),
            value: {
                type: "string",
                value: clientConfigurationValue.value,
            },
        });

        result.push(
            {
                key: "lmsIntegration",
                type: "basic",
                label: t("examTemplate.fields.lmsIntegration.label"),
                value: {
                    type: "boolean",
                    value: basicSettings.value.lmsIntegration,
                },
            },
            {
                key: "institutionalDefault",
                type: "basic",
                label: t("examTemplate.fields.institutionalDefault.label"),
                value: {
                    type: "boolean",
                    value: basicSettings.value.institutionalDefault,
                },
            },
        );

        return result;
    });

    return { items };
};
