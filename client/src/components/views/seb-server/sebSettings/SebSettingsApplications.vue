<template>
    <LoadingFallbackComponent
        :loading="loadingSebSettingsView"
        :errors="errorSebSettingsView"
    >
        <v-row v-if="singleValues" max-width="300">
            <CheckboxSetting
                v-model="singleValues"
                name="allowSwitchToApplications"
                label="sebSettings.applicationView.allowSwitchToApplications"
                :tooltip="true"
                :disabled="context.readonly"
            />
        </v-row>

        <!--Permitted Process Table -->
        <v-row>
            <v-col class="font-weight-bold pt-8 pb-0">
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
                            :disabled="context.readonly"
                            icon="mdi-plus-circle-outline"
                            variant="text"
                            @click="newPermittedProcess()"
                        >
                        </v-btn>
                    </v-col>
                </v-row>
                <v-divider class="border-opacity-25" :thickness="5"></v-divider>
            </v-col>
        </v-row>
        <v-row v-if="singleValues" max-width="300">
            <CheckboxSetting
                v-model="singleValues"
                name="allowOpenAndSavePanel"
                label="sebSettings.applicationView.permittedProcess.allowOpenAndSavePanel"
                :tooltip="true"
                :disabled="context.readonly"
            />
            <CheckboxSetting
                v-model="singleValues"
                name="allowShareSheet"
                label="sebSettings.applicationView.permittedProcess.allowShareSheet"
                :tooltip="true"
                :disabled="context.readonly"
            />
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
                        tableUtils.calcDefaultItemsPerPage(
                            permittedProcessTable,
                        )
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
                            :disabled="context.readonly"
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
                :read-only="context.readonly"
                @close-edit-permitted-process="closeEditPermittedProcessDialog"
            >
            </EditPermittedProcess>
        </v-dialog>

        <!--Prohibited Process Table -->
        <v-row>
            <v-col class="font-weight-bold pt-8 pb-0">
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
                            :disabled="context.readonly"
                            icon="mdi-plus-circle-outline"
                            variant="text"
                            @click="newProhibitedProcess()"
                        >
                        </v-btn>
                    </v-col>
                </v-row>
                <v-divider class="border-opacity-25" :thickness="5"></v-divider>
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
                            :disabled="context.readonly"
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
                :read-only="context.readonly"
                @close-edit-prohibited-process="
                    closeEditProhibitedProcessDialog
                "
            >
            </EditProhibitedProcess>
        </v-dialog>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import * as tableUtils from "@/utils/table/tableUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import * as sebSettingsService from "@/services/seb-server/sebSettingsService";
import { useI18n } from "vue-i18n";
import { translate, stringToBoolean } from "@/utils/generalUtils";
import { ref, watch } from "vue";
import {
    PermittedProcess,
    PermittedProcessArgument,
    ProhibitedProcess,
    SEBSettingsTableRowValues,
    SEBSettingsValue,
} from "@/models/seb-server/sebSettings";
import EditPermittedProcess from "@/components/views/seb-server/sebSettings/components/tableDialogs/EditPermittedProcess.vue";
import EditProhibitedProcess from "@/components/views/seb-server/sebSettings/components/tableDialogs/EditProhibitedProcess.vue";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import CheckboxSetting from "./components/inputFields/CheckboxSetting.vue";
import { useSEBSettingValues } from "./composables/useSEBSettingValues";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { SEBSettingsContext } from "./types";

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
    ViewType.APPLICATION,
);

const i18n = useI18n();

const editPermittedProcessDialog = ref<boolean>(false);
const selectedPermittedProcess = ref<PermittedProcess | null>(null);
const permittedProcessHeadersRef = ref<(HTMLElement | null)[]>([]);
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
const prohibitedProcessHeadersRef = ref<(HTMLElement | null)[]>([]);
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

