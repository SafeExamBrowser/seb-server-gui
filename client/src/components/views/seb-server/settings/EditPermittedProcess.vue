<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" :text="translate('examDetail.sebSettings.applicationView.permittedProcess.editDialogTitle')"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeEditPermittedProcess', false)" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <!------------Create group form------------->
                <v-col>
                    <v-form >
                        <!------------ active ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.permittedProcess.active_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.permittedProcess.active")}}
                            </v-col>
                            <v-col class="pt-0 pb-0"><v-checkbox-btn v-model="props.permittedProcess!.active"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------OS Type------------->
                        <v-row align="center">
                            <v-col>
                                {{translate("examDetail.sebSettings.applicationView.permittedProcess.os")}}
                            </v-col>
                            <v-col>
                                <v-select
                                    hide-details
                                    v-model="props.permittedProcess!.os"
                                    density="compact"
                                    variant="outlined"
                                    :items="osItems">
                                </v-select>
                            </v-col>
                        </v-row>
                        <!------------Executable------------->
                        <v-row>
                            <v-col>
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.permittedProcess.executable_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.permittedProcess.executable")}}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    single-line
                                    hide-details
                                    v-model="props.permittedProcess!.executable"
                                    density="compact"
                                    variant="outlined">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------Title------------->
                        <v-row>
                            <v-col>
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.permittedProcess.title_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.permittedProcess.title")}}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    single-line
                                    hide-details
                                    v-model="props.permittedProcess!.title"
                                    density="compact"
                                    variant="outlined">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------Original Name------------->
                        <v-row>
                            <v-col> {{translate("examDetail.sebSettings.applicationView.permittedProcess.originalName")}}</v-col>
                            <v-col>
                                <v-text-field
                                    single-line
                                    hide-details
                                    v-model="props.permittedProcess!.originalName"
                                    density="compact"
                                    variant="outlined">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------Signature------------->
                        <v-row>
                            <v-col>{{translate("examDetail.sebSettings.applicationView.permittedProcess.signature")}}</v-col>
                            <v-col>
                                <v-text-field
                                    single-line
                                    hide-details
                                    v-model="props.permittedProcess!.signature"
                                    density="compact"
                                    variant="outlined">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------Path------------->
                        <v-row>
                            <v-col> {{translate("examDetail.sebSettings.applicationView.permittedProcess.path")}}</v-col>
                            <v-col>
                                <v-text-field
                                    single-line
                                    hide-details
                                    v-model="props.permittedProcess!.path"
                                    density="compact"
                                    variant="outlined">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------teamIdentifier------------->
                        <v-row>
                            <v-col>
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.permittedProcess.teamIdentifier_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.permittedProcess.teamIdentifier")}}
                            </v-col>
                            <v-col>
                                <v-text-field
                                    single-line
                                    hide-details
                                    v-model="props.permittedProcess!.teamIdentifier"
                                    density="compact"
                                    variant="outlined">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------Arguments------------->
                        <v-row>
                            <v-col class="pt-0 pb-0">{{translate("examDetail.sebSettings.applicationView.permittedProcess.arguments")}}</v-col>
                            <v-col class="pt-0 pb-0">
                           
                                <v-col  align="right" class="pt-0 pb-0"><v-btn
                                    
                                    color="primary"
                                    density="compact"
                                    variant="text"
                                    icon="mdi-plus-circle-outline"
                                    @click="addArgument()">
                                </v-btn></v-col>
              
                                <v-data-table 
                                    hide-default-footer
                                    class="rounded-lg elevation-4"
                                    :headers="argumentsHeaders" 
                                    :items="argumentsTable">

                                    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                                        <TableHeaders
                                            :columns="columns"
                                            :is-sorted="isSorted"
                                            :get-sort-icon="getSortIcon"
                                            :toggle-sort="toggleSort"
                                            :header-refs-prop="argumentsHeadersRef">
                                        </TableHeaders>
                                    </template>

                                    <!-------active hook------->
                                    <template v-slot:item.active="{ item }">
                                        <v-checkbox-btn v-model="item.active"></v-checkbox-btn>
                                    </template>

                                    <!-------argument hook------->
                                    <template v-slot:item.argument="{ item }">
                                        <v-text-field
                                            single-line
                                            hide-details
                                            v-model="item.argument"
                                            density="compact"
                                            variant="outlined">
                                        </v-text-field>
                                    </template>

                                    <!-------delete button------->      
                                    <template v-slot:item.delete="{ item }">
                                        <v-btn 
                                            variant="text" 
                                            icon="mdi-delete-outline"
                                            @click="deleteArgument(argumentsTable.indexOf(item))">
                                        </v-btn>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <!------------ iconInTaskbar ------------->
                        <v-row align="center">
                            <v-col class="pb-0">
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.permittedProcess.iconInTaskbar_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.permittedProcess.iconInTaskbar")}}
                            </v-col>
                            <v-col class="pb-0"><v-checkbox-btn v-model="props.permittedProcess!.iconInTaskbar"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------ allowOpenAndSavePanel ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.permittedProcess.allowOpenAndSavePanel_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.permittedProcess.allowOpenAndSavePanel")}}
                            </v-col>
                            <v-col class="pt-0 pb-0"><v-checkbox-btn v-model="props.permittedProcess!.allowOpenAndSavePanel"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------ autostart ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.permittedProcess.autostart_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.permittedProcess.autostart")}}
                            </v-col>
                            <v-col class="pt-0 pb-0"><v-checkbox-btn v-model="props.permittedProcess!.autostart"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------ allowShareSheet ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.permittedProcess.allowShareSheet_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.permittedProcess.allowShareSheet")}}
                            </v-col>
                            <v-col class="pt-0 pb-0"><v-checkbox-btn v-model="props.permittedProcess!.allowShareSheet"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------ runInBackground ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.permittedProcess.runInBackground_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.permittedProcess.runInBackground")}}
                            </v-col>
                            <v-col class="pt-0 pb-0"><v-checkbox-btn v-model="props.permittedProcess!.runInBackground"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------ allowManualStart ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.permittedProcess.allowManualStart_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.permittedProcess.allowManualStart")}}
                            </v-col>
                            <v-col class="pt-0 pb-0"><v-checkbox-btn v-model="props.permittedProcess!.allowManualStart"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------ allowUserToChooseApp ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">{{translate("examDetail.sebSettings.applicationView.permittedProcess.allowUserToChooseApp")}}</v-col>
                            <v-col class="pt-0 pb-0"><v-checkbox-btn v-model="props.permittedProcess!.allowUserToChooseApp"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------ allowNetworkAccess ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.permittedProcess.allowNetworkAccess_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.permittedProcess.allowNetworkAccess")}}
                            </v-col>
                            <v-col class="pt-0 pb-0"><v-checkbox-btn v-model="props.permittedProcess!.allowNetworkAccess"></v-checkbox-btn> </v-col>
                        </v-row>
                        <!------------ strongKill ------------->
                        <v-row align="center">
                            <v-col class="pt-0 pb-0">
                                <v-tooltip activator="parent"><p v-html="translateWithBR('examDetail.sebSettings.applicationView.permittedProcess.strongKill_tooltip')" /></v-tooltip>
                                {{translate("examDetail.sebSettings.applicationView.permittedProcess.strongKill")}}
                            </v-col>
                            <v-col class="pt-0 pb-0"><v-checkbox-btn v-model="props.permittedProcess!.strongKill"></v-checkbox-btn> </v-col>
                        </v-row>
                         <!------------Buttons------------->
                         <v-row align="center">
                            <v-col align="right">
                                <v-btn 
                                    rounded="sm" 
                                    color="black" 
                                    variant="outlined"
                                    @click="emit('closeEditPermittedProcess', false)">
                                    {{translate("general.cancelButton")}}
                                </v-btn>
    
                                <v-btn 
                                    rounded="sm" 
                                    color="primary" 
                                    variant="flat" 
                                    class="ml-2"
                                    :disabled="props.readOnly"
                                    @click="emit('closeEditPermittedProcess', true)">
                                    {{translate("general.saveButton")}}
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
    import { useI18n } from "vue-i18n";
    import {translate} from "@/utils/generalUtils";
    import {translateWithBR} from "@/utils/generalUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    import * as tableUtils from "@/utils/table/tableUtils";

    const argumentsHeadersRef = ref<any[]>();
    const argumentsTable = ref<PermittedProcessArgument[]>([]);
    const argumentsHeaders = ref([
        {title: translate("examDetail.sebSettings.applicationView.permittedProcess.arguments_active"), key: "active", sortable: false, width: "10%"},
        {title: translate("examDetail.sebSettings.applicationView.permittedProcess.arguments_argument"), key: "argument", sortable: false, width: "10%"},
        {title: translate("general.deleteButton"), key: "delete", sortable: false, width: "5%", center: true}
    ]);

    //i18n
    const i18n = useI18n();

    //emits
    const emit = defineEmits<{
        closeEditPermittedProcess: any;
    }>();

    //props
    const props = defineProps<{
        permittedProcess: PermittedProcess | null,
        readOnly: boolean
    }>();

    const osItems = [ 
        {title: translate("examDetail.sebSettings.applicationView.permittedProcess.os_0"), value: "0" }, 
        {title: translate("examDetail.sebSettings.applicationView.permittedProcess.os_1"), value: "1" } ];

    onBeforeMount(async () => {
        argumentsTable.value.splice(0);
        props.permittedProcess!.arguments.forEach( (item) => {
            argumentsTable.value.push(item);
            
        });
        console.info( argumentsTable.value);
    });

    function deleteArgument(index: number) {
        props.permittedProcess!.arguments.splice(index, 1)
        argumentsTable.value.splice(0);
        props.permittedProcess!.arguments.forEach( (item) => {
            argumentsTable.value.push(item);
            
        });
    }

    function addArgument() {
        props.permittedProcess!.arguments.push({ active: false, argument: "" });
        argumentsTable.value.splice(0);
        props.permittedProcess!.arguments.forEach( (item) => {
            argumentsTable.value.push(item);
            
        });
    }


</script>