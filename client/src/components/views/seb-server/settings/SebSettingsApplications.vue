<template>
    <v-row>
        <v-col>
            <v-checkbox-btn
                v-model="allowSwitchToApplicationsVal"
                :disabled="sebSettingsStore.readonly"
                :label="
                    translate(
                        'sebSettings.applicationView.allowSwitchToApplications',
                    )
                "
                @update:model-value="
                    saveSingleValue(
                        allowSwitchToApplications.id,
                        allowSwitchToApplicationsVal ? 'true' : 'false',
                    )
                "
            ></v-checkbox-btn>
        </v-col>
    </v-row>

    <v-row>
        <v-col class="text-subtitle-1">
            <v-row>
                <v-col>{{
                    translate(
                        "sebSettings.applicationView.permittedProcess.settingName",
                    )
                }}</v-col>
                <v-col align="right">
                    <v-btn
                        color="primary"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        icon="mdi-plus-circle-outline"
                        variant="text"
                        @click="newPermittedProcess()"
                    >
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider class="border-opacity-25" :thickness="2"></v-divider>
        </v-col>
    </v-row>

    <v-row>
        <v-col>
            <v-data-table
                class="rounded-lg elevation-4"
                density="compact"
                :headers="permittedProcessHeaders"
                item-value="id"
                :items="permittedProcessTable"
                :items-per-page="
                    tableUtils.calcDefaultItemsPerPage(permittedProcessTable)
                "
                :items-per-page-options="
                    tableUtils.calcItemsPerPage(permittedProcessTable)
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
                        :header-refs-prop="permittedProcessHeadersRef"
                        :is-sorted="isSorted"
                        :toggle-sort="toggleSort"
                    >
                    </TableHeaders>
                </template>

                <!-------active hook------->
                <template #item.active="{ item }">
                    {{ translate("general." + item.active, i18n) }}
                </template>

                <!-------OS hook------->
                <template #item.os="{ item }">
                    {{
                        translate(
                            "sebSettings.applicationView.prohibitedProcess.os_" +
                                item.os,
                            i18n,
                        )
                    }}
                </template>

                <!-------edit button------->
                <template #item.edit="{ item }">
                    <v-btn
                        icon="mdi-pencil-outline"
                        variant="text"
                        @click="permittedProcessOpenEditDialog(item.index)"
                    >
                    </v-btn>
                </template>

                <!-------delete button------->
                <template #item.delete="{ item }">
                    <v-btn
                        :disabled="sebSettingsStore.readonly"
                        icon="mdi-delete-outline"
                        variant="text"
                        @click="permittedProcessDelete(item.index!)"
                    >
                    </v-btn>
                </template>
            </v-data-table>
        </v-col>
    </v-row>

    <!-----------edit permitted process dialog---------->
    <v-dialog v-model="editPermittedProcessDialog" max-width="800">
        <EditPermittedProcess
            :permitted-process="selectedPermittedProcess"
            :read-only="sebSettingsStore.readonly"
            @close-edit-permitted-process="closeEditPermittedProcessDialog"
        >
        </EditPermittedProcess>
    </v-dialog>

    <v-row class="text-subtitle-1">
        <v-col class="text-subtitle-1">
            <v-row>
                <v-col>{{
                    translate(
                        "sebSettings.applicationView.prohibitedProcess.settingName",
                    )
                }}</v-col>
                <v-col align="right">
                    <v-btn
                        color="primary"
                        density="compact"
                        :disabled="sebSettingsStore.readonly"
                        icon="mdi-plus-circle-outline"
                        variant="text"
                        @click="newProhibitedProcess()"
                    >
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider class="border-opacity-25" :thickness="2"></v-divider>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-data-table
                class="rounded-lg elevation-4"
                density="compact"
                :headers="prohibitedProcessHeaders"
                item-value="id"
                :items="prohibitedProcessTable"
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
                        :header-refs-prop="prohibitedProcessHeadersRef"
                        :is-sorted="isSorted"
                        :toggle-sort="toggleSort"
                    >
                    </TableHeaders>
                </template>

                <!-------active hook------->
                <template #item.active="{ item }">
                    {{ translate("general." + item.active, i18n) }}
                </template>

                <!-------OS hook------->
                <template #item.os="{ item }">
                    {{
                        translate(
                            "sebSettings.applicationView.permittedProcess.os_" +
                                item.os,
                            i18n,
                        )
                    }}
                </template>

                <!-------edit button------->
                <template #item.edit="{ item }">
                    <v-btn
                        icon="mdi-pencil-outline"
                        variant="text"
                        @click="prohibitedProcessOpenEditDialog(item.index)"
                    >
                    </v-btn>
                </template>

                <!-------delete button------->
                <template #item.delete="{ item }">
                    <v-btn
                        :disabled="sebSettingsStore.readonly"
                        icon="mdi-delete-outline"
                        variant="text"
                        @click="prohibitedProcessDelete(item.index!)"
                    >
                    </v-btn>
                </template>
            </v-data-table>
        </v-col>
    </v-row>

    <!-----------edit prohibited process dialog---------->
    <v-dialog v-model="editProhibitedProcessDialog" max-width="800">
        <EditProhibitedProcess
            :prohibited-process="selectedProhibitedProcess"
            :read-only="sebSettingsStore.readonly"
            @close-edit-prohibited-process="closeEditProhibitedProcessDialog"
        >
        </EditProhibitedProcess>
    </v-dialog>
