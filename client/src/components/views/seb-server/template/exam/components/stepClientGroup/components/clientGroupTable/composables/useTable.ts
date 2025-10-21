import { useI18n } from "vue-i18n";
import { ClientGroupForTable } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { computed } from "vue";
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import { storeToRefs } from "pinia";

export const useTable = () => {
    const { t } = useI18n();
    const {
        collectionStrategy: screenProctoringCollectionStrategy,
        enabled: screenProctoringEnabled,
    } = useScreenProctoringStore();

    const headers = [
        {
            title: t("createTemplateExam.steps.clientGroup.fields.name.label"),
            value: "name",
        },
        {
            title: t("createTemplateExam.steps.clientGroup.fields.type.label"),
            value: "type",
        },
        screenProctoringEnabled
            ? {
                  title: t(
                      "createTemplateExam.steps.clientGroup.fields.screenProctoringEnabled.label",
                  ),
                  value: "screenProctoringEnabled",
              }
            : undefined,
        {
            title: t(
                "createTemplateExam.steps.clientGroup.fields.actions.label",
            ),
            value: "actions",
            align: "end" as const,
        },
    ].filter((header) => header !== undefined);

    const { groups: groupsFromStore } = storeToRefs(useStepClientGroupStore());

    const fallbackGroup = computed<ClientGroupForTable | undefined>(() => {
        if (!screenProctoringEnabled) {
            return undefined;
        }

        if (screenProctoringCollectionStrategy === "EXAM") {
            return {
                id: 0,
                type: "SCREEN_PROCTORING_SINGLE" as const,
                screenProctoringEnabled: true,
                name: t(
                    "createTemplateExam.steps.clientGroup.screenProctoringSingleGroupName",
                ),
            };
        }

        if (screenProctoringCollectionStrategy === "APPLY_SEB_GROUPS") {
            return {
                id: 0,
                type: "SCREEN_PROCTORING_FALLBACK" as const,
                screenProctoringEnabled: true,
                name: t(
                    "createTemplateExam.steps.clientGroup.screenProctoringFallbackGroupName",
                ),
            };
        }

        return undefined;
    });

    const items = computed<ClientGroupForTable[]>(() =>
        [...groupsFromStore.value, fallbackGroup.value].filter(
            (item) => item !== undefined,
        ),
    );

    return {
        headers,
        items,
    };
};
