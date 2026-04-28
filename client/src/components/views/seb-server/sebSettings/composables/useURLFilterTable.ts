import { computed, Ref, ref } from "vue";
import {
    SEBSettingsSingeValueModel,
    SEBSettingsTableModel,
    SettingsTable,
} from "../types";
import {
    SEBSettingsTableRowValues,
    SEBSettingsValue,
    URLFilterRule,
} from "@/models/seb-server/sebSettings";
import { translate } from "@/utils/generalUtils";
import {
    getBooleanValue,
    getSettingId,
    getStringValue,
} from "../helpers/settingsTable";

export const HeaderRefs = ref<(HTMLElement | null)[]>([]);

export const useURLFilterRuleTable = (
    tableModel: Ref<SEBSettingsTableModel | undefined>,
    singleValues: Ref<SEBSettingsSingeValueModel | undefined>,
) => {
    const dialog = ref<boolean>(false);
    const selectedRow = ref<URLFilterRule | null>(null);
    const table = ref<URLFilterRule[]>([]);
    const tableHeaders = ref([
        {
            title: translate("sebSettings.networkView.URLFilterRules.active"),
            key: "active",
            sortable: true,
            width: "10%",
        },
        {
            title: translate("sebSettings.networkView.URLFilterRules.regex"),
            key: "regex",
            sortable: true,
            width: "10%",
        },
        {
            title: translate(
                "sebSettings.networkView.URLFilterRules.expression",
            ),
            key: "expression",
            sortable: true,
            width: "50%",
        },
        {
            title: translate("sebSettings.networkView.URLFilterRules.action"),
            key: "action",
            sortable: true,
            width: "30%",
        },
        {
            title: translate("general.editButton"),
            key: "edit",
            sortable: false,
            width: "5%",
            center: true,
        },
        {
            title: translate("general.deleteButton"),
            key: "delete",
            sortable: false,
            width: "5%",
            center: true,
        },
    ]);

    const urlFilterRuleTable = computed(() => {
        if (!tableModel.value) return undefined;

        const fileTypes = tableModel.value.tableValues.get("URLFilterRules");
        if (!fileTypes) return undefined;

        updateTable(fileTypes);

        return {
            table: table,
            selectedRow: selectedRow,
            dialog: dialog,

            editRow: urlFilterRuleOpenEditDialog,
            newRow: newURLFilterRule,
            deleteRow: urlFilterRuleDelete,
            closeDialog: closeEditURLFilterRuleDialog,
        } as SettingsTable<URLFilterRule>;
    });

    // ********* URL Filter Rule functions *********************
    function updateTable(urlFilterRules: SEBSettingsTableRowValues[]) {
        table.value.splice(0);
        urlFilterRules.forEach((item) => {
            const rowVals = new Map<string, SEBSettingsValue>(
                Object.entries(item.rowValues),
            );
            insertURLFilter(item.listIndex, rowVals);
        });
    }

    function insertURLFilter(
        index: number,
        rowVals: Map<string, SEBSettingsValue>,
    ) {
        if (!singleValues.value) return;
        const attributes = singleValues.value.attributes;
        table.value.splice(index, 0, {
            index,
            active: getBooleanValue(
                rowVals,
                attributes,
                "URLFilterRules.active",
            ),
            regex: getBooleanValue(rowVals, attributes, "URLFilterRules.regex"),
            expression: getStringValue(
                rowVals,
                attributes,
                "URLFilterRules.expression",
            ),
            action: getStringValue(
                rowVals,
                attributes,
                "URLFilterRules.action",
            ),
            ids: {
                active: getSettingId(rowVals, "URLFilterRules.active"),
                regex: getSettingId(rowVals, "URLFilterRules.regex"),
                expression: getSettingId(rowVals, "URLFilterRules.expression"),
                action: getSettingId(rowVals, "URLFilterRules.action"),
            },
        });
    }

    function newURLFilterRule() {
        selectedRow.value = {
            index: -1,
            active: true,
            regex: false,
            expression: "",
            action: "0",
            ids: { active: -1, regex: -1, expression: -1, action: -1 },
        };
        dialog.value = true;
    }

    async function urlFilterRuleDelete(index: number) {
        if (!tableModel.value) return;

        const resp = await tableModel.value.deleteTableRow(
            "URLFilterRules",
            index,
        );
        if (resp == null) return;
        updateTable(resp);
    }

    function urlFilterRuleOpenEditDialog(index: number) {
        selectedRow.value = Object.assign({}, table.value[index]);
        dialog.value = true;
    }

    async function closeEditURLFilterRuleDialog(apply?: boolean) {
        dialog.value = false;

        if (!tableModel.value) return;
        if (!apply || selectedRow.value == null) return;
        if (selectedRow.value?.index === -1) {
            const resp = await tableModel.value.addTableRow("URLFilterRules");
            if (resp == null) return;

            const rowVals = new Map<string, SEBSettingsValue>(
                Object.entries(resp.rowValues),
            );

            insertURLFilter(resp.listIndex, rowVals);
            selectedRow.value.index = resp.listIndex;
            selectedRow.value.ids = table.value[resp.listIndex].ids;
        }

        tableModel.value.saveTableRow([
            {
                id: selectedRow.value.ids.active,
                value: selectedRow.value.active ? "true" : "false",
            },
            {
                id: selectedRow.value.ids.regex,
                value: selectedRow.value.regex ? "true" : "false",
            },
            {
                id: selectedRow.value.ids.expression,
                value: selectedRow.value.expression,
            },
            {
                id: selectedRow.value.ids.action,
                value: selectedRow.value.action,
            },
        ]);

        table.value[selectedRow.value.index] = selectedRow.value;
    }

    return {
        urlFilterRuleTable,
        tableHeaders,
    };
};
