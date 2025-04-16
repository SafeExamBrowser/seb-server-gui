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
            {{translate("examDetail.sebSettings.applicationView.permittedProcesses.settingName")}}
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-data-table 
                hide-default-footer
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
                        @click="permittedProcessesOpenDeleteDialog(item.index!)">
                    </v-btn>
                </template>
            </v-data-table>
        </v-col>
    </v-row>

    <v-row class="text-subtitle-1">
        <v-col class="text-subtitle-1">
            {{translate("examDetail.sebSettings.applicationView.prohibitedProcesses.settingName")}}
        </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-data-table 
                hide-default-footer
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
                        @click="prohibitedProcessesOpenDeleteDialog(item.index!)">
                    </v-btn>
                </template>
            </v-data-table>
        </v-col>
    </v-row>



</template>

<script setup lang="ts">
    import { useExamStore } from '@/stores/examStore';
    import { storeToRefs } from "pinia";
    import * as tableUtils from "@/utils/table/tableUtils";
    import * as timeUtils from "@/utils/timeUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    import * as examViewService from "@/services/component-services/examViewService";
    import { useI18n } from "vue-i18n";
    import {translate} from "@/utils/generalUtils";
import { RefSymbol } from '@vue/reactivity';
import { vModelRadio } from 'vue';

    //stores
    const examStore = useExamStore();
    const examStoreRef = storeToRefs(examStore);

    const allowSwitchToApplications = ref<boolean>();
    const allowFlashFullscreen = ref<boolean>();

    const permittedProcesessHeadersRef = ref<any[]>();
    const permittedProcesessHeaders = ref([
        {title: translate("examDetail.sebSettings.applicationView.permittedProcesses.active"), key: "active", sortable: true, width: "10%"},
        {title: translate("examDetail.sebSettings.applicationView.permittedProcesses.os"), key: "os", sortable: true, width: "10%"},
        {title: translate("examDetail.sebSettings.applicationView.permittedProcesses.executable"), key: "executable", sortable: true, width: "30%"},
        {title: translate("examDetail.sebSettings.applicationView.permittedProcesses.title"), key: "title", sortable: true, width: "50%"},
        {title: translate("general.editButton"), key: "edit", sortable: false, width: "5%", center: true},
        {title: translate("general.deleteButton"), key: "delete", sortable: false, width: "5%", center: true}
    ]);
    const permittedProcesessTable = ref<PermittedProcesessRow[]>([]);


    const prohibitedProcesessHeadersRef = ref<any[]>();
    const prohibitedProcesessHeaders = ref([
        {title: translate("examDetail.sebSettings.applicationView.prohibitedProcesses.active"), key: "active", sortable: true, width: "10%"},
        {title: translate("examDetail.sebSettings.applicationView.prohibitedProcesses.os"), key: "os", sortable: true, width: "10%"},
        {title: translate("examDetail.sebSettings.applicationView.prohibitedProcesses.executable"), key: "executable", sortable: true, width: "30%"},
        {title: translate("examDetail.sebSettings.applicationView.prohibitedProcesses.description"), key: "description", sortable: true, width: "50%"},
        {title: translate("general.editButton"), key: "edit", sortable: false, width: "5%", center: true},
        {title: translate("general.deleteButton"), key: "delete", sortable: false, width: "5%", center: true}
    ]);
    const prohibitedProcesessTable = ref<ProhibitedProcesess[]>([]);

    let examId: string;
    let settingsView: SEBSettingsView;
    let tableValues: Map<string, SEBSettingsTableRowValues[]>;
    let singleValues: Map<String, SEBSettingsValue>;

    onBeforeMount(async () => {
        const i18n = useI18n();

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
                index: i,
                active: act, 
                os : osName,
                executable: rowVals.get("prohibitedProcesses.executable")?.value!, 
                description: rowVals.get("prohibitedProcesses.description")?.value! });
        }
    })

    async function sendSingleValue(attrName: string, value: string) {
        console.info(attrName + ":" + value);
        const val = singleValues.get(attrName);
        if (val == null) {
            return;
        }

        await examViewService.updateSEBSettingValue(examId, val.id.toString(), value );
    }


    function permittedProcessesOpenEditDialog(index: number){

    }

    function permittedProcessesOpenDeleteDialog(index: number){

    }

    function prohibitedProcessesOpenEditDialog(index: number){

    }

    function prohibitedProcessesOpenDeleteDialog(index: number){

    }

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



</script>