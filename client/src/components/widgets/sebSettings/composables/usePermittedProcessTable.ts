import { computed, Ref, ref } from "vue";
import {
    SEBSettingsSingeValueModel,
    SEBSettingsTableModel,
    SettingsTable,
} from "@/components/widgets/sebSettings/types.ts";
import {
    PermittedProcess,
    SEBSettingsTableRowValues,
    SEBSettingsValue,
} from "@/models/seb-server/sebSettings.ts";
import { translate } from "@/utils/generalUtils.ts";
import {
    argumentsToString,
    getBooleanValue,
    getPermittedProcessArguments,
    getSettingId,
    getStringValue,
} from "@/components/widgets/sebSettings/helpers/settingsTable.ts";

export const PermittedProcessTableHeaderRefs = ref<(HTMLElement | null)[]>([]);

export const usePermittedProcessTable = (
    tableModel: Ref<SEBSettingsTableModel | undefined>,
    singleValues: Ref<SEBSettingsSingeValueModel | undefined>,
) => {
    const dialog = ref<boolean>(false);
    const selectedRow = ref<PermittedProcess | null>(null);
    const table = ref<PermittedProcess[]>([]);
    const tableHeaders = ref([
        {
            title: translate(
                "sebSettings.applicationView.permittedProcess.active",
            ),
            key: "active",
            sortable: true,
            width: "10%",
        },
        {
            title: translate("sebSettings.applicationView.permittedProcess.os"),
            key: "os",
            sortable: true,
            width: "10%",
        },
        {
            title: translate(
                "sebSettings.applicationView.permittedProcess.executable",
            ),
            key: "executable",
            sortable: true,
            width: "30%",
        },
        {
            title: translate(
                "sebSettings.applicationView.permittedProcess.title",
            ),
            key: "title",
            sortable: true,
            width: "50%",
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

    const permittedProcessTable = computed(() => {
        if (!tableModel.value) return undefined;

        const fileTypes =
            tableModel.value.tableValues.get("permittedProcesses");
        if (!fileTypes) return undefined;

        updateTable(fileTypes);

        return {
            table: table,
            selectedRow: selectedRow,
            dialog: dialog,

            editRow: permittedProcessOpenEditDialog,
            newRow: newPermittedProcess,
            deleteRow: permittedProcessDelete,
            closeDialog: closeEditPermittedProcessDialog,
        } as SettingsTable<PermittedProcess>;
    });

    // ********* permitted processes functions *********************
    function updateTable(permittedProcesses: SEBSettingsTableRowValues[]) {
        table.value.splice(0);
        permittedProcesses.forEach((item) => {
            const rowVals = new Map<string, SEBSettingsValue>(
                Object.entries(item.rowValues),
            );
            insertPermittedProcess(item.listIndex, rowVals);
        });
    }

    function insertPermittedProcess(
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
                "permittedProcesses.active",
            ),
            os: getStringValue(rowVals, attributes, "permittedProcesses.os"),
            executable: getStringValue(
                rowVals,
                attributes,
                "permittedProcesses.executable",
            ),
            originalName: getStringValue(
                rowVals,
                attributes,
                "permittedProcesses.originalName",
            ),
            title: getStringValue(
                rowVals,
                attributes,
                "permittedProcesses.title",
            ),
            signature: getStringValue(
                rowVals,
                attributes,
                "permittedProcesses.signature",
            ),
            path: getStringValue(
                rowVals,
                attributes,
                "permittedProcesses.path",
            ),
            iconInTaskbar: getBooleanValue(
                rowVals,
                attributes,
                "permittedProcesses.iconInTaskbar",
            ),
            arguments: getPermittedProcessArguments(
                getStringValue(
                    rowVals,
                    attributes,
                    "permittedProcesses.arguments",
                ),
            ),

            autostart: getBooleanValue(
                rowVals,
                attributes,
                "permittedProcesses.autostart",
            ),
            runInBackground: getBooleanValue(
                rowVals,
                attributes,
                "permittedProcesses.runInBackground",
            ),
            allowManualStart: getBooleanValue(
                rowVals,
                attributes,
                "permittedProcesses.allowManualStart",
            ),
            allowUserToChooseApp: getBooleanValue(
                rowVals,
                attributes,
                "permittedProcesses.allowUserToChooseApp",
            ),
            allowNetworkAccess: getBooleanValue(
                rowVals,
                attributes,
                "permittedProcesses.allowNetworkAccess",
            ),
            strongKill: getBooleanValue(
                rowVals,
                attributes,
                "permittedProcesses.strongKill",
            ),
            allowAccessibility: getBooleanValue(
                rowVals,
                attributes,
                "permittedProcesses.allowAccessibility",
            ),
            teamIdentifier: getStringValue(
                rowVals,
                attributes,
                "permittedProcesses.teamIdentifier",
            ),
            ids: {
                active: getSettingId(rowVals, "permittedProcesses.active"),
                os: getSettingId(rowVals, "permittedProcesses.os"),
                executable: getSettingId(
                    rowVals,
                    "permittedProcesses.executable",
                ),
                originalName: getSettingId(
                    rowVals,
                    "permittedProcesses.originalName",
                ),
                title: getSettingId(rowVals, "permittedProcesses.title"),
                signature: getSettingId(
                    rowVals,
                    "permittedProcesses.signature",
                ),
                path: getSettingId(rowVals, "permittedProcesses.path"),
                iconInTaskbar: getSettingId(
                    rowVals,
                    "permittedProcesses.iconInTaskbar",
                ),
                arguments: getSettingId(
                    rowVals,
                    "permittedProcesses.arguments",
                ),
                autostart: getSettingId(
                    rowVals,
                    "permittedProcesses.autostart",
                ),
                runInBackground: getSettingId(
                    rowVals,
                    "permittedProcesses.runInBackground",
                ),
                allowManualStart: getSettingId(
                    rowVals,
                    "permittedProcesses.allowManualStart",
                ),
                allowUserToChooseApp: getSettingId(
                    rowVals,
                    "permittedProcesses.allowUserToChooseApp",
                ),
                allowNetworkAccess: getSettingId(
                    rowVals,
                    "permittedProcesses.allowNetworkAccess",
                ),
                strongKill: getSettingId(
                    rowVals,
                    "permittedProcesses.strongKill",
                ),
                allowAccessibility: getSettingId(
                    rowVals,
                    "permittedProcesses.allowAccessibility",
                ),
                teamIdentifier: getSettingId(
                    rowVals,
                    "permittedProcesses.teamIdentifier",
                ),
            },
        });
    }

    function newPermittedProcess() {
        // create empty selectedPermittedProceses and open edit dialog
        selectedRow.value = {
            index: -1,
            active: true,
            os: "1",
            executable: "",
            originalName: "",
            title: "",
            signature: "",
            path: "",
            iconInTaskbar: true,
            arguments: [],
            autostart: false,
            runInBackground: false,
            allowManualStart: false,
            allowUserToChooseApp: false,
            allowNetworkAccess: true,
            strongKill: false,
            allowAccessibility: false,
            teamIdentifier: "",
            ids: {
                active: -1,
                os: -1,
                executable: -1,
                originalName: -1,
                title: -1,
                signature: -1,
                path: -1,
                iconInTaskbar: -1,
                arguments: -1,
                autostart: -1,
                runInBackground: -1,
                allowManualStart: -1,
                allowUserToChooseApp: -1,
                allowNetworkAccess: -1,
                strongKill: -1,
                allowAccessibility: -1,
                teamIdentifier: -1,
            },
        };
        dialog.value = true;
    }

    async function permittedProcessDelete(index: number) {
        if (!tableModel.value) return;

        const resp = await tableModel.value.deleteTableRow(
            "permittedProcesses",
            index,
        );
        if (resp == null) return;
        updateTable(resp);
    }

    function permittedProcessOpenEditDialog(index: number) {
        selectedRow.value = Object.assign({}, table.value[index]);
        dialog.value = true;
    }

    async function closeEditPermittedProcessDialog(apply?: boolean) {
        dialog.value = false;

        if (!tableModel.value) return;
        if (!apply || selectedRow.value == null) return;
        if (selectedRow.value?.index === -1) {
            const resp =
                await tableModel.value.addTableRow("permittedProcesses");
            if (resp == null) return;

            const rowVals = new Map<string, SEBSettingsValue>(
                Object.entries(resp.rowValues),
            );

            insertPermittedProcess(resp.listIndex, rowVals);
            selectedRow.value.index = resp.listIndex;
            selectedRow.value.ids = table.value[resp.listIndex].ids;
        }

        tableModel.value.saveTableRow([
            {
                id: selectedRow.value.ids.active,
                value: selectedRow.value.active ? "true" : "false",
            },
            {
                id: selectedRow.value.ids.os,
                value: selectedRow.value.os,
            },
            {
                id: selectedRow.value.ids.executable,
                value: selectedRow.value.executable,
            },
            {
                id: selectedRow.value.ids.title,
                value: selectedRow.value.title,
            },
            {
                id: selectedRow.value.ids.originalName,
                value: selectedRow.value.originalName,
            },
            {
                id: selectedRow.value.ids.signature,
                value: selectedRow.value.signature,
            },
            {
                id: selectedRow.value.ids.path,
                value: selectedRow.value.path,
            },
            {
                id: selectedRow.value.ids.iconInTaskbar,
                value: selectedRow.value.iconInTaskbar ? "true" : "false",
            },
            {
                id: selectedRow.value.ids.arguments,
                value: argumentsToString(selectedRow.value.arguments),
            },
            {
                id: selectedRow.value.ids.autostart,
                value: selectedRow.value.autostart ? "true" : "false",
            },
            {
                id: selectedRow.value.ids.runInBackground,
                value: selectedRow.value.runInBackground ? "true" : "false",
            },
            {
                id: selectedRow.value.ids.allowManualStart,
                value: selectedRow.value.allowManualStart ? "true" : "false",
            },
            {
                id: selectedRow.value.ids.allowUserToChooseApp,
                value: selectedRow.value.allowUserToChooseApp
                    ? "true"
                    : "false",
            },
            {
                id: selectedRow.value.ids.allowNetworkAccess,
                value: selectedRow.value.allowNetworkAccess ? "true" : "false",
            },
            {
                id: selectedRow.value.ids.strongKill,
                value: selectedRow.value.strongKill ? "true" : "false",
            },
            {
                id: selectedRow.value.ids.teamIdentifier,
                value: selectedRow.value.teamIdentifier,
            },
        ]);

        table.value[selectedRow.value.index] = selectedRow.value;
    }

    return {
        permittedProcessTable,
        tableHeaders,
    };
};
