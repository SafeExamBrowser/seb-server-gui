import { computed, Ref } from "vue";
import { RuleAliases } from "vuetify/labs/rules";

import {
    ClientGroupForTable,
    ClientGroupsTableDeps,
    ClientGroupTransient,
    clientGroupTransientToClientGroup,
    clientGroupTransientToClientGroupExisting,
    isFallbackGroup,
} from "@/components/widgets/clientGroupsTable/types.ts";
import { CrudTableConfig } from "@/components/widgets/crudTable/types.ts";
import i18n from "@/i18n";
import { getScreenProctoringFallbackGroup } from "@/utils/clientGroup.ts";

import { useFormFields } from "./useFormFields.ts";

const getEmptyClientGroup = (): ClientGroupTransient => ({
    screenProctoringEnabled: false,
});

export const useTable = (
    deps: ClientGroupsTableDeps,
    screenProctoringAllowedForGroups: Ref<boolean>,
    rules: RuleAliases,
): CrudTableConfig<ClientGroupForTable, ClientGroupTransient> => {
    const { getFormFields } = useFormFields(
        deps.clientGroups,
        screenProctoringAllowedForGroups,
        rules,
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
        deps.access?.hidden.value
            ? undefined
            : {
                  title: i18n.global.t("clientGroups.fields.actions.label"),
                  value: "actions",
                  align: "end" as const,
                  width: "10%",
              },
    ].filter((header) => header !== undefined);

    const fallbackGroup = computed(() =>
        getScreenProctoringFallbackGroup({
            enabled: deps.screenProctoring.enabled.value,
            collectingStrategy: deps.screenProctoring.collectionStrategy.value,
            collectingGroupName: deps.screenProctoring.fallbackGroupName?.value,
        }),
    );

    const items = computed<ClientGroupForTable[]>(() =>
        [...deps.clientGroups.value, fallbackGroup.value].filter(
            (item) => item !== undefined,
        ),
    );

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
        access: deps.access,
        items: items,
        getFormFields,
        hasActions,
        createConfig: {
            title: i18n.global.t("clientGroups.addDialogTitle"),
            allowed: true,
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
                      title: i18n.global.t("clientGroups.deleteDialog.title"),
                      text: i18n.global.t("clientGroups.deleteDialog.text"),
                      confirmLabel: i18n.global.t(
                          "clientGroups.deleteDialog.action",
                      ),
                      getDetailText: (item: ClientGroupForTable) => item.name,
                  }
                : undefined,
        },
    };
};
