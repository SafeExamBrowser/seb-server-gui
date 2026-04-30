import { computed, Ref, ref } from "vue";
import {
    SEBSettingsSingeValueModel,
    SEBSettingsTableModel,
    SettingsTable,
} from "../types.ts";
import {
    FileExtensionEntry,
    SEBSettingsTableRowValues,
    SEBSettingsValue,
} from "@/models/seb-server/sebSettings.ts";
import { translate } from "@/utils/generalUtils.ts";
import { getSettingId, getStringValue } from "../helpers/settingsTable.ts";

export const HeaderRefs = ref<(HTMLElement | null)[]>([]);

export const useFileTypeTable = (
    tableModel: Ref<SEBSettingsTableModel | undefined>,
    singleValues: Ref<SEBSettingsSingeValueModel | undefined>,
) => {
    const dialog = ref<boolean>(false);
    const selectedRow = ref<FileExtensionEntry | null>(null);
    const table = ref<FileExtensionEntry[]>([]);
    const tableHeaders = ref([
        {
            title: translate(
                "sebSettings.updownloadView.filetypes.fileExtension",
            ),
            key: "fileExtension",
            sortable: true,
            width: "30%",
        },
        {
            title: translate("sebSettings.updownloadView.filetypes.os"),
            key: "os",
            sortable: true,
            width: "30%",
        },
        {
            title: translate("sebSettings.updownloadView.filetypes.identifier"),
            key: "identifier",
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

    const fileTypeTable = computed(() => {
        if (!tableModel.value) return undefined;

        const fileTypes = tableModel.value.tableValues.get("downloadFileTypes");
        if (!fileTypes) return undefined;

        updateFileTypesTable(fileTypes);

        return {
            table: table,
            selectedRow: selectedRow,
            dialog: dialog,

            editRow: editFileType,
            newRow: newFileType,
            deleteRow: deleteFileType,
            closeDialog: closeDialog,
        } as SettingsTable<FileExtensionEntry>;
    });

    // ********* File Type functions *********************
    function updateFileTypesTable(entries: SEBSettingsTableRowValues[]) {
        table.value.splice(0);
        entries.forEach((item) => {
            const rowVals = new Map<string, SEBSettingsValue>(
                Object.entries(item.rowValues),
            );
            insertFileType(item.listIndex, rowVals);
        });
    }

    function insertFileType(
        index: number,
        rowVals: Map<string, SEBSettingsValue>,
    ) {
        if (!singleValues.value) return;

        const attributes = singleValues.value.attributes;
        table.value.splice(index, 0, {
            index,
            os: getStringValue(rowVals, attributes, "downloadFileTypes.os"),
            fileExtension: getStringValue(
                rowVals,
                attributes,
                "downloadFileTypes.extension",
            ),
            identifier: getStringValue(
                rowVals,
                attributes,
                "downloadFileTypes.associatedAppId",
            ),
            ids: {
                os: getSettingId(rowVals, "downloadFileTypes.os"),
                fileExtension: getSettingId(
                    rowVals,
                    "downloadFileTypes.extension",
                ),
                identifier: getSettingId(
                    rowVals,
                    "downloadFileTypes.associatedAppId",
                ),
            },
        });
    }

    function newFileType() {
        selectedRow.value = {
            index: -1,
            os: "0",
            fileExtension: "",
            identifier: "",
            ids: { os: -1, fileExtension: -1, identifier: -1 },
        };
        dialog.value = true;
    }

    async function deleteFileType(index: number) {
        if (!tableModel.value) return;

        const resp = await tableModel.value.deleteTableRow(
            "downloadFileTypes",
            index,
        );
        if (resp == null) {
            return;
        }

        updateFileTypesTable(resp);
    }

    function editFileType(index: number) {
        selectedRow.value = Object.assign({}, table.value[index]);
        dialog.value = true;
    }

    async function closeDialog(apply?: boolean) {
        dialog.value = false;

        if (!tableModel.value) return;
        if (!apply || selectedRow.value == null) return;
        if (selectedRow.value?.index === -1) {
            const resp =
                await tableModel.value.addTableRow("downloadFileTypes");
            if (resp == null) return;

            const rowVals = new Map<string, SEBSettingsValue>(
                Object.entries(resp.rowValues),
            );

            insertFileType(resp.listIndex, rowVals);
            selectedRow.value.index = resp.listIndex;
            selectedRow.value.ids = table.value[resp.listIndex].ids;
        }

        tableModel.value.saveTableRow([
            {
                id: selectedRow.value.ids.os,
                value: selectedRow.value.os,
            },
            {
                id: selectedRow.value.ids.fileExtension,
                value: selectedRow.value.fileExtension,
            },
            {
                id: selectedRow.value.ids.identifier,
                value: selectedRow.value.identifier,
            },
        ]);

        table.value[selectedRow.value.index] = selectedRow.value;
    }

    return {
        fileTypeTable,
        tableHeaders,
    };
};
