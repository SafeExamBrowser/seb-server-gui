<template>
    <v-row>
        <v-col class="text-subtitle-1">
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.updownloadView.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowDownUploadsVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.updownloadView.allow')"
                        @update:model-value="
                            saveSingleValue(
                                'allowDownUploads',
                                allowDownUploadsVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.updownloadView.allow_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowDownloadsVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.updownloadView.allowDownload',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowDownloads',
                                allowDownloadsVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-text-field
                        v-model="downloadDirectoryWinVal"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        :label="translate('sebSettings.updownloadView.dDirWin')"
                        variant="outlined"
                        hide-details
                        @update:focused="
                            saveOnFocusLost(
                                $event,
                                'downloadDirectoryWin',
                                downloadDirectoryWinVal,
                            )
                        "
                    >
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col :class="sebSettingsStore.fp">
                    <v-text-field
                        v-model="downloadDirectoryOSXVal"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        :label="translate('sebSettings.updownloadView.dDirMac')"
                        variant="outlined"
                        hide-details
                        @update:focused="
                            saveOnFocusLost(
                                $event,
                                'downloadDirectoryOSX',
                                downloadDirectoryOSXVal,
                            )
                        "
                    >
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowCustomDownUploadLocationVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.updownloadView.custom')"
                        @update:model-value="
                            saveSingleValue(
                                'allowCustomDownUploadLocation',
                                allowCustomDownUploadLocationVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="useTemporaryDownUploadDirectoryVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.updownloadView.useTemp')"
                        @update:model-value="
                            saveSingleValue(
                                'useTemporaryDownUploadDirectory',
                                useTemporaryDownUploadDirectoryVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="downloadPDFFilesVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate('sebSettings.updownloadView.download')
                        "
                        @update:model-value="
                            saveSingleValue(
                                'downloadPDFFiles',
                                downloadPDFFilesVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.updownloadView.download_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowPDFPlugInVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.updownloadView.allowPDFPlugin',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'allowPDFPlugIn',
                                allowPDFPlugInVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.updownloadView.allowPDFPlugin_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowUploadsVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.updownloadView.files')"
                        @update:model-value="
                            saveSingleValue(
                                'allowUploads',
                                allowUploadsVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.updownloadView.files_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="downloadAndOpenSebConfigVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.updownloadView.andOpen')"
                        @update:model-value="
                            saveSingleValue(
                                'downloadAndOpenSebConfig',
                                downloadAndOpenSebConfigVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.updownloadView.andOpen_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowUploadsiOSVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.updownloadView.photos')"
                        @update:model-value="
                            saveSingleValue(
                                'allowUploadsiOS',
                                allowUploadsiOSVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.updownloadView.photos_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
        </v-col>

        <v-col class="text-subtitle-1">
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.updownloadView.policy")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.updownloadView.policy_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-radio-group
                        v-model="chooseFileToUploadPolicyVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        @update:model-value="
                            saveSingleValue(
                                'chooseFileToUploadPolicy',
                                chooseFileToUploadPolicyVal,
                            )
                        "
                    >
                        <v-radio
                            :label="
                                translate('sebSettings.updownloadView.policy_0')
                            "
                            value="0"
                        >
                        </v-radio>
                        <v-radio
                            :label="
                                translate('sebSettings.updownloadView.policy_1')
                            "
                            value="1"
                        >
                        </v-radio>
                        <v-radio
                            :label="
                                translate('sebSettings.updownloadView.policy_2')
                            "
                            value="2"
                        >
                        </v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>
            <v-row class="font-weight-bold pt-8 pb-0">
                <v-col class="text-subtitle-1">
                    <v-row>
                        <v-col class="font-weight-bold">{{
                            translate(
                                "sebSettings.updownloadView.filetypes.title",
                            )
                        }}</v-col>
                        <v-col align="right">
                            <v-btn
                                color="primary"
                                density="compact"
                                :disabled="sebSettingsStore.readonly"
                                icon="mdi-plus-circle-outline"
                                variant="text"
                                @click="newFileType()"
                            >
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider>
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-data-table
                        class="rounded-lg elevation-4"
                        density="compact"
                        :headers="downloadFileTypesHeaders"
                        item-value="id"
                        :items="downloadFileTypesTable"
                        :items-per-page="
                            tableUtils.calcDefaultItemsPerPage(
                                downloadFileTypesTable,
                            )
                        "
                        :items-per-page-options="
                            tableUtils.calcItemsPerPage(downloadFileTypesTable)
                        "
                    >
                        <template
                            #headers="{
                                columns,
                                isSorted,
                                getSortIcon,
                                toggleSort,
                            }"
                        >
                            <TableHeaders
                                :columns="columns"
                                :get-sort-icon="getSortIcon"
                                :header-refs-prop="downloadFileTypesRef"
                                :is-sorted="isSorted"
                                :toggle-sort="toggleSort"
                            >
                            </TableHeaders>
                        </template>

                        <!-------File Extension hook ------->
                        <template #item.fileExtension="{ item }">
                            {{ item.fileExtension }}
                        </template>

                        <!-------Operating System hook ------->
                        <template #item.os="{ item }">
                            {{
                                translate(
                                    "sebSettings.updownloadView.filetypes.os_" +
                                        item.os,
                                    i18n,
                                )
                            }}
                        </template>

                        <!-------Identifier hook------->
                        <template #item.identifier="{ item }">
                            {{ item.identifier }}
                        </template>

                        <!-------edit button------->
                        <template #item.edit="{ item }">
                            <v-btn
                                icon="mdi-pencil-outline"
                                variant="text"
                                @click="fileTypeOpenEditDialog(item.index)"
                            >
                            </v-btn>
                        </template>

                        <!-------delete button------->
                        <template #item.delete="{ item }">
                            <v-btn
                                :disabled="sebSettingsStore.readonly"
                                icon="mdi-delete-outline"
                                variant="text"
                                @click="deleteFileType(item.index!)"
                            >
                            </v-btn>
                        </template>
                    </v-data-table>
                </v-col>
            </v-row>
        </v-col>
    </v-row>

    <!-----------edit download file type dialog---------->
    <v-dialog v-model="downloadFileTypesDialog" max-width="800">
        <EditFileDownloadRule
            :read-only="sebSettingsStore.readonly"
            :file-type="selectedDownloadFileType"
            @close-file-type-dialog="closeFileTypeDialog"
        >
        </EditFileDownloadRule>
    </v-dialog>
</template>

<script setup lang="ts">
import * as sebSettingsService from "@/services/seb-server/component-services/sebSettingsService";
import { useI18n } from "vue-i18n";
import { stringToBoolean, translate } from "@/utils/generalUtils";
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
import * as tableUtils from "@/utils/table/tableUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import EditFileDownloadRule from "./EditFileDownloadRule.vue";

const i18n = useI18n();
const sebSettingsStore = useSEBSettingsStore();

const allowDownUploadsVal = ref<boolean>(false);
const downloadDirectoryWinVal = ref<string>("");
const downloadDirectoryOSXVal = ref<string>("");
const allowCustomDownUploadLocationVal = ref<boolean>(false);
const chooseFileToUploadPolicyVal = ref<string>("0");
const downloadPDFFilesVal = ref<boolean>(false);
const allowPDFPlugInVal = ref<boolean>(false);
const downloadAndOpenSebConfigVal = ref<boolean>(false);
const allowUploadsVal = ref<boolean>(false);
const allowDownloadsVal = ref<boolean>(false);
const useTemporaryDownUploadDirectoryVal = ref<boolean>(false);
const allowUploadsiOSVal = ref<boolean>(false);

const downloadFileTypesDialog = ref<boolean>(false);
const selectedDownloadFileType = ref<FileExtensionEntry | null>(null);
const downloadFileTypesRef = ref<(HTMLElement | null)[]>([]);
const downloadFileTypesTable = ref<FileExtensionEntry[]>([]);
const downloadFileTypesHeaders = ref([
    {
        title: translate("sebSettings.updownloadView.filetypes.fileExtension"),
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

async function saveSingleValue(name: string, value: string) {
    const setting: SEBSettingsValue = getSingleValue(name);
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        setting.id.toString(),
        value,
        sebSettingsStore.isExam,
    );
}

async function saveOnFocusLost(focusIn: boolean, name: string, value: string) {
    if (!focusIn) {
        saveSingleValue(name, value);
    }
}

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

function newFileType() {
    selectedDownloadFileType.value = {
        index: -1,
        os: "0",
        fileExtension: "",
        identifier: "",
        ids: { os: -1, fileExtension: -1, identifier: -1 },
    };
    downloadFileTypesDialog.value = true;
}

async function deleteFileType(index: number) {
    const resp: SEBSettingsTableRowValues[] | null =
        await sebSettingsService.deleteSEBSettingTableRow(
            componentId,
            "downloadFileTypes",
            index,
            sebSettingsStore.isExam,
        );
    if (resp == null) {
        return;
    }

    updateFileTypesTable(resp);
}

function fileTypeOpenEditDialog(index: number) {
    selectedDownloadFileType.value = Object.assign(
        {},
        downloadFileTypesTable.value[index],
    );
    downloadFileTypesDialog.value = true;
}

async function closeFileTypeDialog(apply?: boolean) {
    downloadFileTypesDialog.value = false;

    if (!apply || selectedDownloadFileType.value == null) {
        return;
    }

    if (selectedDownloadFileType.value?.index === -1) {
        const resp: SEBSettingsTableRowValues | null =
            await sebSettingsService.newSEBSettingTableRow(
                componentId,
                "downloadFileTypes",
            );
        if (resp == null) {
            return;
        }

        const rowVals = new Map<string, SEBSettingsValue>(
            Object.entries(resp.rowValues),
        );

        insertFileType(resp.listIndex, rowVals);
        selectedDownloadFileType.value.index = resp.listIndex;
        selectedDownloadFileType.value.ids =
            downloadFileTypesTable.value[resp.listIndex].ids;
    }

    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedDownloadFileType.value.ids.os.toString(),
        selectedDownloadFileType.value.os,
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedDownloadFileType.value.ids.fileExtension.toString(),
        selectedDownloadFileType.value.fileExtension,
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedDownloadFileType.value.ids.identifier.toString(),
        selectedDownloadFileType.value.identifier,
        sebSettingsStore.isExam,
    );

    downloadFileTypesTable.value[selectedDownloadFileType.value.index] =
        selectedDownloadFileType.value;
}

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
