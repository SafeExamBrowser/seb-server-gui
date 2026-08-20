import { computed, type Ref } from "vue";

import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";
import i18n from "@/i18n";
import { ConfigurationExamMapping } from "@/models/seb-server/configurationNode";
import { Exam } from "@/models/seb-server/exam.ts";
import { GUIAction } from "@/services/ability.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";

import { useSebSettingsConfigNode } from "./api/useSebSettingsConfigNode.ts";
import { useExamActionAccess } from "./useExamActionAccess.ts";

export const useSebSettings = (
    exam: Ref<Exam | undefined>,
    configMapping: Ref<ConfigurationExamMapping | undefined>,
) => {
    const fullAccess = useExamActionAccess(
        exam,
        GUIAction.EDIT_FULL_SEB_SETTINGS,
    );
    const restrictedAccess = useExamActionAccess(
        exam,
        GUIAction.EDIT_RESTRICTED_SEB_SETTINGS,
    );
    const editHidden = computed(
        () => fullAccess.hidden.value && restrictedAccess.hidden.value,
    );
    const editDisabled = computed(
        () => fullAccess.disabled.value && restrictedAccess.disabled.value,
    );

    const {
        data: configNode,
        loading: lastModifiedLoading,
        error,
    } = useSebSettingsConfigNode(configMapping);

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
        editHidden,
        editDisabled,
        lastModifiedItems,
        lastModifiedLoading,
        error,
    };
};
