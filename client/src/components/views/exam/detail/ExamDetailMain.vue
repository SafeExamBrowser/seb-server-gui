<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-8">

                <!----------title--------->
                <v-row>
                    <v-col>
                        <div class="primary-text-color text-h5 font-weight-bold">
                            {{translate("titles.examDetails")}}
                        </div>
                        <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                    </v-col>
                </v-row>

                <!----------infos and actions--------->
                <v-row class="mt-10">

                    <v-spacer></v-spacer>
                    <!----------left side--------->
                    <v-col cols="6" xl="4">

                        <!----------test run--------->
                        <v-row>
                            <v-col>
                                <v-sheet 
                                    elevation="4"
                                    class="rounded-lg pa-4">

                                    <v-row align="center">
                                        <v-col>
                                            {{translate("examDetail.main.testExam")}}
                                        </v-col>
                                        <v-col align="right" cols="4" xl="3">
                                            <v-btn 
                                                v-if="generalUtils.findEnumValue(ExamStatusEnum, examStore.selectedExam?.status) == ExamStatusEnum.TEST_RUN"
                                                block
                                                rounded="sm" 
                                                color="primary" 
                                                variant="flat"
                                                @click="applyTestRun()">
                                                {{translate("examDetail.main.testRunDisable")}}
                                            </v-btn>
                                            <v-btn 
                                                v-else
                                                block
                                                rounded="sm" 
                                                color="primary" 
                                                variant="flat"
                                                :disabled="examViewService.isExamFunctionalityDisabled([ExamStatusEnum.UP_COMING], examStore.selectedExam?.status)"
                                                @click="applyTestRun()">
                                                {{translate("examDetail.main.testRunApply")}}
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                    <v-tooltip activator="parent">
                                        {{translate("examDetail.main.testTooltip")}}
                                    </v-tooltip>

                                </v-sheet>
                            </v-col>
                        </v-row>

                        <!----------monitor exam--------->
                        <v-row class="mt-6">
                            <v-col>
                                <v-card 
                                    elevation="4"
                                    class="rounded-lg pa-4">

                                    <v-row align="center">
                                        <v-col>
                                            {{translate("examDetail.main.monitorExam")}}
                                        </v-col>
                                        <v-col align="right" cols="4" xl="3">
                                            <v-btn 
                                                block
                                                rounded="sm" 
                                                color="primary" 
                                                variant="flat" 
                                                :disabled="examViewService.isExamFunctionalityDisabled([ExamStatusEnum.RUNNING, ExamStatusEnum.TEST_RUN], examStore.selectedExam?.status)">
                                                {{translate("examDetail.main.monitorStart")}}
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                    <v-tooltip activator="parent">
                                        {{translate("examDetail.main.monitorTooltip")}}
                                    </v-tooltip>

                                </v-card>
                            </v-col>
                        </v-row>

                        <!----------template--------->
                        <v-row class="mt-10">
                            <v-col class="primary-text-color text-h6"> 
                                {{translate("examDetail.main.examTemplate")}}
                            </v-col>
                            <v-col align="right">
                                <v-btn
                                    color="primary"
                                    density="compact"
                                    variant="text"
                                    icon="mdi-information-outline"
                                    :disabled="examStore.selectedExamTemplate == null"
                                    @click="openExamTemplateDialog()">
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                        
                        <v-row class="mt-1">
                            <v-col>
                                <div class="text-subtitle-1">
                                    <template v-if="examStore.selectedExamTemplate != null">
                                        {{ examStore.selectedExamTemplate?.name }}
                                    </template>
                                    <template v-else>
                                        -
                                    </template>
                                </div>
                            </v-col>
                        </v-row>
                        <!----------------------->

                        <!-------supervisors------>
                        <v-row class="mt-10">
                            <v-col class="primary-text-color text-h6"> 
                                {{translate("examDetail.main.examSupervisors")}}
                            </v-col>

                            <v-col align="right">
                                <v-btn
                                    color="primary"
                                    density="compact"
                                    variant="text"
                                    icon="mdi-pencil-circle-outline"
                                    @click="openSupervisorsDialog()">
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-divider class="border-opacity-25" :thickness="2"></v-divider>

                        <v-row>
                            <v-col>
                                <v-data-table 
                                    hide-default-footer
                                    item-value="id" 
                                    class="rounded-lg elevation-2 mt-4"
                                    :headers="supervisorsTableHeaders" 
                                    :items="examStore.selectedExamSupervisors">

                                    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                                        <TableHeaders
                                            :columns="columns"
                                            :is-sorted="isSorted"
                                            :get-sort-icon="getSortIcon"
                                            :toggle-sort="toggleSort"
                                            :header-refs-prop="supervisorsTableHeadersRef">
                                        </TableHeaders>
                                    </template>
                                </v-data-table>
                            </v-col>
                        </v-row>
                        <!------------------->

                        <!-------Groups------>
                        <v-row class="mt-10">
                            <v-col class="primary-text-color text-h6"> 
                                {{translate("examDetail.main.groups")}}
                            </v-col>

                            <v-col align="right">
                                <v-btn
                                    color="primary"
                                    density="compact"
                                    variant="text"
                                    icon="mdi-plus-circle-outline"
                                    :disabled="examViewService.isExamFunctionalityDisabled([ExamStatusEnum.UP_COMING, ExamStatusEnum.RUNNING, ExamStatusEnum.TEST_RUN], examStore.selectedExam?.status)"
                                    @click="openAddClientGroupDialog()">
                                </v-btn>
                                <v-btn
                                    color="primary"
                                    density="compact"
                                    variant="text"
                                    icon="mdi-pencil-circle-outline"
                                    :disabled="examViewService.isExamFunctionalityDisabled([ExamStatusEnum.UP_COMING, ExamStatusEnum.RUNNING, ExamStatusEnum.TEST_RUN], examStore.selectedExam?.status)"
                                    @click="openClientGroupDialog()">
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-divider class="border-opacity-25" :thickness="2"></v-divider>

                        <v-row>
                            <v-col>
                                <!--@vue-ignore-->
                                <v-data-table 
                                    hide-default-footer
                                    item-value="id" 
                                    class="rounded-lg elevation-2 mt-4"
                                    :headers="clientGroupTableHeaders" 
                                    :items="examStore.selectedClientGroups">

                                    <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort}">
                                        <TableHeaders
                                            :columns="columns"
                                            :is-sorted="isSorted"
                                            :get-sort-icon="getSortIcon"
                                            :toggle-sort="toggleSort"
                                            :header-refs-prop="clientGroupTableHeadersRef">
                                        </TableHeaders>
                                    </template>

                                    <template v-slot:item.type="{ item }">
                                        {{ translate(generalUtils.findEnumValue(ClientGroupEnum, item.type)) }}
                                    </template>

                                    <template v-slot:item.sp="{ item }">
                                        <v-icon :icon="item.isSPSGroup ? 'mdi-check' : ''"></v-icon>
                                    </template>

                                </v-data-table>
                            </v-col>
                        </v-row>
                        <!------------------->

                        <!--------quit password------>
                        <v-row class="mt-10">
                            <v-col>
                                <div class="primary-text-color text-h6">
                                    {{translate("examDetail.main.quitPassword")}}
                                </div>
                                <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-text-field
                                    :type="passwordVisible ? 'text' : 'password'"
                                    prepend-inner-icon="mdi-lock-outline"
                                    density="compact"
                                    placeholder="Password"
                                    variant="outlined"
                                    :disabled="examViewService.isExamFunctionalityDisabled([ExamStatusEnum.UP_COMING, ExamStatusEnum.RUNNING, ExamStatusEnum.TEST_RUN], examStore.selectedExam?.status)"
                                    v-model="quitPassword">

                                    <template v-slot:append-inner>
                                        <v-btn
                                            density="compact"
                                            variant="text"
                                            :icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                            @click="passwordVisible = !passwordVisible">
                                        </v-btn>
                                    </template>

                                </v-text-field>
                            </v-col>
                        </v-row>
                        <!------------------->
                    
                    </v-col>
                    <!----------------------->

                    <!-- <v-col cols="1"></v-col> -->
                    <v-spacer></v-spacer>

                    <!----------right side--------->
                    <v-col cols="6" xl="4">

                        <!----------edit seb settings--------->
                        <v-row>
                            <v-col>
                                <v-sheet 
                                    elevation="4"
                                    class="rounded-lg pa-4">

                                    <v-row align="center">
                                        <v-col>
                                            {{translate("examDetail.main.appNetworkSettings")}}
                                        </v-col>
                                        
                                        <v-col align="right" cols="4" xl="3">
                     
                                            <v-btn 
                                                block
                                                rounded="sm" 
                                                color="primary" 
                                                variant="flat"
                                                :disabled="!hasSEBSettings || !editableSEBSettings"
                                                @click="openSebSettingsDialog()">
                                                {{translate("general.editButton")}}
                                            </v-btn>
                                            <v-tooltip v-if="!hasSEBSettings" activator="parent">
                                                <p v-html="generalUtils.translateWithBR('examDetail.main.noSEBSettings')" />
                                            </v-tooltip>
                                        </v-col>
                                    </v-row>

                                </v-sheet>
                            </v-col>
                        </v-row>

                        <!----------exam config--------->
                        <v-row class="mt-6">
                            <v-col>
                                <v-sheet 
                                    elevation="4"
                                    class="rounded-lg pa-4">

                                    <v-row align="center">
                                        <v-col>
                                            {{translate("examDetail.main.downloadExamConfig")}}
                                        </v-col>
                                        <v-col align="right" cols="4" xl="3">
                                            <v-btn 
                                                block
                                                rounded="sm" 
                                                color="primary" 
                                                variant="flat" 
                                                :disabled="examViewService.isExamFunctionalityDisabled([ExamStatusEnum.UP_COMING, ExamStatusEnum.RUNNING, ExamStatusEnum.TEST_RUN], examStore.selectedExam?.status)"
                                                @click="startExamConfigDownloadProcess()">
                                                {{translate("general.downloadButton")}}
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                </v-sheet>
                            </v-col>
                        </v-row>

                        <!----------more options--------->
                        <v-row class="mt-6">
                            <v-col>
                                <v-card 
                                    color="primary"
                                    variant="outlined"
                                    class="rounded-lg pa-4">

                                    <v-row align="center">
                                        <v-col>
                                            <div>
                                                {{translate("examDetail.main.moreExamOptions")}}
                                            </div>

                                            <v-list class="mt-4" select-strategy="leaf">

                                                <!----------Apply Screen Proctoring--------->
                                                <v-list-item>
                                                    <v-list-item-title :class="[examViewService.isExamFunctionalityDisabled([ExamStatusEnum.UP_COMING, ExamStatusEnum.RUNNING, ExamStatusEnum.TEST_RUN], examStore.selectedExam?.status) ? 'disabled-text-color' : '']">
                                                        {{translate("examDetail.main.applySP")}}
                                                    </v-list-item-title>
                                                    <template v-slot:append="{ isSelected }" >
                                                        <v-list-item-action class="flex-column align-right">
                                                            <v-switch 
                                                                v-model="isScreenProctoringActive"
                                                                v-on:update:model-value="applyScreenProctoring()"
                                                                hide-details
                                                                :disabled="examViewService.isExamFunctionalityDisabled([ExamStatusEnum.UP_COMING, ExamStatusEnum.RUNNING, ExamStatusEnum.TEST_RUN], examStore.selectedExam?.status)"
                                                                color="primary">
                                                            </v-switch>
                                                        </v-list-item-action>
                                                    </template>
                                                </v-list-item>
                                                <v-divider class="border-opacity-25" :thickness="2"></v-divider>

                                                <!----------Apply SEB Lock--------->
                                                <v-list-item>
                                                    <v-list-item-title :class="[hasSEBRestrictionFeature() && !examViewService.isExamFunctionalityDisabled([ExamStatusEnum.UP_COMING, ExamStatusEnum.RUNNING, ExamStatusEnum.TEST_RUN, ExamStatusEnum.FINISHED], examStore.selectedExam?.status) ? '' : 'disabled-text-color']">
                                                        {{translate("examDetail.main.applySebLock")}}
                                                    </v-list-item-title>
                                                    <template v-slot:append="{ isSelected }" >
                                                        <v-list-item-action class="flex-column align-right">
                                                            <v-switch 
                                                                v-model="isSEBLockActive"
                                                                v-on:update:model-value="applySEBLock()"
                                                                hide-details
                                                                :disabled="!hasSEBRestrictionFeature() || examViewService.isExamFunctionalityDisabled([ExamStatusEnum.UP_COMING, ExamStatusEnum.RUNNING, ExamStatusEnum.TEST_RUN, ExamStatusEnum.FINISHED], examStore.selectedExam?.status)"
                                                                color="primary">
                                                            </v-switch>
                                                        </v-list-item-action>
                                                    </template>
                                                </v-list-item>
                                                <v-divider class="border-opacity-25" :thickness="2"></v-divider>

                                                <!----------SEB Keys--------->
                                                <v-list-item>
                                                    <v-list-item-title :class="[hasSEBRestrictionFeature() && !examViewService.isExamFunctionalityDisabled([ExamStatusEnum.UP_COMING, ExamStatusEnum.RUNNING, ExamStatusEnum.TEST_RUN, ExamStatusEnum.FINISHED], examStore.selectedExam?.status) ? '' : 'disabled-text-color']">
                                                        {{translate("examDetail.main.sebKeys")}}
                                                    </v-list-item-title>
                                                    <template v-slot:append="{ isSelected }" >
                                                        <v-list-item-action class="flex-column align-right">
                                                            <v-icon 
                                                                icon="mdi-key-outline"
                                                                style="font-size: 30px;"
                                                                :disabled="!hasSEBRestrictionFeature() || examViewService.isExamFunctionalityDisabled([ExamStatusEnum.UP_COMING, ExamStatusEnum.RUNNING, ExamStatusEnum.TEST_RUN, ExamStatusEnum.FINISHED], examStore.selectedExam?.status)"
                                                                @click="">
                                                            </v-icon>
                                                        </v-list-item-action>
                                                    </template>
                                                </v-list-item>
                                                <v-divider class="border-opacity-25" :thickness="2"></v-divider>

                                                <!----------Archive Exam--------->
                                                <v-list-item>
                                                    <v-list-item-title :class="[examViewService.isExamFunctionalityDisabled([ExamStatusEnum.FINISHED], examStore.selectedExam?.status) ? 'disabled-text-color' : '']">
                                                        {{translate("examDetail.main.archiveExam")}}
                                                    </v-list-item-title>
                                                    <template v-slot:append="{ isSelected }" >
                                                        <v-list-item-action class="flex-column align-right">
                                                            <v-icon 
                                                                icon="mdi-archive-outline"
                                                                style="font-size: 30px;"
                                                                :disabled="examViewService.isExamFunctionalityDisabled([ExamStatusEnum.FINISHED], examStore.selectedExam?.status)"
                                                                @click="openArchiveDialog()">
                                                            </v-icon>
                                                        </v-list-item-action>
                                                    </template>

                                                    <v-tooltip v-if="examViewService.isExamFunctionalityDisabled([ExamStatusEnum.FINISHED], examStore.selectedExam?.status)" activator="parent">
                                                        {{translate("examDetail.main.archiveTooltip")}}
                                                    </v-tooltip>

                                                </v-list-item>
                                                <v-divider class="border-opacity-25" :thickness="2"></v-divider>

                                                <!----------Delete Exam--------->
                                                <v-list-item>
                                                    <v-list-item-title>
                                                        {{translate("examDetail.main.deleteExam")}}
                                                    </v-list-item-title>
                                                    <template v-slot:append="{ isSelected }" >
                                                        <v-list-item-action class="flex-column align-right">
                                                            <v-icon 
                                                                icon="mdi-delete-outline"
                                                                style="font-size: 30px;"
                                                                @click="openDeleteDialog()">
                                                            </v-icon>
                                                        </v-list-item-action>
                                                    </template>
                                                </v-list-item>

                                            </v-list>
                                        </v-col>
                                    </v-row>

                                </v-card>
                            </v-col>
                        </v-row>
                        <!----------------------->
                    
                    </v-col>
                    <!----------end right side--------->
                    <v-spacer></v-spacer>


                </v-row>
                <!--------end info and action row------>
            
            </v-sheet>
        </v-col>
    </v-row>

    <!-----------supervisor dialog---------->      
    <v-dialog v-model="supervisorsDialog" max-width="1200">
        <ExamDetailSupervisorsDialog 
            :initalSupervisors="examStore.selectedExamSupervisors"
            @closeSupervisorsDialog="closeSupervisorsDialog"
            @updateExamSupervisors="updateExamSupervisors">
        </ExamDetailSupervisorsDialog>
    </v-dialog>

    <!-----------connection configuration dialog---------->      
    <v-dialog v-model="configDialog" v-if="connectionConfigurationsPar" max-width="800">
        <ExamDetailConfigDialog 
            :connection-configurations="connectionConfigurationsPar" 
            @closeConfigDialog="closeConfigDialog"
            @downloadExamConfig="downloadExamConfig">
        </ExamDetailConfigDialog>
    </v-dialog>

    <!-----------archive dialog---------->      
    <v-dialog v-model="archiveDialog" max-width="800">
        <ExamDetailArchiveDialog 
            @close-archive-dialog="closeArchiveDialog"
            @archive-exam="archiveExam">
        </ExamDetailArchiveDialog>
    </v-dialog>

    <!-----------delete exam dialog---------->      
    <v-dialog v-model="deleteDialog" max-width="800">
        <DeleteConfirmDialog
            @close-delete-dialog="closeDeleteDialog"
            @delete-function="deleteExam"
            title="Delete Exam"
            info-text="This deletes the exam and the local import of a course or quiz in SEB Server."
            question-text="Are you sure you want to delete the exam?"
        >
        </DeleteConfirmDialog>
    </v-dialog>

    <!-----------exam template dialog---------->      
    <v-dialog v-model="examTemplateDialog" max-width="600">
        <ExamTemplateDialog 
            :exam-template="examStore.selectedExamTemplate"
            @close-exam-template-dialog="closeExamTemplateDialog()">
        </ExamTemplateDialog>
    </v-dialog>

    <!-----------seb settings dialog---------->      
    <v-dialog v-model="sebSettingsDialog" max-width="1200">
        <SebSettingsDialog 
            @close-seb-settings-dialog="closeSebSettingsDialog()">
        </SebSettingsDialog>
    </v-dialog>

    <!-----------group dialog---------->      
    <v-dialog v-model="clientGroupDialog" max-width="1200">
        <ClienGroupListDialog 
            @closeClientGroupDialog="closeClientGroupDialog">
        </ClienGroupListDialog>
    </v-dialog>

    <!-----------add groups dialog---------->      
    <v-dialog v-model="addclientGroupDialog" max-width="800">
        <AddClientGroupDialog 
            @closeAddClientGroupDialog="closeAddClientGroupDialog">
        </AddClientGroupDialog>
    </v-dialog>

    <!--alert msg-->
    <AlertMsg 
        v-if="alertAvailable"
        :alertProps="{
            title: '',
            color: alertColor,
            type: 'snackbar',
            textKey: alertKey,
            timeout: 5000
        }">
    </AlertMsg>


