import { ClientGroupForTable } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { computed } from "vue";
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import { storeToRefs } from "pinia";
import i18n from "@/i18n";

export const useTable = () => {
    const screenProctoringStore = useScreenProctoringStore();

    const headers = [
        {
            title: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.name.label",
            ),
            value: "name",
            width: "40%",
        },
        {
            title: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.type.label",
            ),
            value: "type",
            width: "40%",
        },
        screenProctoringStore.enabled
            ? {
                  title: i18n.global.t(
                      "createTemplateExam.steps.clientGroup.fields.screenProctoringEnabled.label",
                  ),
                  value: "screenProctoringEnabled",
                  width: "10%",
              }
            : undefined,
        {
            title: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.actions.label",
            ),
            value: "actions",
            align: "end" as const,
            width: "10%",
        },
    ].filter((header) => header !== undefined);

    const { groups: groupsFromStore } = storeToRefs(useStepClientGroupStore());

    const fallbackGroup = computed<ClientGroupForTable | undefined>(() => {
        if (!screenProctoringStore.enabled) {
            return undefined;
        }

        if (screenProctoringStore.collectionStrategy === "EXAM") {
            return {
                id: 0,
                type: "SCREEN_PROCTORING_SINGLE" as const,
                screenProctoringEnabled: true,
                name: i18n.global.t(
                    "createTemplateExam.steps.clientGroup.screenProctoringSingleGroupName",
                ),
            };
        }

        if (screenProctoringStore.collectionStrategy === "APPLY_SEB_GROUPS") {
            return {
                id: 0,
                type: "SCREEN_PROCTORING_FALLBACK" as const,
                screenProctoringEnabled: true,
                name: i18n.global.t(
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
