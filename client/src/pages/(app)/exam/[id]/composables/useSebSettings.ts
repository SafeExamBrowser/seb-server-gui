import { computed, type Ref } from "vue";

import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";
import i18n from "@/i18n";
import { Exam } from "@/models/seb-server/exam.ts";
import { GUIAction } from "@/services/ability.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";

import { useSebSettingsConfigNode } from "./api/useSebSettingsConfigNode.ts";
import { useExamActionDisabled } from "./useExamActionDisabled.ts";

export const useSebSettings = (
    exam: Ref<Exam | undefined>,
    examId?: number,
) => {
    const editDisabled = useExamActionDisabled(
        exam,
        GUIAction.EDIT_SEB_SETTINGS,
    );

    const { data: configNode, loading: lastModifiedLoading } =
        useSebSettingsConfigNode(examId);

    const lastModifiedItems = computed<KeyValueItem[]>(() => {
        const node = configNode.value;

        if (!node?.lastUpdateUserName || !node.lastUpdateTime) {
            return [];
        }

        return [
            {
                key: "lastModified",
                type: "basic",
                label: i18n.global.t("examDetail.boxes.lastModifiedBy"),
                value: {
                    type: "string",
                    value: `${node.lastUpdateUserName} - ${formatIsoToReadableDateTime(node.lastUpdateTime)}`,
                },
            },
        ];
    });

    return {
        editDisabled,
        lastModifiedItems,
        lastModifiedLoading,
    };
};
