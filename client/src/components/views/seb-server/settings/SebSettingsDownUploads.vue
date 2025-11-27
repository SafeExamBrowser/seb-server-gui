<template>
    <v-row> DOWN_UPLOAD Settings TODO </v-row>
</template>

<script setup lang="ts">
import * as sebSettingsService from "@/services/seb-server/component-services/sebSettingsService";
// import { useI18n } from "vue-i18n";
import { stringToBoolean } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import { ref, onBeforeMount } from "vue";
import {
    SEBSettingsTableRowValues,
    SEBSettingsValue,
    SEBSettingsView,
    FileExtensionEntry,
    SEBSettingAttribute,
} from "@/models/seb-server/sebSettings";

//const i18n = useI18n();
const sebSettingsStore = useSEBSettingsStore();

const allowDownUploadsVal = ref<boolean>(false);
const downloadDirectoryWinVal = ref<string>("");
const downloadDirectoryOSXVal = ref<string>("");
const allowCustomDownUploadLocationVal = ref<boolean>(false);
const chooseFileToUploadPolicyVal = ref<string>("0");
const chooseFileToUploadPolicyItems = ref<{ title: string; value: string }[]>(
    [],
);
const downloadPDFFilesVal = ref<boolean>(false);
const allowPDFPlugInVal = ref<boolean>(false);
const downloadAndOpenSebConfigVal = ref<boolean>(false);
const allowUploadsVal = ref<boolean>(false);
const allowDownloadsVal = ref<boolean>(false);
const useTemporaryDownUploadDirectoryVal = ref<boolean>(false);
const allowUploadsiOSVal = ref<boolean>(false);

//const downloadFileTypesDialog = ref<boolean>(false);
//const selectedDownloadFileType = ref<FileExtensionEntry | null>(null);
//const downloadFileTypesRef = ref<(HTMLElement | null)[]>([]);
const downloadFileTypesTable = ref<FileExtensionEntry[]>([]);
// const downloadFileTypesHeaders = ref([
//     {
//         title: translate("sebSettings.updownloadView.filetypes.ext"),
//         key: "active",
//         sortable: true,
//         width: "33%",
//     },
//     {
//         title: translate("sebSettings.updownloadView.filetypes.os"),
//         key: "regex",
//         sortable: true,
//         width: "33%",
//     },
//     {
//         title: translate("sebSettings.updownloadView.filetypes.id"),
//         key: "expression",
//         sortable: true,
//         width: "33%",
//     },
// ]);

// the parent component identifier
let componentId: string;
let singleValues: Map<string, SEBSettingsValue>;
let attributes: Map<string, SEBSettingAttribute>;

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    componentId = sebSettingsStore.selectedContainerId.toString();

    const duSettings: SEBSettingsView | null =
        await sebSettingsService.getViewSettings(
            ViewType.DOWN_UPLOAD,
            componentId,
            sebSettingsStore.isExam,
        );

    if (duSettings == null) {
        return;
    }

    singleValues = new Map<string, SEBSettingsValue>(
        Object.entries(duSettings.singleValues),
    );

    attributes = new Map<string, SEBSettingAttribute>(
        Object.entries(duSettings.attributes),
    );

    allowDownUploadsVal.value = stringToBoolean(
        getSingleValue("allowDownUploads").value,
    );
    downloadDirectoryWinVal.value = getSingleValue(
        "downloadDirectoryWin",
    ).value;
    downloadDirectoryOSXVal.value = getSingleValue(
        "downloadDirectoryOSX",
    ).value;
    allowCustomDownUploadLocationVal.value = stringToBoolean(
        getSingleValue("allowCustomDownUploadLocation").value,
    );
    chooseFileToUploadPolicyVal.value = getSingleValue(
        "chooseFileToUploadPolicy",
    ).value;
    attributes
        .get("chooseFileToUploadPolicy")
        ?.resources?.split(",")
        .forEach((item) => {
            chooseFileToUploadPolicyItems.value.push({
                title: item,
                value: item,
            });
        });

    downloadPDFFilesVal.value = stringToBoolean(
        getSingleValue("downloadPDFFiles").value,
    );
    allowPDFPlugInVal.value = stringToBoolean(
        getSingleValue("allowPDFPlugIn").value,
    );
    downloadAndOpenSebConfigVal.value = stringToBoolean(
        getSingleValue("downloadAndOpenSebConfig").value,
    );
    allowUploadsVal.value = stringToBoolean(
        getSingleValue("allowUploads").value,
    );
    allowDownloadsVal.value = stringToBoolean(
        getSingleValue("allowDownloads").value,
    );
    useTemporaryDownUploadDirectoryVal.value = stringToBoolean(
        getSingleValue("useTemporaryDownUploadDirectory").value,
    );
    allowUploadsiOSVal.value = stringToBoolean(
        getSingleValue("allowUploadsiOS").value,
    );

    // File Extensions
    const tableValues: Map<string, SEBSettingsTableRowValues[]> = new Map<
        string,
        SEBSettingsTableRowValues[]
    >(Object.entries(duSettings.tableValues));

    const fileTypes = tableValues.get("downloadFileTypes");
    if (fileTypes == null) {
        return;
    }
    updateFileTypesTable(fileTypes);
});

