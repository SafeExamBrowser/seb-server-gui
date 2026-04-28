<template>
    <LoadingFallbackComponent
        :loading="loadingSebSettingsView"
        :errors="errorSebSettingsView"
    >
        <v-row v-if="singleValues">
            <v-col class="text-subtitle-1">
                <SettingsTitle label="sebSettings.updownloadView.title" />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowDownUploads"
                        label="sebSettings.updownloadView.allow"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowDownloads"
                        label="sebSettings.updownloadView.allowDownload"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <TextSetting
                        v-model="singleValues"
                        name="downloadDirectoryWin"
                        label="sebSettings.updownloadView.dDirWin"
                        :show-label="true"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <TextSetting
                        v-model="singleValues"
                        name="downloadDirectoryOSX"
                        label="sebSettings.updownloadView.dDirMac"
                        :show-label="true"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowCustomDownUploadLocation"
                        label="sebSettings.updownloadView.custom"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="useTemporaryDownUploadDirectory"
                        label="sebSettings.updownloadView.useTemp"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="downloadPDFFiles"
                        label="sebSettings.updownloadView.download"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowPDFPlugIn"
                        label="sebSettings.updownloadView.allowPDFPlugin"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowUploads"
                        label="sebSettings.updownloadView.files"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="downloadAndOpenSebConfig"
                        label="sebSettings.updownloadView.andOpen"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowUploadsiOS"
                        label="sebSettings.updownloadView.photos"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
            </v-col>

            <v-col class="text-subtitle-1">
                <SettingsTitle
                    label="sebSettings.updownloadView.policyTitle"
                    :tooltip="true"
                />
                <v-row>
                    <RadioSetting
                        v-model="singleValues"
                        name="chooseFileToUploadPolicy"
                        label="sebSettings.updownloadView.policy"
                        :disabled="context.readonly"
                    />
                </v-row>

                <!-- UPLOAD TYPE LIST
                TODO: @anhefti try to make SEB Settings lists composable. 
                Use better (more generic model) for the table values, see sebSettings.SEBSettingsTableRow model
                -->
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
                                    :disabled="context.readonly"
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
                                tableUtils.calcItemsPerPage(
                                    downloadFileTypesTable,
                                )
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
                                    :disabled="context.readonly"
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
                :read-only="context.readonly"
                :file-type="selectedDownloadFileType"
                @close-file-type-dialog="closeFileTypeDialog"
            >
            </EditFileDownloadRule>
        </v-dialog>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { translate } from "@/utils/generalUtils";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import { ref, watch } from "vue";
import {
    SEBSettingsTableRowValues,
    SEBSettingsValue,
    FileExtensionEntry,
} from "@/models/seb-server/sebSettings";
import * as tableUtils from "@/utils/table/tableUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import EditFileDownloadRule from "./components/tableDialogs/EditFileDownloadRule.vue";
import SettingsTitle from "./components/SettingsTitle.vue";
import RadioSetting from "./components/inputFields/RadioSetting.vue";
import CheckboxSetting from "./components/inputFields/CheckboxSetting.vue";
import TextSetting from "./components/inputFields/TextSetting.vue";
import { useSEBSettingValues } from "./composables/useSEBSettingValues";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { SEBSettingsContext } from "./types";

const i18n = useI18n();

const props = defineProps<{
    context: SEBSettingsContext;
}>();

const {
    singleValues,
    tableValues,
    loadingSebSettingsView,
    errorSebSettingsView,
} = useSEBSettingValues(
    props.context.isExam,
    props.context.containerId,
    ViewType.DOWN_UPLOAD,
);

watch(tableValues, () => {
    if (!tableValues.value) return;

    const fileTypes = tableValues.value.tableValues.get("downloadFileTypes");
    if (!fileTypes) return;

    updateFileTypesTable(fileTypes);
});

// UPLOAD TYPE LIST
// TODO: @anhefti try to make SEB Settings lists composable.
// Use better (more generic model) for the table values, see sebSettings.SEBSettingsTableRow model

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
    if (!tableValues.value) return;

    const resp = await tableValues.value.deleteTableRow(
        "downloadFileTypes",
        index,
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

    if (!tableValues.value) return;
    if (!apply || selectedDownloadFileType.value == null) {
        return;
    }

    if (selectedDownloadFileType.value?.index === -1) {
        const resp = await tableValues.value.addTableRow("downloadFileTypes");
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

    tableValues.value.saveTableRow([
        {
            id: selectedDownloadFileType.value.ids.os,
            value: selectedDownloadFileType.value.os,
        },
        {
            id: selectedDownloadFileType.value.ids.fileExtension,
            value: selectedDownloadFileType.value.fileExtension,
        },
        {
            id: selectedDownloadFileType.value.ids.identifier,
            value: selectedDownloadFileType.value.identifier,
        },
    ]);

    downloadFileTypesTable.value[selectedDownloadFileType.value.index] =
        selectedDownloadFileType.value;
}

function getStringValue(
    rowVals: Map<string, SEBSettingsValue>,
    name: string,
): string {
    const prop = rowVals.get(name);
    if (!prop) {
        const def = singleValues.value?.attributes.get(name);
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
