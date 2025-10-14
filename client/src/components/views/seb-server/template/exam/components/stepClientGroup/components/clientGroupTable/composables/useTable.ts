import { useI18n } from "vue-i18n";
import { ClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { computed } from "vue";
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import { storeToRefs } from "pinia";

export const useTable = () => {
    const { t } = useI18n();

    const headers = [
        {
            title: t("createTemplateExam.steps.clientGroup.fields.name.label"),
            value: "name",
        },
        {
            title: t("createTemplateExam.steps.clientGroup.fields.type.label"),
            value: "type",
        },
        {
            title: t(
                "createTemplateExam.steps.clientGroup.fields.actions.label",
            ),
            value: "actions",
            align: "end" as const,
        },
    ];

    const { groups: groupsFromStore } = storeToRefs(useStepClientGroupStore());

    const fallbackGroup = computed<ClientGroup | undefined>(() => {
        const { collectionStrategy } = useScreenProctoringStore();

        if (!collectionStrategy) {
            return undefined;
        }

        if (collectionStrategy === "EXAM") {
            return {
                id: 0,
                type: "SCREEN_PROCTORING_SINGLE" as const,
                name: "Screen Proctoring Single Group" as const,
            };
        }

        return {
            id: 0,
            type: "SCREEN_PROCTORING_FALLBACK" as const,
            name: "Screen Proctoring Fallback Group" as const,
        };
    });

    const items = computed<ClientGroup[]>(() =>
        [...groupsFromStore.value, fallbackGroup.value].filter(
            (item) => item !== undefined,
        ),
    );

    return {
        headers,
        items,
    };
};
