import { computed } from "vue";

import { KeyValueItem } from "@/components/widgets/keyValueList/types";
import i18n from "@/i18n";
import { useFetchSEBKeys } from "@/pages/(app)/exam/[id]/components/BoxSEBKeys/composables/api/useFetchSEBKeys";

export const useSEBKeyItems = (
    examId: string,
    lastModifiedItems: KeyValueItem[],
) => {
    const sebKeysFetch = computed(() => useFetchSEBKeys(examId));

    const items = computed<KeyValueItem[]>(() => {
        let result: KeyValueItem[] = [];

        result = result.concat(lastModifiedItems);

        if (sebKeysFetch.value.data.value) {
            result.push({
                key: "configKey",
                type: "basic",
                label: i18n.global.t("examDetail.boxes.sebKeys.configKey"),
                value: {
                    type: "string",
                    value: sebKeysFetch.value.data.value.configKeys[0],
                },
            });

            if (
                sebKeysFetch.value.data.value.additionalProperties
                    .ALTERNATIVE_SEB_BEK
            ) {
                result.push({
                    key: "sebServerExamKey",
                    type: "basic",
                    label: i18n.global.t(
                        "examDetail.boxes.sebKeys.sebServerExamKey",
                    ),
                    value: {
                        type: "string",
                        value: sebKeysFetch.value.data.value
                            .additionalProperties.ALTERNATIVE_SEB_BEK,
                    },
                });
            }

            if (sebKeysFetch.value.data.value.browserExamKeys) {
                const bek =
                    sebKeysFetch.value.data.value.browserExamKeys.join("\n");
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
        sebKeysFetch,
    };
};
