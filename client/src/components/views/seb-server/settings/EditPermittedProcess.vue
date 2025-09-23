<template>
    <v-card>
        <v-toolbar color="transparent">
            <v-toolbar-title
                class="text-h6"
                :text="
                    translate(
                        'sebSettings.applicationView.permittedProcess.editDialogTitle',
                    )
                "
            ></v-toolbar-title>
            <template #append>
                <v-btn
                    icon="mdi-close"
                    @click="emit('closeEditPermittedProcess', false)"
                ></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <!------------Create group form------------->
                <v-col>
                    <v-form>
                        <!------------ active ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"
                                    ><p
                                        v-html="
                                            translateWithBR(
                                                'sebSettings.applicationView.permittedProcess.active_tooltip',
                                            )
                                        "
                                /></v-tooltip>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.active",
                                    )
                                }}
                            </v-col>
                            <v-col class="pt-0 pb-0"
                                ><v-checkbox-btn
                                    v-model="props.permittedProcess!.active"
                                    :disabled="props.readOnly"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <!------------OS Type------------->
                        <v-row align="center">
                            <v-col>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.os",
                                    )
                                }}
                            </v-col>
                            <v-col>
                                <v-select
                                    v-model="props.permittedProcess!.os"
                                    density="compact"
                                    :disabled="props.readOnly"
                                    hide-details
                                    :items="osItems"
                                    variant="outlined"
                                >
                                </v-select>
                            </v-col>
                        </v-row>
                        <!------------Executable------------->
                        <v-row>
                            <v-col>
                                <v-tooltip activator="parent"
                                    ><p
                                        v-html="
                                            translateWithBR(
                                                'sebSettings.applicationView.permittedProcess.executable_tooltip',
                                            )
                                        "
                                /></v-tooltip>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.executable",
                                    )
                                }}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    v-model="props.permittedProcess!.executable"
                                    density="compact"
                                    :disabled="props.readOnly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------Title------------->
                        <v-row>
                            <v-col>
                                <v-tooltip activator="parent"
                                    ><p
                                        v-html="
                                            translateWithBR(
                                                'sebSettings.applicationView.permittedProcess.title_tooltip',
                                            )
                                        "
                                /></v-tooltip>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.title",
                                    )
                                }}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    v-model="props.permittedProcess!.title"
                                    density="compact"
                                    :disabled="props.readOnly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------Original Name------------->
                        <v-row>
                            <v-col>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.originalName",
                                    )
                                }}</v-col
                            >
                            <v-col>
                                <v-text-field
                                    v-model="
                                        props.permittedProcess!.originalName
                                    "
                                    density="compact"
                                    :disabled="props.readOnly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------Signature------------->
                        <v-row>
                            <v-col>{{
                                translate(
                                    "sebSettings.applicationView.permittedProcess.signature",
                                )
                            }}</v-col>
                            <v-col>
                                <v-text-field
                                    v-model="props.permittedProcess!.signature"
                                    density="compact"
                                    :disabled="props.readOnly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------Path------------->
                        <v-row>
                            <v-col>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.path",
                                    )
                                }}</v-col
                            >
                            <v-col>
                                <v-text-field
                                    v-model="props.permittedProcess!.path"
                                    density="compact"
                                    :disabled="props.readOnly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------teamIdentifier------------->
                        <v-row>
                            <v-col>
                                <v-tooltip activator="parent"
                                    ><p
                                        v-html="
                                            translateWithBR(
                                                'sebSettings.applicationView.permittedProcess.teamIdentifier_tooltip',
                                            )
                                        "
                                /></v-tooltip>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.teamIdentifier",
                                    )
                                }}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    v-model="
                                        props.permittedProcess!.teamIdentifier
                                    "
                                    density="compact"
                                    :disabled="props.readOnly"
                                    hide-details
                                    single-line
                                    variant="outlined"
                                >
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------Arguments------------->
                        <v-row>
                            <v-col class="pt-0 pb-0">{{
                                translate(
                                    "sebSettings.applicationView.permittedProcess.arguments",
                                )
                            }}</v-col>
                            <v-col class="pt-0 pb-0">
                                <v-col align="right" class="pt-0 pb-0"
                                    ><v-btn
                                        color="primary"
                                        density="compact"
                                        :disabled="props.readOnly"
                                        icon="mdi-plus-circle-outline"
                                        variant="text"
                                        @click="addArgument()"
                                    >
                                    </v-btn
                                ></v-col>

                                <v-data-table
                                    class="rounded-lg elevation-4"
                                    :headers="argumentsHeaders"
                                    hide-default-footer
                                    :items="argumentsTable"
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
                                            :header-refs-prop="
                                                argumentsHeadersRef
                                            "
                                            :is-sorted="isSorted"
                                            :toggle-sort="toggleSort"
                                        >
                                        </TableHeaders>
                                    </template>

                                    <!-------active hook------->
                                    <template #item.active="{ item }">
                                        <v-checkbox-btn
                                            v-model="item.active"
                                            :disabled="props.readOnly"
                                        ></v-checkbox-btn>
                                    </template>

                                    <!-------argument hook------->
                                    <template #item.argument="{ item }">
                                        <v-text-field
                                            v-model="item.argument"
                                            density="compact"
                                            :disabled="props.readOnly"
                                            hide-details
                                            single-line
                                            variant="outlined"
                                        >
                                        </v-text-field>
                                    </template>

                                    <!-------delete button------->
                                    <template #item.delete="{ item }">
                                        <v-btn
                                            :disabled="props.readOnly"
                                            icon="mdi-delete-outline"
                                            variant="text"
                                            @click="
                                                deleteArgument(
                                                    argumentsTable.indexOf(
                                                        item,
                                                    ),
                                                )
                                            "
                                        >
                                        </v-btn>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <!------------ iconInTaskbar ------------->
                        <v-row align="center">
                            <v-col class="pb-0">
                                <v-tooltip activator="parent"
                                    ><p
                                        v-html="
                                            translateWithBR(
                                                'sebSettings.applicationView.permittedProcess.iconInTaskbar_tooltip',
                                            )
                                        "
                                /></v-tooltip>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.iconInTaskbar",
                                    )
                                }}
                            </v-col>
                            <v-col class="pb-0"
                                ><v-checkbox-btn
                                    v-model="
                                        props.permittedProcess!.iconInTaskbar
                                    "
                                    :disabled="props.readOnly"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <!------------ allowOpenAndSavePanel ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"
                                    ><p
                                        v-html="
                                            translateWithBR(
                                                'sebSettings.applicationView.permittedProcess.allowOpenAndSavePanel_tooltip',
                                            )
                                        "
                                /></v-tooltip>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.allowOpenAndSavePanel",
                                    )
                                }}
                            </v-col>
                            <v-col class="pt-0 pb-0"
                                ><v-checkbox-btn
                                    v-model="
                                        props.permittedProcess!
                                            .allowOpenAndSavePanel
                                    "
                                    :disabled="props.readOnly"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <!------------ autostart ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"
                                    ><p
                                        v-html="
                                            translateWithBR(
                                                'sebSettings.applicationView.permittedProcess.autostart_tooltip',
                                            )
                                        "
                                /></v-tooltip>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.autostart",
                                    )
                                }}
                            </v-col>
                            <v-col class="pt-0 pb-0"
                                ><v-checkbox-btn
                                    v-model="props.permittedProcess!.autostart"
                                    :disabled="props.readOnly"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <!------------ allowShareSheet ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"
                                    ><p
                                        v-html="
                                            translateWithBR(
                                                'sebSettings.applicationView.permittedProcess.allowShareSheet_tooltip',
                                            )
                                        "
                                /></v-tooltip>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.allowShareSheet",
                                    )
                                }}
                            </v-col>
                            <v-col class="pt-0 pb-0"
                                ><v-checkbox-btn
                                    v-model="
                                        props.permittedProcess!.allowShareSheet
                                    "
                                    :disabled="props.readOnly"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <!------------ runInBackground ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"
                                    ><p
                                        v-html="
                                            translateWithBR(
                                                'sebSettings.applicationView.permittedProcess.runInBackground_tooltip',
                                            )
                                        "
                                /></v-tooltip>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.runInBackground",
                                    )
                                }}
                            </v-col>
                            <v-col class="pt-0 pb-0"
                                ><v-checkbox-btn
                                    v-model="
                                        props.permittedProcess!.runInBackground
                                    "
                                    :disabled="props.readOnly"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <!------------ allowManualStart ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"
                                    ><p
                                        v-html="
                                            translateWithBR(
                                                'sebSettings.applicationView.permittedProcess.allowManualStart_tooltip',
                                            )
                                        "
                                /></v-tooltip>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.allowManualStart",
                                    )
                                }}
                            </v-col>
                            <v-col class="pt-0 pb-0"
                                ><v-checkbox-btn
                                    v-model="
                                        props.permittedProcess!.allowManualStart
                                    "
                                    :disabled="props.readOnly"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <!------------ allowUserToChooseApp ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">{{
                                translate(
                                    "sebSettings.applicationView.permittedProcess.allowUserToChooseApp",
                                )
                            }}</v-col>
                            <v-col class="pt-0 pb-0"
                                ><v-checkbox-btn
                                    v-model="
                                        props.permittedProcess!
                                            .allowUserToChooseApp
                                    "
                                    :disabled="props.readOnly"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <!------------ allowNetworkAccess ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"
                                    ><p
                                        v-html="
                                            translateWithBR(
                                                'sebSettings.applicationView.permittedProcess.allowNetworkAccess_tooltip',
                                            )
                                        "
                                /></v-tooltip>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.allowNetworkAccess",
                                    )
                                }}
                            </v-col>
                            <v-col class="pt-0 pb-0"
                                ><v-checkbox-btn
                                    v-model="
                                        props.permittedProcess!
                                            .allowNetworkAccess
                                    "
                                    :disabled="props.readOnly"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <!------------ strongKill ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"
                                    ><p
                                        v-html="
                                            translateWithBR(
                                                'sebSettings.applicationView.permittedProcess.strongKill_tooltip',
                                            )
                                        "
                                /></v-tooltip>
                                {{
                                    translate(
                                        "sebSettings.applicationView.permittedProcess.strongKill",
                                    )
                                }}
                            </v-col>
                            <v-col class="pt-0 pb-0"
                                ><v-checkbox-btn
                                    v-model="props.permittedProcess!.strongKill"
                                    :disabled="props.readOnly"
                                ></v-checkbox-btn>
                            </v-col>
                        </v-row>
                        <!------------Buttons------------->
                        <v-row align="center">
                            <v-col align="right">
                                <v-btn
                                    color="black"
                                    rounded="sm"
                                    variant="outlined"
                                    @click="
                                        emit('closeEditPermittedProcess', false)
                                    "
                                >
                                    {{ translate("general.cancelButton") }}
                                </v-btn>

                                <v-btn
                                    class="ml-2"
                                    color="primary"
                                    :disabled="props.readOnly"
                                    rounded="sm"
                                    variant="flat"
                                    @click="
                                        emit('closeEditPermittedProcess', true)
                                    "
                                >
                                    {{ translate("general.saveButton") }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { translate, translateWithBR } from "@/utils/generalUtils";
import TableHeaders from "@/utils/table/TableHeaders.vue";
import { ref, onBeforeMount } from "vue";

const argumentsHeadersRef = ref<any[]>();
const argumentsTable = ref<PermittedProcessArgument[]>([]);
const argumentsHeaders = ref([
    {
        title: translate(
            "sebSettings.applicationView.permittedProcess.arguments_active",
        ),
        key: "active",
        sortable: false,
        width: "10%",
    },
    {
        title: translate(
            "sebSettings.applicationView.permittedProcess.arguments_argument",
        ),
        key: "argument",
        sortable: false,
        width: "10%",
    },
    {
        title: translate("general.deleteButton"),
        key: "delete",
        sortable: false,
        width: "5%",
        center: true,
    },
]);

// emits
const emit = defineEmits<{
    closeEditPermittedProcess: any;
}>();

// props
const props = defineProps<{
    permittedProcess: PermittedProcess | null;
    readOnly: boolean;
}>();

const osItems = [
    {
        title: translate("sebSettings.applicationView.permittedProcess.os_0"),
        value: "0",
    },
    {
        title: translate("sebSettings.applicationView.permittedProcess.os_1"),
        value: "1",
    },
];

onBeforeMount(async () => {
    argumentsTable.value.splice(0);
    props.permittedProcess!.arguments.forEach((item) => {
        argumentsTable.value.push(item);
    });
});

function deleteArgument(index: number) {
    props.permittedProcess!.arguments.splice(index, 1);
    argumentsTable.value.splice(0);
    props.permittedProcess!.arguments.forEach((item) => {
        argumentsTable.value.push(item);
    });
}

function addArgument() {
    props.permittedProcess!.arguments.push({ active: false, argument: "" });
    argumentsTable.value.splice(0);
    props.permittedProcess!.arguments.forEach((item) => {
        argumentsTable.value.push(item);
    });
}
</script>