watch(tableValues, () => {
    if (!tableValues.value) return;

    const permittedProcesses =
        tableValues.value.tableValues.get("permittedProcesses");
    if (permittedProcesses) {
        updatePermittedProcessTable(permittedProcesses);
    }

    const prohibitedProcesses = tableValues.value.tableValues.get(
        "prohibitedProcesses",
    );
    if (prohibitedProcesses) {
        updateProhibitedProcessTable(prohibitedProcesses);
    }
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
        active: getBooleanValue(rowVals, "permittedProcesses.active"),
        os: getStringValue(rowVals, "permittedProcesses.os"),
        executable: getStringValue(rowVals, "permittedProcesses.executable"),
        originalName: getStringValue(
            rowVals,
            "permittedProcesses.originalName",
        ),
        title: getStringValue(rowVals, "permittedProcesses.title"),
        signature: getStringValue(rowVals, "permittedProcesses.signature"),
        path: getStringValue(rowVals, "permittedProcesses.path"),
        iconInTaskbar: getBooleanValue(
            rowVals,
            "permittedProcesses.iconInTaskbar",
        ),
        arguments: getPermittedProcessArguments(
            getStringValue(rowVals, "permittedProcesses.arguments"),
        ),

        autostart: getBooleanValue(rowVals, "permittedProcesses.autostart"),
        runInBackground: getBooleanValue(
            rowVals,
            "permittedProcesses.runInBackground",
        ),
        allowManualStart: getBooleanValue(
            rowVals,
            "permittedProcesses.allowManualStart",
        ),
        allowUserToChooseApp: getBooleanValue(
            rowVals,
            "permittedProcesses.allowUserToChooseApp",
        ),
        allowNetworkAccess: getBooleanValue(
            rowVals,
            "permittedProcesses.allowNetworkAccess",
        ),
        strongKill: getBooleanValue(rowVals, "permittedProcesses.strongKill"),
        teamIdentifier: getStringValue(
            rowVals,
            "permittedProcesses.teamIdentifier",
        ),
        ids: {
            active: getSettingId(rowVals, "permittedProcesses.active"),
            os: getSettingId(rowVals, "permittedProcesses.os"),
            executable: getSettingId(rowVals, "permittedProcesses.executable"),
            originalName: getSettingId(
                rowVals,
                "permittedProcesses.originalName",
            ),
            title: getSettingId(rowVals, "permittedProcesses.title"),
            signature: getSettingId(rowVals, "permittedProcesses.signature"),
            path: getSettingId(rowVals, "permittedProcesses.path"),
            iconInTaskbar: getSettingId(
                rowVals,
                "permittedProcesses.iconInTaskbar",
            ),
            arguments: getSettingId(rowVals, "permittedProcesses.arguments"),
            autostart: getSettingId(rowVals, "permittedProcesses.autostart"),
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
            strongKill: getSettingId(rowVals, "permittedProcesses.strongKill"),
            teamIdentifier: getSettingId(
                rowVals,
                "permittedProcesses.teamIdentifier",
            ),
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
        autostart: false,
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
            autostart: -1,
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
        await sebSettingsService.deleteTableRow(
            props.context.containerId,
            "permittedProcesses",
            index,
            props.context.isExam,
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

    if (!tableValues.value) return;
    if (!apply || selectedPermittedProcess.value == null) {
        return;
    }

    if (selectedPermittedProcess.value?.index === -1) {
        const resp: SEBSettingsTableRowValues | null =
            await sebSettingsService.addTableRow(
                props.context.containerId,
                "permittedProcesses",
                props.context.isExam,
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

    tableValues.value.saveTableRow([
        {
            id: selectedPermittedProcess.value.ids.active,
            value: selectedPermittedProcess.value.active ? "true" : "false",
        },
        {
            id: selectedPermittedProcess.value.ids.os,
            value: selectedPermittedProcess.value.os,
        },
        {
            id: selectedPermittedProcess.value.ids.executable,
            value: selectedPermittedProcess.value.executable,
        },
        {
            id: selectedPermittedProcess.value.ids.title,
            value: selectedPermittedProcess.value.title,
        },
        {
            id: selectedPermittedProcess.value.ids.originalName,
            value: selectedPermittedProcess.value.originalName,
        },
        {
            id: selectedPermittedProcess.value.ids.signature,
            value: selectedPermittedProcess.value.signature,
        },
        {
            id: selectedPermittedProcess.value.ids.path,
            value: selectedPermittedProcess.value.path,
        },
        {
            id: selectedPermittedProcess.value.ids.iconInTaskbar,
            value: selectedPermittedProcess.value.iconInTaskbar
                ? "true"
                : "false",
        },
        {
            id: selectedPermittedProcess.value.ids.arguments,
            value: argumentsToString(selectedPermittedProcess.value.arguments),
        },
        {
            id: selectedPermittedProcess.value.ids.autostart,
            value: selectedPermittedProcess.value.autostart ? "true" : "false",
        },
        {
            id: selectedPermittedProcess.value.ids.runInBackground,
            value: selectedPermittedProcess.value.runInBackground
                ? "true"
                : "false",
        },
        {
            id: selectedPermittedProcess.value.ids.allowManualStart,
            value: selectedPermittedProcess.value.allowManualStart
                ? "true"
                : "false",
        },
        {
            id: selectedPermittedProcess.value.ids.allowUserToChooseApp,
            value: selectedPermittedProcess.value.allowUserToChooseApp
                ? "true"
                : "false",
        },
        {
            id: selectedPermittedProcess.value.ids.allowNetworkAccess,
            value: selectedPermittedProcess.value.allowNetworkAccess
                ? "true"
                : "false",
        },
        {
            id: selectedPermittedProcess.value.ids.strongKill,
            value: selectedPermittedProcess.value.strongKill ? "true" : "false",
        },
        {
            id: selectedPermittedProcess.value.ids.teamIdentifier,
            value: selectedPermittedProcess.value.teamIdentifier,
        },
    ]);

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
        active: getBooleanValue(rowVals, "prohibitedProcesses.active"),
        os: getStringValue(rowVals, "prohibitedProcesses.os"),
        executable: getStringValue(rowVals, "prohibitedProcesses.executable"),
        description: getStringValue(rowVals, "prohibitedProcesses.description"),
        originalName: getStringValue(
            rowVals,
            "prohibitedProcesses.originalName",
        ),
        identifier: getStringValue(rowVals, "prohibitedProcesses.identifier"),
        strongKill: getBooleanValue(rowVals, "prohibitedProcesses.strongKill"),
        ignoreInAAC: getBooleanValue(
            rowVals,
            "prohibitedProcesses.ignoreInAAC",
        ),
        ids: {
            active: getSettingId(rowVals, "prohibitedProcesses.active"),
            os: getSettingId(rowVals, "prohibitedProcesses.os"),
            executable: getSettingId(rowVals, "prohibitedProcesses.executable"),
            description: getSettingId(
                rowVals,
                "prohibitedProcesses.description",
            ),
            originalName: getSettingId(
                rowVals,
                "prohibitedProcesses.originalName",
            ),
            identifier: getSettingId(rowVals, "prohibitedProcesses.identifier"),
            strongKill: getSettingId(rowVals, "prohibitedProcesses.strongKill"),
            ignoreInAAC: getSettingId(
                rowVals,
                "prohibitedProcesses.ignoreInAAC",
            ),
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
        await sebSettingsService.deleteTableRow(
            props.context.containerId,
            "prohibitedProcesses",
            index,
            props.context.isExam,
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

    if (!tableValues.value) return;
    if (!apply || selectedProhibitedProcess.value == null) {
        return;
    }

    // If this is a new row, create new with default values on backend first
    if (selectedProhibitedProcess.value.index === -1) {
        const resp: SEBSettingsTableRowValues | null =
            await sebSettingsService.addTableRow(
                props.context.containerId,
                "prohibitedProcesses",
                props.context.isExam,
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

    tableValues.value.saveTableRow([
        {
            id: selectedProhibitedProcess.value.ids.active,
            value: selectedProhibitedProcess.value.active ? "true" : "false",
        },
        {
            id: selectedProhibitedProcess.value.ids.os,
            value: selectedProhibitedProcess.value.os,
        },
        {
            id: selectedProhibitedProcess.value.ids.executable,
            value: selectedProhibitedProcess.value.executable.toString(),
        },
        {
            id: selectedProhibitedProcess.value.ids.description,
            value: selectedProhibitedProcess.value.description.toString(),
        },
        {
            id: selectedProhibitedProcess.value.ids.originalName,
            value: selectedProhibitedProcess.value.originalName,
        },
        {
            id: selectedProhibitedProcess.value.ids.identifier,
            value: selectedProhibitedProcess.value.identifier,
        },
        {
            id: selectedProhibitedProcess.value.ids.strongKill,
            value: selectedProhibitedProcess.value.strongKill
                ? "true"
                : "false",
        },
        {
            id: selectedProhibitedProcess.value.ids.ignoreInAAC,
            value: selectedProhibitedProcess.value.ignoreInAAC
                ? "true"
                : "false",
        },
    ]);

    prohibitedProcessTable.value[selectedProhibitedProcess.value.index] =
        selectedProhibitedProcess.value;
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

function getBooleanValue(
    rowVals: Map<string, SEBSettingsValue>,
    name: string,
): boolean {
    const prop = rowVals.get(name);
    if (!prop) {
        const def = singleValues.value?.attributes.get(name);
        if (!def) {
            throw new Error("No SEB Setting" + name + " found");
        } else {
            return stringToBoolean(def.defaultValue);
        }
    } else {
        return stringToBoolean(prop.value);
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
