import { computed, Ref } from "vue";

import { KeyValueItem } from "@/components/widgets/keyValueList/types";
import i18n from "@/i18n";
import { ConfigurationNodeInfo } from "@/models/seb-server/configurationNode";
import { useFetchSEBKeys } from "@/pages/(app)/exam/[id]/components/BoxSEBKeys/composables/api/useFetchSEBKeys";
import { getSEBKeys } from "@/services/seb-server/examService";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils";

export const useSEBKeyItems = (
    hasBEK: boolean,
    examId: string,
    configNode: Ref<ConfigurationNodeInfo | undefined>,
) => {
    const { data, loading, error } = useFetchSEBKeys(examId);

    const reloadConfigKey = async () => {
        data.value = await getSEBKeys(examId);
    };

    const items = computed<KeyValueItem[]>(() => {
        if (!configNode) {
            return [];
        }

        const result: KeyValueItem[] = [];
        const node = configNode.value;

        if (node?.lastUpdateUserName && node.lastUpdateTime) {
            result.push({
                key: "lastModified",
                type: "basic",
                label: i18n.global.t("examDetail.boxes.lastModifiedBy"),
                value: {
                    type: "string",
                    value: `${node.lastUpdateUserName} - ${formatIsoToReadableDateTime(node.lastUpdateTime)}`,
                },
            });
        }

        if (data.value) {
            result.push({
                key: "configKey",
                type: "basic",
                label: i18n.global.t("examDetail.boxes.sebKeys.configKey"),
                value: {
                    type: "string",
                    value: data.value.configKeys[0],
                },
            });

            if (data.value.additionalProperties.ALTERNATIVE_SEB_BEK) {
                result.push({
                    key: "sebServerExamKey",
                    type: "basic",
                    label: i18n.global.t(
                        "examDetail.boxes.sebKeys.sebServerExamKey",
                    ),
                    value: {
                        type: "string",
                        value: data.value.additionalProperties
                            .ALTERNATIVE_SEB_BEK,
                    },
                });
            }

            if (hasBEK) {
                const bek = data.value.browserExamKeys.join("\n");
                result.push({
                    key: "browserExamKey",
                    type: "basic",
                    label: i18n.global.t(
                        "examDetail.boxes.sebKeys.browserExamKey",
                    ),
                    value: {
                        type: "string",
                        value: bek,
                    },
                });
            }
        }

        return result;
    });

    return {
        items,
        data,
        loading,
        error,

        reloadConfigKey,
    };
};
