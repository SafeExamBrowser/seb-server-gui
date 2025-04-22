<template>
    <v-row>
        <v-col>
            <v-checkbox-btn 
                v-model="allowSwitchToApplications"
                @click="sendSingleValue('allowSwitchToApplications', allowSwitchToApplications ? 'false' : 'true')"
                :label="translate('examDetail.sebSettings.applicationView.allowSwitchToApplications')"></v-checkbox-btn> 
        </v-col>
        <v-col>
            <v-checkbox-btn 
                v-model="allowFlashFullscreen"
                @click="sendSingleValue('allowFlashFullscreen', allowFlashFullscreen ? 'false' : 'true')"
                :label="translate('examDetail.sebSettings.applicationView.allowFlashFullscreen')"></v-checkbox-btn>
        </v-col>
    </v-row>

    <v-row>
        <v-col class="text-subtitle-1">
            <v-row class="mt-10">
                <v-col>{{translate("examDetail.sebSettings.applicationView.permittedProcesses.settingName")}}</v-col>
                <v-col  align="right">
                    <v-btn
                        color="primary"
                        density="compact"
                        variant="text"
                        icon="mdi-plus-circle-outline"
                        @click="newPermittedProcess()">
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider class="border-opacity-25" :thickness="2"></v-divider>
        </v-col>
        
    </v-row>
    <v-row>
        <v-col>
            <v-data-table 
                item-value="id" 
                class="rounded-lg elevation-4"
                density="compact"
                :items-per-page="tableUtils.calcDefaultItemsPerPage(permittedProcesessTable)" 
                :items-per-page-options="tableUtils.calcItemsPerPage(permittedProcesessTable)"
                :headers="permittedProcesessHeaders" 
                :items="permittedProcesessTable">

                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                    <TableHeaders
                        :columns="columns"
                        :is-sorted="isSorted"
                        :get-sort-icon="getSortIcon"
                        :toggle-sort="toggleSort"
                        :header-refs-prop="permittedProcesessHeadersRef">
                    </TableHeaders>
                </template>

                 <!-------edit button------->      
                 <template v-slot:item.edit="{ item }">
                    <v-btn 
                        variant="text" 
                        icon="mdi-pencil-outline"
                        @click="permittedProcessesOpenEditDialog(item.index)">
                    </v-btn>
                </template>

                <!-------delete button------->      
                <template v-slot:item.delete="{ item }">
                    <v-btn 
                        variant="text" 
                        icon="mdi-delete-outline"
                        @click="permittedProcessDelete(item.index!)">
                    </v-btn>
                </template>
            </v-data-table>
        </v-col>
    </v-row>

    <v-row class="text-subtitle-1">
        <v-col class="text-subtitle-1">
            <v-row class="mt-10">
                <v-col>{{translate("examDetail.sebSettings.applicationView.prohibitedProcesses.settingName")}}</v-col>
                <v-col  align="right">
                    <v-btn
                        color="primary"
                        density="compact"
                        variant="text"
                        icon="mdi-plus-circle-outline"
                        @click="newProhibitedProcess()">
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider class="border-opacity-25" :thickness="2"></v-divider>
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-data-table 
                item-value="id" 
                class="rounded-lg elevation-4"
                density="compact"
                :headers="prohibitedProcesessHeaders"   
                :items="prohibitedProcesessTable">

                <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                    <TableHeaders
                        :columns="columns"
                        :is-sorted="isSorted"
                        :get-sort-icon="getSortIcon"
                        :toggle-sort="toggleSort"
                        :header-refs-prop="prohibitedProcesessHeadersRef">
                    </TableHeaders>
                </template>

                <!-------edit button------->      
                <template v-slot:item.edit="{ item }">
                    <v-btn 
                        variant="text" 
                        icon="mdi-pencil-outline"
                        @click="prohibitedProcessesOpenEditDialog(item.index)">
                    </v-btn>
                </template>

                <!-------delete button------->      
                <template v-slot:item.delete="{ item }">
                    <v-btn 
                        variant="text" 
                        icon="mdi-delete-outline"
                        @click="prohibitedProcessDelete(item.index!)">
                    </v-btn>
                </template>
            </v-data-table>
        </v-col>
    </v-row>

    <!-----------edit prohibited process dialog---------->      
    <v-dialog v-model="editProhibitedProcesesDialog" max-width="800">
        <EditProhibitedProcess
            @close-edit-prohibited-process="closeEditProhibitedProcessDialog"
            :prohibited-process="selectedProhibitedProceses"
        >
        </EditProhibitedProcess>
    </v-dialog>

