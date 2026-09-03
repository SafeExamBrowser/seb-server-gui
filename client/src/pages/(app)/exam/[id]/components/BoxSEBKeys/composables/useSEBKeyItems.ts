import { computed } from "vue";

import { KeyValueItem } from "@/components/widgets/keyValueList/types";
import i18n from "@/i18n";
import { useFetchSEBKeys } from "@/pages/(app)/exam/[id]/components/BoxSEBKeys/composables/api/useFetchSEBKeys";

export const useSEBKeyItems = (
    hasBEK: boolean,
    examId: string,
    lastModifiedItems: KeyValueItem[],
) => {
    const { data, loading, error } = useFetchSEBKeys(examId);

    const items = computed<KeyValueItem[]>(() => {
        let result: KeyValueItem[] = [];

        result = result.concat(lastModifiedItems);

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
    };
};
