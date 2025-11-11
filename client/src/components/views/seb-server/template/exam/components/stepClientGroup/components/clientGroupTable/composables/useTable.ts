import {
    ClientGroupForTable,
    ClientGroupTransient,
    clientGroupTransientToClientGroup,
} from "@/components/views/seb-server/template/exam/components/stepClientGroup/types";
import { computed } from "vue";
import { useScreenProctoringStore } from "@/components/views/seb-server/template/exam/composables/store/useScreenProctoringStore";
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";
import { storeToRefs } from "pinia";
import i18n from "@/i18n";
import { useFormFields } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/useFormFields";
import { getEmptyClientGroup } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";

export const useTable = () => {
    const { getFormFields } = useFormFields();
    const screenProctoringStore = useScreenProctoringStore();
    const { createGroup, deleteGroup } = useStepClientGroupStore();

    const headers = [
        {
            title: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.name.label",
            ),
            value: "name",
            width: "30%",
        },
        {
            title: i18n.global.t(
                "createTemplateExam.steps.clientGroup.fields.type.label",
            ),
            value: "type",
            width: "30%",
        },
        screenProctoringStore.enabled
            ? {
                  title: i18n.global.t(
                      "createTemplateExam.steps.clientGroup.fields.screenProctoringEnabled.label",
                  ),
                  value: "screenProctoringEnabled",
                  width: "30%",
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

    const allowCreate = computed<boolean>(() => {
        return !(
            screenProctoringStore.enabled &&
            screenProctoringStore.collectionStrategy === undefined
        );
    });

    const createItem = (item: ClientGroupTransient) => {
        createGroup(clientGroupTransientToClientGroup(item));
    };

    return {
        headers,
        items,
        allowCreate,
        createItem,
        deleteItem: deleteGroup,
        getNewItem: getEmptyClientGroup,
        getFormFields,
    };
};