</template>

<script setup lang="ts">
    import { useExamStore } from '@/stores/examStore';
    import { storeToRefs } from "pinia";
    import * as tableUtils from "@/utils/table/tableUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    import * as examViewService from "@/services/component-services/examViewService";
    import { useI18n } from "vue-i18n";
    import {translate} from "@/utils/generalUtils";
import { RefSymbol } from '@vue/reactivity';

    const i18n = useI18n();
    const examStore = useExamStore();

    // single attributes
    const allowSwitchToApplications = ref<boolean>();
    const allowFlashFullscreen = ref<boolean>();

    // permittted processes 
    const editPermittedProcesesDialog = ref<boolean>(false);
    const selectedPermittedProceses = ref<PermittedProcesess | null>(null);
    const permittedProcesessHeadersRef = ref<any[]>();
    const permittedProcesessTable = ref<PermittedProcesessRow[]>([]);
    const permittedProcesessHeaders = ref([
        {title: translate("examDetail.sebSettings.applicationView.permittedProcesses.active"), key: "active", sortable: true, width: "10%"},
        {title: translate("examDetail.sebSettings.applicationView.permittedProcesses.os"), key: "os", sortable: true, width: "10%"},
        {title: translate("examDetail.sebSettings.applicationView.permittedProcesses.executable"), key: "executable", sortable: true, width: "30%"},
        {title: translate("examDetail.sebSettings.applicationView.permittedProcesses.title"), key: "title", sortable: true, width: "50%"},
        {title: translate("general.editButton"), key: "edit", sortable: false, width: "5%", center: true},
        {title: translate("general.deleteButton"), key: "delete", sortable: false, width: "5%", center: true}
    ]);
    


    // prohibited processes
    const editProhibitedProcesesDialog = ref<boolean>(false);
    const selectedProhibitedProceses = ref<ProhibitedProcesess | null>(null);
    const prohibitedProcesessHeadersRef = ref<any[]>();
    const prohibitedProcesessTable = ref<ProhibitedProcesessRow[]>([]);
    const prohibitedProcesessHeaders = ref([
        {title: translate("examDetail.sebSettings.applicationView.prohibitedProcesses.active"), key: "active", sortable: true, width: "10%"},
        {title: translate("examDetail.sebSettings.applicationView.prohibitedProcesses.os"), key: "os", sortable: true, width: "10%"},
        {title: translate("examDetail.sebSettings.applicationView.prohibitedProcesses.executable"), key: "executable", sortable: true, width: "30%"},
        {title: translate("examDetail.sebSettings.applicationView.prohibitedProcesses.description"), key: "description", sortable: true, width: "50%"},
        {title: translate("general.editButton"), key: "edit", sortable: false, width: "5%", center: true},
        {title: translate("general.deleteButton"), key: "delete", sortable: false, width: "5%", center: true}
    ]);
    
    // other vars
    let examId: string;
    let settingsView: SEBSettingsView;
    let tableValues: Map<string, SEBSettingsTableRowValues[]>;
    let singleValues: Map<String, SEBSettingsValue>;

    onBeforeMount(async () => {

        await getApplicationViewSettings();

        console.info(examStore.applicationSettings);

        if (examStore.applicationSettings == null) {
            return;
        }
        if (examStore.selectedExam == null) {
            return;
        }

        examId = examStore.selectedExam.id.toString();
        settingsView = examStore.applicationSettings;
        tableValues = new Map<string, SEBSettingsTableRowValues[]>(Object.entries(settingsView.tableValues));
        singleValues = new Map<String, SEBSettingsValue>(Object.entries(settingsView.singleValues));

        allowSwitchToApplications.value = singleValues.get("allowSwitchToApplications")?.value == "true";
        allowFlashFullscreen.value = singleValues.get("allowFlashFullscreen")?.value == "true";

        // Permitted Processes
        const permittedProcessesVals = tableValues.get("permittedProcesses");
        if (permittedProcessesVals == null) {
            return;
        }
        
        for(let i = 0; i < permittedProcessesVals.length; i++){
            const rowVals = new Map<string, SEBSettingsValue>(Object.entries(permittedProcessesVals[i].rowValues));
            const act = translate("general." + rowVals.get("permittedProcesses.active")?.value!, i18n);
            const osName = translate("examDetail.sebSettings.applicationView.permittedProcesses.os_" + rowVals.get("permittedProcesses.os")?.value!, i18n);
            permittedProcesessTable.value.splice(permittedProcessesVals[i].listIndex, 0, { 
                index: i,
                active: act, 
                os : osName,
                executable: rowVals.get("permittedProcesses.executable")?.value!, 
                title: rowVals.get("permittedProcesses.title")?.value! });
        }

        // Prohibited Processes
        const prohibitedProcessesVals = tableValues.get("prohibitedProcesses");
        if (prohibitedProcessesVals == null) {
            return;
        };
        
        for(let i = 0; i < prohibitedProcessesVals.length; i++){
            const rowVals = new Map<string, SEBSettingsValue>(Object.entries(prohibitedProcessesVals[i].rowValues));
            const act = translate("general." + rowVals.get("prohibitedProcesses.active")?.value!, i18n);
            const osName = translate("examDetail.sebSettings.applicationView.prohibitedProcesses.os_" + rowVals.get("prohibitedProcesses.os")?.value!, i18n);
            prohibitedProcesessTable.value.splice(prohibitedProcessesVals[i].listIndex, 0, { 
                index: prohibitedProcessesVals[i].listIndex,
                active: act, 
                os : osName,
                executable: rowVals.get("prohibitedProcesses.executable")?.value!, 
                description: rowVals.get("prohibitedProcesses.description")?.value! });
        }
    })

    
    // ********* permitted processes functions *********************
    function newPermittedProcess() {
        // create empty selectedPermittedProceses and open edit dialog
        selectedPermittedProceses.value = {
            index: -1,
            active: true, 
            os : "1",
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
            teamIdentifier: ""
        };
        editPermittedProcesesDialog.value = true;
    }

    async function permittedProcessDelete(index: number){
        const resp: SEBSettingsTableRowValues[] | null = await examViewService.deleteSEBSettingTableRow(examId, "permittedProcesses", index);
        if (resp == null) {
            return;
        }

        // when backend deleted the row, get the whole list again with new indices
        permittedProcesessTable.value.splice(0);
        resp.forEach( (item) => {
            const rowVals = new Map<string, SEBSettingsValue>(Object.entries(item.rowValues));
            const act = translate("general." + rowVals.get("permittedProcesses.active")?.value!, i18n);
            const osName = translate("examDetail.sebSettings.applicationView.permittedProcesses.os_" + rowVals.get("permittedProcesses.os")?.value!, i18n);
            permittedProcesessTable.value.splice(item.listIndex, 0, { 
                index: item.listIndex,
                active: act, 
                os : osName,
                executable: rowVals.get("permittedProcesses.executable")?.value!, 
                title: rowVals.get("permittedProcesses.title")?.value! });
        });
    }

    function permittedProcessesOpenEditDialog(index: number){
        const permittedProcessesVals = tableValues.get("permittedProcesses");
        if (permittedProcessesVals == null) {
            return;
        };
        
        for(let i = 0; i < permittedProcessesVals.length; i++){
            if (permittedProcessesVals[i].listIndex != index) {
                continue;
            }

            const rowVals = new Map<string, SEBSettingsValue>(Object.entries(permittedProcessesVals[i].rowValues));
            selectedPermittedProceses.value = {
                index: index,
                active: rowVals.get("permittedProcesses.active")?.value! == "true", 
                os : rowVals.get("permittedProcesses.os")?.value!,
                executable: rowVals.get("permittedProcesses.executable")?.value!, 
                originalName: rowVals.get("permittedProcesses.originalName")?.value!, 
                title: rowVals.get("permittedProcesses.title")?.value!,
                signature: rowVals.get("permittedProcesses.signature")?.value!,
                path: rowVals.get("permittedProcesses.path")?.value!,
                iconInTaskbar: rowVals.get("permittedProcesses.iconInTaskbar")?.value! == "true",
                arguments: getPermittedProcessArguments(rowVals.get("permittedProcesses.iconInTaskbar")?.value!),
                allowOpenAndSavePanel: rowVals.get("permittedProcesses.allowOpenAndSavePanel")?.value! == "true",
                autostart: rowVals.get("permittedProcesses.autostart")?.value! == "true",
                allowShareSheet: rowVals.get("permittedProcesses.allowShareSheet")?.value! == "true",
                runInBackground: rowVals.get("permittedProcesses.runInBackground")?.value! == "true",
                allowManualStart: rowVals.get("permittedProcesses.allowManualStart")?.value! == "true",
                allowUserToChooseApp: rowVals.get("permittedProcesses.allowUserToChooseApp")?.value! == "true",
                allowNetworkAccess: rowVals.get("permittedProcesses.allowNetworkAccess")?.value! == "true",
                strongKill: rowVals.get("permittedProcesses.strongKill")?.value! == "true",
                teamIdentifier: rowVals.get("permittedProcesses.teamIdentifier")?.value!
            };
            editPermittedProcesesDialog.value = true;
            break;
        }
    }

    function closeEditPermittedProcessDialog(apply?: boolean){ 
        console.info("************* apply: " + apply);
        editPermittedProcesesDialog.value = false;
        
        if (!apply) {
            return;
        }

        if (selectedPermittedProceses.value?.index == -1) {
            // TODO create new entry
        } else {
            // TODO  update entry
        }
    }

    function getPermittedProcessArguments(args: string | null): PermittedProcesessArgument[] | [] {
        // args = active=true|argument=arg1,active=true|argument=arg2,...
        let result: PermittedProcesessArgument[] = [];
        if (args == null) {
            return result;
        }

        const list = args.split(",");
        list.forEach( (line) => {
            const vals = line.split("|");
            result.push({
                active: vals[0] == "true",
                argument: vals[1]
            });
        });

        return result;
    }

    // ********* prohibited processes functions *********************
    function newProhibitedProcess() {
        // create empty selectedProhibitedProceses and open edit dialog
        selectedProhibitedProceses.value = {
            index: -1,
            active: true, 
            os : "1",
            executable: "", 
            originalName: "", 
            description: "",
            identifier: "",
            strongKill: false,
            ignoreInAAC: true
        };
        editProhibitedProcesesDialog.value = true;
    }

    async function prohibitedProcessDelete(index: number){
        const resp: SEBSettingsTableRowValues[] | null = await examViewService.deleteSEBSettingTableRow(examId, "prohibitedProcesses", index);
        if (resp == null) {
            return;
        }

        // when backend deleted the row, get the whole list again with new indices
        prohibitedProcesessTable.value.splice(0);
        resp.forEach( (item) => {
            const rowVals = new Map<string, SEBSettingsValue>(Object.entries(item.rowValues));
            const act = translate("general." + rowVals.get("prohibitedProcesses.active")?.value!, i18n);
            const osName = translate("examDetail.sebSettings.applicationView.prohibitedProcesses.os_" + rowVals.get("prohibitedProcesses.os")?.value!, i18n);
            prohibitedProcesessTable.value.splice(item.listIndex, 0, { 
                index: item.listIndex,
                active: act, 
                os : osName,
                executable: rowVals.get("prohibitedProcesses.executable")?.value!, 
                description: rowVals.get("prohibitedProcesses.description")?.value! });
        });
    }


    function prohibitedProcessesOpenEditDialog(index: number){
        const prohibitedProcessesVals = tableValues.get("prohibitedProcesses");
        if (prohibitedProcessesVals == null) {
            return;
        };
        
        for(let i = 0; i < prohibitedProcessesVals.length; i++){
            if (prohibitedProcessesVals[i].listIndex != index) {
                continue;
            }

            const rowVals = new Map<string, SEBSettingsValue>(Object.entries(prohibitedProcessesVals[i].rowValues));
            selectedProhibitedProceses.value = {
                index: index,
                active: rowVals.get("prohibitedProcesses.active")?.value! == "true", 
                os : rowVals.get("prohibitedProcesses.os")?.value!,
                executable: rowVals.get("prohibitedProcesses.executable")?.value!, 
                originalName: rowVals.get("prohibitedProcesses.originalName")?.value!, 
                description: rowVals.get("prohibitedProcesses.description")?.value!,
                identifier: rowVals.get("prohibitedProcesses.identifier")?.value!,
                strongKill: rowVals.get("prohibitedProcesses.strongKill")?.value! == "true",
                ignoreInAAC: rowVals.get("prohibitedProcesses.ignoreInAAC")?.value! == "true"
            };
            editProhibitedProcesesDialog.value = true;
            break;
        }
    }

    async function closeEditProhibitedProcessDialog(apply?: boolean){ 
        
        editProhibitedProcesesDialog.value = false;
        
        if (!apply) {
            return;
        }

        if (!selectedProhibitedProceses.value) {
            return;
        }

        let index: number = -1;
        let rowValues: Map<string, SEBSettingsValue> | null = null;
        
        if (selectedProhibitedProceses.value.index == -1) {
            // TODO create new table row, add row to this table
        } else {
            index = selectedProhibitedProceses.value.index;
            const prohibitedProcessesVals = tableValues.get("prohibitedProcesses");
            if (prohibitedProcessesVals == null) {
                return;
            };
            
            rowValues = new Map<string, SEBSettingsValue>(Object.entries(prohibitedProcessesVals[selectedProhibitedProceses.value.index].rowValues)); 
        }

        if (rowValues == null) {
            return;
        }

        

        // TODO update values
        
        let val = rowValues.get("prohibitedProcesses.active");
        
        if (!val) {
            return;
        }
        
        let new_val = selectedProhibitedProceses.value.active ? "true" : "false";
        await examViewService.updateSEBSettingValue(examId, val.id.toString(), new_val );
        console.info("************* apply: " + new_val);
        permittedProcesessTable.value[0].active = "drfswrghwrghwrghw";

        // for (let i = 0; i < permittedProcesessTable.value.length; i++) {
        //     if (permittedProcesessTable.value[i].index == index) {
        //         console.info("************* apply: " + val.id);
        //         permittedProcesessTable.value[i].active = new_val;
        //         console.info("************* new val: " + permittedProcesessTable.value[i].active);
        //     }
        // }
    }




    // ********* get / save functions *********************
    async function getApplicationViewSettings() {
        if(examStore.selectedExam == null){
            return;
        }

        const viewResponse: SEBSettingsView | null = await examViewService.getApplicationViewSettings(examStore.selectedExam.id.toString())

        if(viewResponse == null){
            return;
        }

        examStore.applicationSettings = viewResponse;
    }

    async function sendSingleValue(attrName: string, value: string) {
        const val = singleValues.get(attrName);
        if (val == null) {
            return;
        }

        await examViewService.updateSEBSettingValue(examId, val.id.toString(), value );
    }



</script>