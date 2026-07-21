import { computed, Ref, ref } from "vue";

import {
    getBooleanValue,
    getSettingId,
    getStringValue,
} from "@/components/widgets/sebSettings/helpers/settingsTable.ts";
import {
    SEBSettingsSingeValueModel,
    SEBSettingsTableModel,
    SettingsTable,
} from "@/components/widgets/sebSettings/types.ts";
import {
    ProhibitedProcess,
    SEBSettingsTableRowValues,
    SEBSettingsValue,
} from "@/models/seb-server/sebSettings.ts";
import { translate } from "@/utils/generalUtils.ts";

export const ProhibitedProcessTableHeaderRefs = ref<(HTMLElement | null)[]>([]);

export const useProhibitedProcessTable = (
    tableModel: Ref<SEBSettingsTableModel | undefined>,
    singleValues: Ref<SEBSettingsSingeValueModel | undefined>,
) => {
    const dialog = ref<boolean>(false);
    const selectedRow = ref<ProhibitedProcess | null>(null);
    const table = ref<ProhibitedProcess[]>([]);
    const tableHeaders = ref([
        {
            title: translate(
                "sebSettings.applicationView.prohibitedProcess.active",
            ),
            key: "active",
            sortable: true,
            width: "10%",
        },
        {
            title: translate(
                "sebSettings.applicationView.prohibitedProcess.os",
            ),
            key: "os",
            sortable: true,
            width: "10%",
        },
        {
            title: translate(
                "sebSettings.applicationView.prohibitedProcess.executable",
            ),
            key: "executable",
            sortable: true,
            width: "30%",
        },
        {
            title: translate(
                "sebSettings.applicationView.prohibitedProcess.description",
            ),
            key: "description",
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

    const prohibitedProcessTable = computed(() => {
        if (!tableModel.value) return undefined;

        const fileTypes = tableModel.value.tableValues.get(
            "prohibitedProcesses",
        );
        if (!fileTypes) return undefined;

        updateTable(fileTypes);

        return {
            table: table,
            selectedRow: selectedRow,
            dialog: dialog,

            editRow: prohibitedProcessOpenEditDialog,
            newRow: newProhibitedProcess,
            deleteRow: prohibitedProcessDelete,
            closeDialog: closeEditProhibitedProcessDialog,
        } as SettingsTable<ProhibitedProcess>;
    });

    // ********* prohibited processes functions *********************
    function updateTable(prohibitedProcesses: SEBSettingsTableRowValues[]) {
        table.value.splice(0);
        prohibitedProcesses.forEach((item) => {
            const rowVals = new Map<string, SEBSettingsValue>(
                Object.entries(item.rowValues),
            );
            insertProhibitedProcess(item.listIndex, rowVals);
        });
    }

    function insertProhibitedProcess(
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
                "prohibitedProcesses.active",
            ),
            os: getStringValue(rowVals, attributes, "prohibitedProcesses.os"),
            executable: getStringValue(
                rowVals,
                attributes,
                "prohibitedProcesses.executable",
            ),
            description: getStringValue(
                rowVals,
                attributes,
                "prohibitedProcesses.description",
            ),
            originalName: getStringValue(
                rowVals,
                attributes,
                "prohibitedProcesses.originalName",
            ),
            identifier: getStringValue(
                rowVals,
                attributes,
                "prohibitedProcesses.identifier",
            ),
            strongKill: getBooleanValue(
                rowVals,
                attributes,
                "prohibitedProcesses.strongKill",
            ),
            ignoreInAAC: getBooleanValue(
                rowVals,
                attributes,
                "prohibitedProcesses.ignoreInAAC",
            ),
            ids: {
                active: getSettingId(rowVals, "prohibitedProcesses.active"),
                os: getSettingId(rowVals, "prohibitedProcesses.os"),
                executable: getSettingId(
                    rowVals,
                    "prohibitedProcesses.executable",
                ),
                description: getSettingId(
                    rowVals,
                    "prohibitedProcesses.description",
                ),
                originalName: getSettingId(
                    rowVals,
                    "prohibitedProcesses.originalName",
                ),
                identifier: getSettingId(
                    rowVals,
                    "prohibitedProcesses.identifier",
                ),
                strongKill: getSettingId(
                    rowVals,
                    "prohibitedProcesses.strongKill",
                ),
                ignoreInAAC: getSettingId(
                    rowVals,
                    "prohibitedProcesses.ignoreInAAC",
                ),
            },
        });
    }

    function newProhibitedProcess() {
        // create empty selectedProhibitedProceses and open edit dialog
        selectedRow.value = {
            index: -1,
            active: true,
            os: "1",
            executable: "",
            originalName: "",
            description: "",
            identifier: "",
            strongKill: false,
            ignoreInAAC: true,
            ids: {
                active: -1,
                os: -1,
                executable: -1,
                originalName: -1,
                description: -1,
                identifier: -1,
                strongKill: -1,
                ignoreInAAC: -1,
            },
        };
        dialog.value = true;
    }

    async function prohibitedProcessDelete(index: number) {
        if (!tableModel.value) return;

        const resp: SEBSettingsTableRowValues[] | null =
            await tableModel.value.deleteTableRow("prohibitedProcesses", index);
        if (resp == null) {
            return;
        }

        updateTable(resp);
    }

    function prohibitedProcessOpenEditDialog(index: number) {
        selectedRow.value = Object.assign({}, table.value[index]);
        dialog.value = true;
    }

    async function closeEditProhibitedProcessDialog(apply?: boolean) {
        dialog.value = false;

        if (!tableModel.value) return;
        if (!apply || selectedRow.value == null) return;
        if (selectedRow.value.index === -1) {
            const resp = await tableModel.value.addTableRow(
                "prohibitedProcesses",
            );
            if (resp == null) return;

            const rowVals = new Map<string, SEBSettingsValue>(
                Object.entries(resp.rowValues),
            );

            insertProhibitedProcess(resp.listIndex, rowVals);
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
                value: selectedRow.value.executable.toString(),
            },
            {
                id: selectedRow.value.ids.description,
                value: selectedRow.value.description.toString(),
            },
            {
                id: selectedRow.value.ids.originalName,
                value: selectedRow.value.originalName,
            },
            {
                id: selectedRow.value.ids.identifier,
                value: selectedRow.value.identifier,
            },
            {
                id: selectedRow.value.ids.strongKill,
                value: selectedRow.value.strongKill ? "true" : "false",
            },
            {
                id: selectedRow.value.ids.ignoreInAAC,
                value: selectedRow.value.ignoreInAAC ? "true" : "false",
            },
        ]);

        table.value[selectedRow.value.index] = selectedRow.value;
    }

    return {
        prohibitedProcessTable,
        tableHeaders,
    };
};