</template>

<script setup lang="ts">
    import { useExamStore } from '@/stores/examStore';
    import * as constants from "@/utils/constants";
    import * as examViewService from "@/services/component-services/examViewService";
    import * as assessmentToolViewService from "@/services/component-services/assessmentToolViewService";
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import * as clientGroupViewService from "@/services/component-services/clientGroupViewService";
    import { storeToRefs } from "pinia";
    import * as timeUtils from "@/utils/timeUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import { navigateTo } from '@/router/navigation';
    import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";
    import DeleteConfirmDialog from "@/components/widgets/DeleteConfirmDialog.vue";
    import { ClientGroupEnum, ClientOSEnum } from "@/models/clientGroupEnum";
    import TableHeaders from "@/utils/table/TableHeaders.vue";
    import { useI18n } from "vue-i18n";
    import {translate} from "@/utils/generalUtils";
    import { LMSFeatureEnum } from '@/models/assessmentToolEnums';

    //i18n
    const i18n = useI18n();

    //general
    const isPageInitalizing = ref<boolean>(true);

    //stores
    const examStore = useExamStore();
    const examStoreRef = storeToRefs(examStore);

    //exam
    const examId = useRoute().params.examId.toString();

    //pw field
    let initalPassword: string | null = null;
    const passwordVisible = ref<boolean>(false);
    const quitPassword = ref<string>("");
    let quitPasswordTimeout: ReturnType<typeof setTimeout> | null = null;

    //supervisors table
    const supervisorsTableHeadersRef = ref<any[]>();
    const supervisorsTableHeaders = ref([
        {title: "Name", key: "name"},
        {title: "Role(s)", key: "roles"}
    ]); 

    //supervisors dialog
    const supervisorsDialog = ref<boolean>(false);
    let initialSupervisorsIds: string[] = []

    //exam config dialog
    const configDialog = ref<boolean>(false);
    const connectionConfigurationsPar = ref<ConnectionConfigurations | null>(null);

    //archive dialog
    const archiveDialog = ref<boolean>(false);

    //exam template dialog
    const examTemplateDialog = ref<boolean>(false);

    //delete exam
    const deleteDialog = ref<boolean>(false);

    //alert
    const alertAvailable = ref<boolean>();
    const alertColor = ref<string>("");
    const alertKey = ref<string>("");

    // SEB lock
    const isSEBLockActive = ref<boolean>(false);

    //screen proctoring
    const isScreenProctoringActive = ref<boolean>(false);

    //seb settings
    const hasSEBSettings = ref<boolean>(false);
    const editableSEBSettings = ref<boolean>(false);
    const sebSettingsDialog = ref<boolean>(false);
    

    //client groups
    const clientGroupDialog = ref<boolean>(false);
    const clientGroupTableHeadersRef = ref<any[]>();
    const clientGroupTableHeaders = ref([
        {title: translate("examDetail.main.tableHeadersGroupName"), key: "name", width: "45%"},
        {title: translate("examDetail.main.tableHeadersGroupType"), key: "type", width: "45%"},
        {title: translate("examDetail.main.tableHeadersScreenProctoring"), key: "sp", width: "10%", center: true, align: "center"}
    ]); 

    //add client groups
    const addclientGroupDialog = ref<boolean>(false);
    
    onBeforeMount(async () => {
        examStore.clearSelectedValues();

        await getExam();
        await getExamTemplate();
        await getAssessmentTool();
        await getExamSupervisors();
        await getClientGroups();
        await getSEBSettings();

        setQuitPassword();
        initSEBLock();
        setScreenProctoring();
        isPageInitalizing.value = false;
    });

    watch(quitPassword, () => {
        if(isPageInitalizing.value){
            return;
        }

        if(quitPasswordTimeout){
            clearTimeout(quitPasswordTimeout);
        }

        quitPasswordTimeout = setTimeout(() => {
            updateQuitPassword();
        }, 500);
    });

    //========exam api===========
    async function getExam(){
        const examResponse: Exam | null = await examViewService.getExam(examId);

        if(examResponse == null){
            return;
        }

        examStore.selectedExam = examResponse;
    }

    async function updateExam(isSupervisorsManualUpdate?: boolean){
        alertAvailable.value = false;

        if(examStore.selectedExam == null){
            return;
        }

        const updateExamResponse: Exam | null = await examViewService.updateExam(examId, examStore.selectedExam);

        if(updateExamResponse == null){
            return;
        }

        if(isSupervisorsManualUpdate){
            getExamSupervisors();
        }

        alertAvailable.value = true;
        alertColor.value = "success";
        alertKey.value = "exam-update-successful";

        examStore.selectedExam = updateExamResponse;
    }


    //==============seb lock logic=================
    async function getAssessmentTool() {
        const lmsId: number | undefined = examStore.selectedExam?.lmsSetupId;

        if(lmsId == null){
            return;
        }

        const assessmentToolResponse: AssessmentTool | null = await assessmentToolViewService.getAssessmentTool(lmsId);
        if(assessmentToolResponse == null){
            return;
        }

        examStore.relatedAssessmentTool = assessmentToolResponse;
    }

    function hasSEBRestrictionFeature(): boolean {
        if (examStore.relatedAssessmentTool) {
            return generalUtils.hasLMSFeature(examStore.relatedAssessmentTool.lmsType, LMSFeatureEnum.SEB_RESTRICTION);
        }
        return false;
    }

    function initSEBLock(){
        if(examStore.selectedExam == null){
            return;
        } 

        if(examStore.selectedExam.lmsSebRestriction){
            isSEBLockActive.value = true;
        }
    }

    async function applySEBLock(){
        if(isSEBLockActive.value){
            changeSEBLock(true);
            return;
        }

        changeSEBLock(false);
    }

    async function changeSEBLock(enable: boolean){  
        if(examStore.selectedExam == null){
            return;
        }

        const applySEBLockResponse: Exam | null = await examViewService.applySEBLock(
            examStore.selectedExam.id.toString(), 
            enable
        );

        if(applySEBLockResponse == null){
            isSEBLockActive.value = !enable;
            return;
        }

        examStore.selectedExam = applySEBLockResponse;
    }
    

    //===============supervisors logic====================
    async function getExamSupervisors(){
        if(examStore.selectedExam?.supporter == null){
            return;
        }

        if(examStore.selectedExam.supporter.length == 0){
            examStore.selectedExamSupervisors = [];
            return;
        }

        examStore.selectedExamSupervisors = [];
        for(let i = 0; i < examStore.selectedExam.supporter.length; i++){
            const userAccount: UserAccount | null = await userAccountViewService.getUserAccountById(examStore.selectedExam.supporter[i]);

            if(userAccount == null){
                return;
            }

            examStore.selectedExamSupervisors.push(userAccount);
        }
    }

    function openSupervisorsDialog(){
        //add supervisors id to list to determine change
        fillAlreadySelectedSupervisors();
        supervisorsDialog.value = true;
    }

    function closeSupervisorsDialog(){
        supervisorsDialog.value = false;
    }

    async function updateExamSupervisors(selectedExamSupervisors: UserAccount[]){
        if(examStore.selectedExam == null){
            return;
        }

        examStore.selectedExam.supporter = selectedExamSupervisors.map(supervisor => supervisor.uuid);
        await updateExam(true);
        closeSupervisorsDialog();
    }

    function fillAlreadySelectedSupervisors(){
        initialSupervisorsIds = [];
        for(let i = 0; i < examStore.selectedExamSupervisors.length; i++){
            initialSupervisorsIds.push(examStore.selectedExamSupervisors[i].uuid);
        }
    }

    //===============password logic====================
    function setQuitPassword(){
        if(examStore.selectedExam?.quitPassword == null || examStore.selectedExam?.quitPassword == ""){
            return;
        }

        quitPassword.value = examStore.selectedExam?.quitPassword;
        initalPassword = examStore.selectedExam?.quitPassword;
    }

    async function updateQuitPassword(){
        if(examStore.selectedExam == null || initalPassword == quitPassword.value){
            return;
        }

        examStore.selectedExam.quitPassword = quitPassword.value;
        updateExam();
    }

    //===============exam config logic====================
    function openConfigDialog(connectionConfigurations: ConnectionConfigurations){
        connectionConfigurationsPar.value = connectionConfigurations;
        configDialog.value = true;
    }

    function closeConfigDialog(){
        configDialog.value = false;
    }

    async function startExamConfigDownloadProcess(){
        const connectionConfigurations: ConnectionConfigurations | null = await examViewService.getConnectionConfigurations();

        if(connectionConfigurations == null){
            return;
        }

        if(connectionConfigurations.content.length == 1){
            downloadExamConfig(connectionConfigurations.content[0].id.toString());
            return;
        }

        openConfigDialog(connectionConfigurations);
    }

    async function downloadExamConfig(connectionId: string){
        if(configDialog.value){
            closeConfigDialog();
        }

        if(examStore.selectedExam == null){
            return;
        }

        const blobResponse = await examViewService.downloadExamConfig(examStore.selectedExam.id.toString(), connectionId);

        if(blobResponse == null){
            return;
        }

        examViewService.createDownloadLink(examStore.selectedExam.quizName, blobResponse);
    }

    //===============monitor & archive exam logic====================
    function openArchiveDialog(){
        archiveDialog.value = true;
    }

    function closeArchiveDialog(){
        archiveDialog.value = false;
    }

    async function archiveExam(){
        closeArchiveDialog();

        if(examStore.selectedExam == null){
            return;
        }

        const archiveExamResponse: Exam | null = await examViewService.archiveExam(examStore.selectedExam.id.toString());

        if(archiveExamResponse == null){
            return;
        }

        updateExam();
    }

    //===============screen proctoring logic====================
    function setScreenProctoring(){
        if(examStore.selectedExam == null){
            return;
        } 

        if(examStore.selectedExam.additionalAttributes.enableScreenProctoring == "true"){
            isScreenProctoringActive.value = true;
        }
    }

    async function applyScreenProctoring(){
        if(isScreenProctoringActive.value){
            changeScreenProctoringSettings(true);
            return;
        }

        changeScreenProctoringSettings(false);
    }

    async function changeScreenProctoringSettings(enable: boolean){  
        if(examStore.selectedExam == null){
            return;
        }

        const saveScreenProcResponse: Exam | null = await examViewService.activateScreenProctoring(
            examStore.selectedExam.id.toString(), 
            enable
        );

        if(saveScreenProcResponse == null){
            isScreenProctoringActive.value = !enable;
            return;
        }

        examStore.selectedExam = saveScreenProcResponse;
    }


    //===============delete exam logic====================
    function openDeleteDialog(){
        deleteDialog.value = true;
    }

    function closeDeleteDialog(){
        deleteDialog.value = false;
    }

    async function deleteExam(){
        const deleteExamResponse: any | null = await examViewService.deleteExam(examId);

        if(deleteExamResponse == null){
            return;
        }

        navigateTo(constants.EXAM_ROUTE);
    }


    //===============exam template logic====================
    async function getExamTemplate(){
        if(examStore.selectedExam?.examTemplateId == null){
            return;
        }

        const examTemplateResponse: ExamTemplate | null = await examViewService.getExamTemplate(examStore.selectedExam?.examTemplateId.toString());

        if(examTemplateResponse == null){
            return;
        }

        examStore.selectedExamTemplate = examTemplateResponse;
    }


    function openExamTemplateDialog(){
        examTemplateDialog.value = true;
    }

    function closeExamTemplateDialog(){
        examTemplateDialog.value = false;
    }


    //===============test run logic====================
    //calling this function again after test run has been applied disables the test run
    async function applyTestRun(){
        const applyTestRunResponse: Exam | null = await examViewService.applyTestRun(examId);

        if(applyTestRunResponse == null){
            return;
        }

        updateExam();
    }


    //===============settings logic====================
    async function getSEBSettings() {
        const configs: ExamConfigMapping[] | null = await examViewService.getExamConfigMapping(examId);
        if (configs == null) {
            hasSEBSettings.value = false;
        } else {
            hasSEBSettings.value = configs.length > 0;
        }
        editableSEBSettings.value = !examViewService.isExamFunctionalityDisabled([ExamStatusEnum.UP_COMING, ExamStatusEnum.RUNNING, ExamStatusEnum.TEST_RUN], examStore.selectedExam?.status);
    }

    function openSebSettingsDialog(){
        sebSettingsDialog.value = true;
    }

    function closeSebSettingsDialog(){
        sebSettingsDialog.value = false;
    }


    //===============groups logic====================
    function openClientGroupDialog(){
        clientGroupDialog.value = true;
    }

    function closeClientGroupDialog(isChange?: boolean){
        clientGroupDialog.value = false;

        if(isChange){
            getClientGroups();
        }
    }

    async function getClientGroups(){
        if(examStore.selectedExam == null){
            return;
        }

        const clientGroupResponse: ClientGroups | null = await clientGroupViewService.getClientGroups(examId);

        if(clientGroupResponse == null){
            return;
        }

        examStore.selectedClientGroups = clientGroupResponse.content;
    }


    //===============add groups logic====================
    function openAddClientGroupDialog(){
        addclientGroupDialog.value = true;
    }

    function closeAddClientGroupDialog(isChange?: boolean){
        addclientGroupDialog.value = false;

        if(isChange){
            getClientGroups();
        }
    }

</script>

<style scoped>

</style>