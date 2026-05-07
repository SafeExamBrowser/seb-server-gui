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
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="openDownloads"
                        label="sebSettings.updownloadView.openDownloads"
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
                                    v-if="fileTypeTable"
                                    color="primary"
                                    density="compact"
                                    :disabled="context.readonly"
                                    icon="mdi-plus-circle-outline"
                                    variant="text"
                                    @click="fileTypeTable.newRow()"
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
                            v-if="fileTypeTable"
                            class="rounded-lg elevation-4"
                            density="compact"
                            :headers="tableHeaders"
                            item-value="id"
                            :items="fileTypeTable.table.value"
                            :items-per-page="
                                tableUtils.calcDefaultItemsPerPage(
                                    fileTypeTable.table.value,
                                )
                            "
                            :items-per-page-options="
                                tableUtils.calcItemsPerPage(
                                    fileTypeTable.table.value,
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
                                    :header-refs-prop="HeaderRefs"
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
                                    @click="fileTypeTable.editRow(item.index)"
                                >
                                </v-btn>
                            </template>

                            <!-------delete button------->
                            <template #item.delete="{ item }">
                                <v-btn
                                    :disabled="context.readonly"
                                    icon="mdi-delete-outline"
                                    variant="text"
                                    @click="
                                        fileTypeTable.deleteRow(item.index!)
                                    "
                                >
                                </v-btn>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <!-----------edit download file type dialog---------->
        <v-dialog
            v-if="fileTypeTable"
            v-model="fileTypeTable.dialog.value"
            max-width="800"
        >
            <EditFileDownloadRule
                :read-only="context.readonly"
                :file-type="fileTypeTable.selectedRow.value"
                @close-file-type-dialog="fileTypeTable.closeDialog"
            >
            </EditFileDownloadRule>
        </v-dialog>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { translate } from "@/utils/generalUtils.ts";
import { ViewType } from "@/models/seb-server/sebSettingsEnums.ts";
import * as tableUtils from "@/utils/table/tableUtils.ts";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import EditFileDownloadRule from "./components/tableDialogs/EditFileDownloadRule.vue";
import SettingsTitle from "./components/SettingsTitle.vue";
import RadioSetting from "./components/inputFields/RadioSetting.vue";
import CheckboxSetting from "./components/inputFields/CheckboxSetting.vue";
import TextSetting from "./components/inputFields/TextSetting.vue";
import { useSEBSettingValues } from "./composables/useSEBSettingValues.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { SEBSettingsContext } from "./types.ts";
import {
    HeaderRefs,
    useFileTypeTable,
} from "./composables/useFileTypeTable.ts";

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

const { fileTypeTable, tableHeaders } = useFileTypeTable(
    tableValues,
    singleValues,
);
</script>