</template>

<script setup lang="ts">
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import * as tableUtils from "@/utils/table/tableUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import * as sebSettingsService from "@/services/seb-server/component-services/sebSettingsService";
import { useI18n } from "vue-i18n";
import { translate } from "@/utils/generalUtils";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";

const i18n = useI18n();
const sebSettingsStore = useSEBSettingsStore();

// single attributes
const allowSwitchToApplicationsVal = ref<boolean>(false);

// permittted processes
const editPermittedProcessDialog = ref<boolean>(false);
const selectedPermittedProcess = ref<PermittedProcess | null>(null);
const permittedProcessHeadersRef = ref<any[]>();
const permittedProcessTable = ref<PermittedProcess[]>([]);
const permittedProcessHeaders = ref([
    {
        title: translate("sebSettings.applicationView.permittedProcess.active"),
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
        title: translate("sebSettings.applicationView.permittedProcess.title"),
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

// prohibited processes
const editProhibitedProcessDialog = ref<boolean>(false);
const selectedProhibitedProcess = ref<ProhibitedProcess | null>(null);
const prohibitedProcessHeadersRef = ref<any[]>();
const prohibitedProcessTable = ref<ProhibitedProcess[]>([]);
const prohibitedProcessHeaders = ref([
    {
        title: translate(
            "sebSettings.applicationView.prohibitedProcess.active",
        ),
        key: "active",
        sortable: true,
        width: "10%",
    },
    {
        title: translate("sebSettings.applicationView.prohibitedProcess.os"),
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

let componentId: string;
let allowSwitchToApplications: SEBSettingsValue;


onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    componentId = sebSettingsStore.selectedContainerId.toString();

    const applicationSettings: SEBSettingsView | null =
        await sebSettingsService.getViewSettings(
            ViewType.APPLICATION,
            componentId,
            sebSettingsStore.isExam,
        );
    if (applicationSettings == null) {
        return;
    }

    if (sebSettingsStore.readonly) {
        permittedProcessHeaders.value[4].title = translate(
            "general.viewButton",
            i18n,
        );
        prohibitedProcessHeaders.value[4].title = translate(
            "general.viewButton",
            i18n,
        );
    }

    const settingsView: SEBSettingsView = applicationSettings;
    const tableValues: Map<string, SEBSettingsTableRowValues[]> = new Map<
        string,
        SEBSettingsTableRowValues[]
    >(Object.entries(settingsView.tableValues));
    const singleValues: Map<String, SEBSettingsValue> = new Map<
        String,
        SEBSettingsValue
    >(Object.entries(settingsView.singleValues));
    allowSwitchToApplications = singleValues.get("allowSwitchToApplications")!;
    allowSwitchToApplicationsVal.value =
        allowSwitchToApplications.value === "true";

    // Permitted Processes
    const permittedProcesses = tableValues.get("permittedProcesses");
    if (permittedProcesses == null) {
        return;
    }

    updatePermittedProcessTable(permittedProcesses);

    // Prohibited Processes
    const prohibitedProcesses = tableValues.get("prohibitedProcesses");
    if (prohibitedProcesses == null) {
        return;
    }

    updateProhibitedProcessTable(prohibitedProcesses);
});

// ********* permitted processes functions *********************
function updatePermittedProcessTable(
    permittedProcesses: SEBSettingsTableRowValues[],
) {
    permittedProcessTable.value.splice(0);
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
    permittedProcessTable.value.splice(index, 0, {
        index,
        active: rowVals.get("permittedProcesses.active")?.value! === "true",
        os: rowVals.get("permittedProcesses.os")?.value!,
        executable: rowVals.get("permittedProcesses.executable")?.value!,
        originalName: rowVals.get("permittedProcesses.originalName")?.value!,
        title: rowVals.get("permittedProcesses.title")?.value!,
        signature: rowVals.get("permittedProcesses.signature")?.value!,
        path: rowVals.get("permittedProcesses.path")?.value!,
        iconInTaskbar:
            rowVals.get("permittedProcesses.iconInTaskbar")?.value! === "true",
        arguments: getPermittedProcessArguments(
            rowVals.get("permittedProcesses.arguments")?.value!,
        ),
        allowOpenAndSavePanel:
            rowVals.get("permittedProcesses.allowOpenAndSavePanel")?.value! ===
            "true",
        autostart:
            rowVals.get("permittedProcesses.autostart")?.value! === "true",
        allowShareSheet:
            rowVals.get("permittedProcesses.allowShareSheet")?.value! === "true",
        runInBackground:
            rowVals.get("permittedProcesses.runInBackground")?.value! === "true",
        allowManualStart:
            rowVals.get("permittedProcesses.allowManualStart")?.value! ===
            "true",
        allowUserToChooseApp:
            rowVals.get("permittedProcesses.allowUserToChooseApp")?.value! ===
            "true",
        allowNetworkAccess:
            rowVals.get("permittedProcesses.allowNetworkAccess")?.value! ===
            "true",
        strongKill:
            rowVals.get("permittedProcesses.strongKill")?.value! === "true",
        teamIdentifier: rowVals.get("permittedProcesses.teamIdentifier")
            ?.value!,
        ids: {
            active: rowVals.get("permittedProcesses.active")!.id,
            os: rowVals.get("permittedProcesses.os")!.id,
            executable: rowVals.get("permittedProcesses.executable")!.id,
            originalName: rowVals.get("permittedProcesses.originalName")!.id,
            title: rowVals.get("permittedProcesses.title")!.id,
            signature: rowVals.get("permittedProcesses.signature")!.id,
            path: rowVals.get("permittedProcesses.path")!.id,
            iconInTaskbar: rowVals.get("permittedProcesses.iconInTaskbar")!.id,
            arguments: rowVals.get("permittedProcesses.arguments")!.id,
            allowOpenAndSavePanel: rowVals.get(
                "permittedProcesses.allowOpenAndSavePanel",
            )!.id,
            autostart: rowVals.get("permittedProcesses.autostart")!.id,
            allowShareSheet: rowVals.get("permittedProcesses.allowShareSheet")!
                .id,
            runInBackground: rowVals.get("permittedProcesses.runInBackground")!
                .id,
            allowManualStart: rowVals.get(
                "permittedProcesses.allowManualStart",
            )!.id,
            allowUserToChooseApp: rowVals.get(
                "permittedProcesses.allowUserToChooseApp",
            )!.id,
            allowNetworkAccess: rowVals.get(
                "permittedProcesses.allowNetworkAccess",
            )!.id,
            strongKill: rowVals.get("permittedProcesses.strongKill")!.id,
            teamIdentifier: rowVals.get("permittedProcesses.teamIdentifier")!
                .id,
        },
    });
}

function newPermittedProcess() {
    // create empty selectedPermittedProceses and open edit dialog
    selectedPermittedProcess.value = {
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
        allowOpenAndSavePanel: false,
        autostart: false,
        allowShareSheet: false,
        runInBackground: false,
        allowManualStart: false,
        allowUserToChooseApp: false,
        allowNetworkAccess: true,
        strongKill: false,
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
            allowOpenAndSavePanel: -1,
            autostart: -1,
            allowShareSheet: -1,
            runInBackground: -1,
            allowManualStart: -1,
            allowUserToChooseApp: -1,
            allowNetworkAccess: -1,
            strongKill: -1,
            teamIdentifier: -1,
        },
    };
    editPermittedProcessDialog.value = true;
}

async function permittedProcessDelete(index: number) {
    const resp: SEBSettingsTableRowValues[] | null =
        await sebSettingsService.deleteSEBSettingTableRow(
            componentId,
            "permittedProcesses",
            index,
            sebSettingsStore.isExam,
        );
    if (resp == null) {
        return;
    }

    updatePermittedProcessTable(resp);
}

function permittedProcessOpenEditDialog(index: number) {
    selectedPermittedProcess.value = Object.assign(
        {},
        permittedProcessTable.value[index],
    );
    editPermittedProcessDialog.value = true;
}

async function closeEditPermittedProcessDialog(apply?: boolean) {
    editPermittedProcessDialog.value = false;

    if (!apply || selectedPermittedProcess.value == null) {
        return;
    }

    if (selectedPermittedProcess.value?.index === -1) {
        const resp: SEBSettingsTableRowValues | null =
            await sebSettingsService.newSEBSettingTableRow(
                componentId,
                "permittedProcesses",
                sebSettingsStore.isExam,
            );
        if (resp == null) {
            return;
        }

        const rowVals = new Map<string, SEBSettingsValue>(
            Object.entries(resp.rowValues),
        );

        insertPermittedProcess(resp.listIndex, rowVals);
        selectedPermittedProcess.value.index = resp.listIndex;
        selectedPermittedProcess.value.ids =
            permittedProcessTable.value[resp.listIndex].ids;
    }

    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.active.toString(),
        selectedPermittedProcess.value.active ? "true" : "false",
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.os.toString(),
        selectedPermittedProcess.value.os,
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.executable.toString(),
        selectedPermittedProcess.value.executable,
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.title.toString(),
        selectedPermittedProcess.value.title,
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.originalName.toString(),
        selectedPermittedProcess.value.originalName,
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.signature.toString(),
        selectedPermittedProcess.value.signature,
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.path.toString(),
        selectedPermittedProcess.value.path,
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.iconInTaskbar.toString(),
        selectedPermittedProcess.value.iconInTaskbar ? "true" : "false",
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.arguments.toString(),
        argumentsToString(selectedPermittedProcess.value.arguments),
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.allowOpenAndSavePanel.toString(),
        selectedPermittedProcess.value.allowOpenAndSavePanel ? "true" : "false",
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.autostart.toString(),
        selectedPermittedProcess.value.autostart ? "true" : "false",
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.allowShareSheet.toString(),
        selectedPermittedProcess.value.allowShareSheet ? "true" : "false",
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.runInBackground.toString(),
        selectedPermittedProcess.value.runInBackground ? "true" : "false",
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.allowManualStart.toString(),
        selectedPermittedProcess.value.allowManualStart ? "true" : "false",
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.allowUserToChooseApp.toString(),
        selectedPermittedProcess.value.allowUserToChooseApp ? "true" : "false",
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.allowUserToChooseApp.toString(),
        selectedPermittedProcess.value.allowUserToChooseApp ? "true" : "false",
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.allowNetworkAccess.toString(),
        selectedPermittedProcess.value.allowNetworkAccess ? "true" : "false",
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.strongKill.toString(),
        selectedPermittedProcess.value.strongKill ? "true" : "false",
        sebSettingsStore.isExam,
    );
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedPermittedProcess.value.ids.teamIdentifier.toString(),
        selectedPermittedProcess.value.teamIdentifier,
        sebSettingsStore.isExam,
    );

    permittedProcessTable.value[selectedPermittedProcess.value.index] =
        selectedPermittedProcess.value;
}

// ********* prohibited processes functions *********************
function updateProhibitedProcessTable(
    prohibitedProcesses: SEBSettingsTableRowValues[],
) {
    prohibitedProcessTable.value.splice(0);
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
    prohibitedProcessTable.value.splice(index, 0, {
        index,
        active: rowVals.get("prohibitedProcesses.active")?.value! === "true",
        os: rowVals.get("prohibitedProcesses.os")?.value!,
        executable: rowVals.get("prohibitedProcesses.executable")?.value!,
        description: rowVals.get("prohibitedProcesses.description")?.value!,
        originalName: rowVals.get("prohibitedProcesses.originalName")?.value!,
        identifier: rowVals.get("prohibitedProcesses.identifier")?.value!,
        strongKill:
            rowVals.get("prohibitedProcesses.strongKill")?.value! === "true",
        ignoreInAAC:
            rowVals.get("prohibitedProcesses.ignoreInAAC")?.value! === "true",
        ids: {
            active: rowVals.get("prohibitedProcesses.active")!.id,
            os: rowVals.get("prohibitedProcesses.os")!.id,
            executable: rowVals.get("prohibitedProcesses.executable")!.id,
            description: rowVals.get("prohibitedProcesses.description")!.id,
            originalName: rowVals.get("prohibitedProcesses.originalName")!.id,
            identifier: rowVals.get("prohibitedProcesses.identifier")!.id,
            strongKill: rowVals.get("prohibitedProcesses.strongKill")!.id,
            ignoreInAAC: rowVals.get("prohibitedProcesses.ignoreInAAC")!.id,
        },
    });
}

function newProhibitedProcess() {
    // create empty selectedProhibitedProceses and open edit dialog
    selectedProhibitedProcess.value = {
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
    editProhibitedProcessDialog.value = true;
}

async function prohibitedProcessDelete(index: number) {
    const resp: SEBSettingsTableRowValues[] | null =
        await sebSettingsService.deleteSEBSettingTableRow(
            componentId,
            "prohibitedProcesses",
            index,
            sebSettingsStore.isExam,
        );
    if (resp == null) {
        return;
    }

    updateProhibitedProcessTable(resp);
}

function prohibitedProcessOpenEditDialog(index: number) {
    selectedProhibitedProcess.value = Object.assign(
        {},
        prohibitedProcessTable.value[index],
    );
    editProhibitedProcessDialog.value = true;
}

async function closeEditProhibitedProcessDialog(apply?: boolean) {
    editProhibitedProcessDialog.value = false;

    if (!apply || selectedProhibitedProcess.value == null) {
        return;
    }

    // If this is a new row, create new with default values on backend first
    if (selectedProhibitedProcess.value.index === -1) {
        const resp: SEBSettingsTableRowValues | null =
            await sebSettingsService.newSEBSettingTableRow(
                componentId,
                "prohibitedProcesses",
                sebSettingsStore.isExam,
            );
        if (resp == null) {
            return;
        }

        const rowVals = new Map<string, SEBSettingsValue>(
            Object.entries(resp.rowValues),
        );

        insertProhibitedProcess(resp.listIndex, rowVals);
        selectedProhibitedProcess.value.index = resp.listIndex;
        selectedProhibitedProcess.value.ids =
            prohibitedProcessTable.value[resp.listIndex].ids;
    }

    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedProhibitedProcess.value.ids.active.toString(),
        selectedProhibitedProcess.value.active ? "true" : "false",
        sebSettingsStore.isExam,
    );

    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedProhibitedProcess.value.ids.os.toString(),
        selectedProhibitedProcess.value.os,
        sebSettingsStore.isExam,
    );

    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedProhibitedProcess.value.ids.executable.toString(),
        selectedProhibitedProcess.value.executable,
        sebSettingsStore.isExam,
    );

    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedProhibitedProcess.value.ids.description.toString(),
        selectedProhibitedProcess.value.description,
        sebSettingsStore.isExam,
    );

    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedProhibitedProcess.value.ids.originalName.toString(),
        selectedProhibitedProcess.value.originalName,
        sebSettingsStore.isExam,
    );

    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedProhibitedProcess.value.ids.identifier.toString(),
        selectedProhibitedProcess.value.identifier,
        sebSettingsStore.isExam,
    );

    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedProhibitedProcess.value.ids.strongKill.toString(),
        selectedProhibitedProcess.value.strongKill ? "true" : "false",
        sebSettingsStore.isExam,
    );

    await sebSettingsService.updateSEBSettingValue(
        componentId,
        selectedProhibitedProcess.value.ids.ignoreInAAC.toString(),
        selectedProhibitedProcess.value.ignoreInAAC ? "true" : "false",
        sebSettingsStore.isExam,
    );

    prohibitedProcessTable.value[selectedProhibitedProcess.value.index] =
        selectedProhibitedProcess.value;
}

async function saveSingleValue(valId: number, value: string) {
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        valId.toString(),
        value,
        sebSettingsStore.isExam,
    );
}

function argumentsToString(args: PermittedProcessArgument[]): string {
    let result: string = "";
    args.forEach((item) => {
        if (result.length === 0) {
            result =
                result + "active=" + item.active + "|argument=" + item.argument;
        } else {
            result =
                result +
                ",active=" +
                item.active +
                "|argument=" +
                item.argument;
        }
    });
    return result;
}

function getPermittedProcessArguments(
    args: string | null,
): PermittedProcessArgument[] | [] {
    // args = active=true|argument=arg1,active=true|argument=arg2,...
    const result: PermittedProcessArgument[] = [];
    if (args == null || args.length === 0) {
        return result;
    }

    const list = args.split(",");
    list.forEach((line) => {
        const vals = line.split("|");
        result.push({
            active: vals[0].split("=")[1] === "true",
            argument: vals[1].split("=")[1],
        });
    });

    return result;
}
</script>