// async function saveSingleValue(name: string, value: string) {
//     const setting: SEBSettingsValue = getSingleValue(name);
//     await sebSettingsService.updateSEBSettingValue(
//         componentId,
//         setting.id.toString(),
//         value,
//         sebSettingsStore.isExam,
//     );
// }

// async function saveOnFocusLost(focusIn: boolean, name: string, value: string) {
//     if (!focusIn) {
//         saveSingleValue(name, value);
//     }
// }

function getSingleValue(name: string): SEBSettingsValue {
    const value = singleValues.get(name);
    if (!value) {
        throw new Error("No Single Value" + name + " found");
    }

    return value;
}

// ********* File Type functions *********************
function updateFileTypesTable(entries: SEBSettingsTableRowValues[]) {
    downloadFileTypesTable.value.splice(0);
    entries.forEach((item) => {
        const rowVals = new Map<string, SEBSettingsValue>(
            Object.entries(item.rowValues),
        );
        insertFileType(item.listIndex, rowVals);
    });
}

function insertFileType(index: number, rowVals: Map<string, SEBSettingsValue>) {
    downloadFileTypesTable.value.splice(index, 0, {
        index,
        os: getStringValue(rowVals, "downloadFileTypes.os"),
        fileExtension: getStringValue(rowVals, "downloadFileTypes.extension"),
        identifier: getStringValue(
            rowVals,
            "downloadFileTypes.associatedAppId",
        ),
        ids: {
            os: getSettingId(rowVals, "downloadFileTypes.os"),
            fileExtension: getSettingId(rowVals, "downloadFileTypes.extension"),
            identifier: getSettingId(
                rowVals,
                "downloadFileTypes.associatedAppId",
            ),
        },
    });
}

// function newFileType() {
//     selectedDownloadFileType.value = {
//         index: -1,
//         os: "0",
//         fileExtension: "",
//         identifier: "",
//         ids: { os: -1, fileExtension: -1, identifier: -1 },
//     };
//     downloadFileTypesDialog.value = true;
// }

// async function deleteFileType(index: number) {
//     const resp: SEBSettingsTableRowValues[] | null =
//         await sebSettingsService.deleteSEBSettingTableRow(
//             componentId,
//             "downloadFileTypes",
//             index,
//             sebSettingsStore.isExam,
//         );
//     if (resp == null) {
//         return;
//     }

//     updateFileTypesTable(resp);
// }

// function fileTypeOpenEditDialog(index: number) {
//     selectedDownloadFileType.value = Object.assign(
//         {},
//         downloadFileTypesTable.value[index],
//     );
//     downloadFileTypesDialog.value = true;
// }

// async function closeFileTypeDialog(apply?: boolean) {
//     downloadFileTypesDialog.value = false;

//     if (!apply || selectedDownloadFileType.value == null) {
//         return;
//     }

//     if (selectedDownloadFileType.value?.index === -1) {
//         const resp: SEBSettingsTableRowValues | null =
//             await sebSettingsService.newSEBSettingTableRow(
//                 componentId,
//                 "downloadFileTypes",
//                 sebSettingsStore.isExam,
//             );
//         if (resp == null) {
//             return;
//         }

//         const rowVals = new Map<string, SEBSettingsValue>(
//             Object.entries(resp.rowValues),
//         );

//         insertFileType(resp.listIndex, rowVals);
//         selectedDownloadFileType.value.index = resp.listIndex;
//         selectedDownloadFileType.value.ids =
//             downloadFileTypesTable.value[resp.listIndex].ids;
//     }

//     await sebSettingsService.updateSEBSettingValue(
//         componentId,
//         selectedDownloadFileType.value.ids.os.toString(),
//         selectedDownloadFileType.value.os,
//         sebSettingsStore.isExam,
//     );
//     await sebSettingsService.updateSEBSettingValue(
//         componentId,
//         selectedDownloadFileType.value.ids.fileExtension.toString(),
//         selectedDownloadFileType.value.fileExtension,
//         sebSettingsStore.isExam,
//     );
//     await sebSettingsService.updateSEBSettingValue(
//         componentId,
//         selectedDownloadFileType.value.ids.identifier.toString(),
//         selectedDownloadFileType.value.identifier,
//         sebSettingsStore.isExam,
//     );

//     downloadFileTypesTable.value[selectedDownloadFileType.value.index] =
//         selectedDownloadFileType.value;
// }

function getStringValue(
    rowVals: Map<string, SEBSettingsValue>,
    name: string,
): string {
    const prop = rowVals.get(name);
    if (!prop) {
        const def = attributes.get(name);
        if (!def) {
            throw new Error("No SEB Setting" + name + " found");
        } else {
            return def.defaultValue;
        }
    } else {
        return prop.value;
    }
}

function getSettingId(
    rowVals: Map<string, SEBSettingsValue>,
    name: string,
): number {
    const prop = rowVals.get(name);
    if (!prop) {
        throw new Error("No SEB Setting" + name + " found");
    }

    return prop?.id;
}
</script>
