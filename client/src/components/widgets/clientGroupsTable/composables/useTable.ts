import {
    ClientGroupForTable,
    ClientGroupsTableDeps,
    ClientGroupTransient,
    clientGroupTransientToClientGroup,
    clientGroupTransientToClientGroupExisting,
    isFallbackGroup,
    SCREEN_PROCTORING_FALLBACK_ROW_ID,
} from "@/components/widgets/clientGroupsTable/types.ts";
import { computed, Ref } from "vue";
import i18n from "@/i18n";
import { useFormFields } from "./useFormFields.ts";
import { CrudTableConfig } from "@/components/widgets/crudTable/types.ts";

const getEmptyClientGroup = (): ClientGroupTransient => ({
    screenProctoringEnabled: false,
});

export const useTable = (
    deps: ClientGroupsTableDeps,
    screenProctoringAllowedForGroups: Ref<boolean>,
): CrudTableConfig<ClientGroupForTable, ClientGroupTransient> => {
    const { getFormFields } = useFormFields(
        deps.clientGroups,
        screenProctoringAllowedForGroups,
    );

    const headers = [
        {
            title: i18n.global.t("clientGroups.fields.name.label"),
            value: "name",
            width: "30%",
        },
        {
            title: i18n.global.t("clientGroups.fields.type.label"),
            value: "type",
            width: "30%",
        },
        deps.screenProctoring.enabled.value
            ? {
                  title: i18n.global.t(
                      "clientGroups.fields.screenProctoringEnabled.label",
                  ),
                  value: "screenProctoringEnabled",
                  width: "30%",
              }
            : undefined,
        {
            title: i18n.global.t("clientGroups.fields.actions.label"),
            value: "actions",
            align: "end" as const,
            width: "10%",
        },
    ].filter((header) => header !== undefined);

    const fallbackGroup = computed<ClientGroupForTable | undefined>(() => {
        if (!deps.screenProctoring.enabled.value) {
            return undefined;
        }

        if (deps.screenProctoring.collectionStrategy.value === "EXAM") {
            return {
                id: SCREEN_PROCTORING_FALLBACK_ROW_ID,
                type: "SCREEN_PROCTORING_SINGLE" as const,
                screenProctoringEnabled: true,
                name: i18n.global.t(
                    "clientGroups.screenProctoringSingleGroupName",
                ),
            };
        }

        if (
            deps.screenProctoring.collectionStrategy.value ===
            "APPLY_SEB_GROUPS"
        ) {
            return {
                id: SCREEN_PROCTORING_FALLBACK_ROW_ID,
                type: "SCREEN_PROCTORING_FALLBACK" as const,
                screenProctoringEnabled: true,
                name: i18n.global.t(
                    "clientGroups.screenProctoringFallbackGroupName",
                ),
            };
        }

        return undefined;
    });

    const items = computed<ClientGroupForTable[]>(() =>
        [...deps.clientGroups.value, fallbackGroup.value].filter(
            (item) => item !== undefined,
        ),
    );

    const allowCreate = computed<boolean>(() => {
        return !(
            deps.screenProctoring.enabled.value &&
            deps.screenProctoring.collectionStrategy.value === undefined
        );
    });

    const createItem = async (item: ClientGroupTransient) => {
        await deps.createItem(clientGroupTransientToClientGroup(item));
    };

    const updateItem = async (item: ClientGroupTransient) => {
        await deps.updateItem(clientGroupTransientToClientGroupExisting(item));
    };

    const deleteItem = async (item: ClientGroupForTable) => {
        if (isFallbackGroup(item)) {
            throw new Error("Fallback group cannot be deleted!");
        }

        await deps.deleteItem(item);
    };

    const getExistingItem = (
        item: ClientGroupForTable,
    ): ClientGroupTransient => {
        if (isFallbackGroup(item)) {
            throw new Error("Fallback group cannot be edited!");
        }

        return {
            ...item,
        };
    };

    const hasActions = (item: ClientGroupForTable) => !isFallbackGroup(item);

    return {
        name: "client-groups",
        title: i18n.global.t("clientGroups.entityNamePlural"),
        headers,
        items: items,
        getFormFields,
        hasActions,
        createConfig: {
            title: i18n.global.t("clientGroups.addDialogTitle"),
            allowed: allowCreate,
            getItem: getEmptyClientGroup,
            createItem,
        },
        updateConfig: {
            title: i18n.global.t("clientGroups.editDialogTitle"),
            getItem: getExistingItem,
            updateItem,
        },
        deleteConfig: {
            deleteItem,
            confirm: deps.confirmDelete
                ? {
                      translationKeyPrefix: "clientGroups",
                      getDetailText: (item: ClientGroupForTable) => item.name,
                  }
                : undefined,
        },
    };
};
