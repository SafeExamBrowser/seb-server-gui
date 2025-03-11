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
                            Exam Details
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
                                            Test Exam
                                        </v-col>
                                        <v-col align="right" cols="4" xl="3">
                                            <v-btn 
                                                block
                                                rounded="sm" 
                                                color="primary" 
                                                variant="flat">
                                                Apply Test Run
                                            </v-btn>
                                        </v-col>
                                    </v-row>

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
                                            Monitor Exam
                                        </v-col>
                                        <v-col align="right" cols="4" xl="3">
                                            <v-btn 
                                                block
                                                rounded="sm" 
                                                color="primary" 
                                                variant="flat" 
                                                :disabled="isFunctionalityDisabled(ExamStatusEnum.RUNNING)">
                                                Start
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                    <v-tooltip activator="parent">
                                        Monitoring is only activated when exam is running
                                    </v-tooltip>

                                </v-card>
                            </v-col>
                        </v-row>

                        <!----------template--------->
                        <v-row class="mt-10">
                            <v-col class="primary-text-color text-h6"> 
                                Exam Template
                            </v-col>
                            <v-col align="right">
                                <v-btn
                                    color="primary"
                                    density="compact"
                                    variant="text"
                                    icon="mdi-information-outline"
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
                                Examination Supervisors
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

                        <v-row class="mb-10">
                            <v-col>
                                <v-list>
                                    <template 
                                        v-for="supervisor in examStore.selectedExamSupervisors"
                                        :key="supervisor.id"
                                        :value="supervisor.id">
                                    
                                        <v-list-item>
                                            <v-list-item-title>{{ supervisor.username }} ( {{supervisor.surname}} {{ supervisor.name }} )</v-list-item-title>
                                        </v-list-item>

                                        <v-divider class="border-opacity-25" :thickness="2"></v-divider>

                                    </template>
                                </v-list>
                            </v-col>
                        </v-row>
                        <!------------------->

                        <!--------quit password------>
                        <v-row class="mt-10">
                            <v-col>
                                <div class="primary-text-color text-h5">
                                    Quit Password
                                </div>
                                <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                            </v-col>
                        </v-row>
                        <v-row class="">
                            <v-col>
                                <v-text-field
                                    :type="passwordVisible ? 'text' : 'password'"
                                    prepend-inner-icon="mdi-lock-outline"
                                    density="compact"
                                    placeholder="Password"
                                    variant="outlined"
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

                        <!----------add groups--------->
                        <v-row>
                            <v-col>
                                <v-sheet 
                                    elevation="4"
                                    class="rounded-lg pa-4">

                                    <v-row align="center">
                                        <v-col>
                                            Add Groups
                                        </v-col>
                                        <v-col align="right" cols="4" xl="3">
                                            <v-btn 
                                                block
                                                rounded="sm" 
                                                color="primary" 
                                                variant="flat">
                                                Add
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                </v-sheet>
                            </v-col>
                        </v-row>

                        <!----------edit seb settings--------->
                        <v-row>
                            <v-col>
                                <v-sheet 
                                    elevation="4"
                                    class="rounded-lg pa-4">

                                    <v-row align="center">
                                        <v-col>
                                            Edit Application and Network Settings
                                        </v-col>
                                        <v-col align="right" cols="4" xl="3">
                                            <v-btn 
                                                block
                                                rounded="sm" 
                                                color="primary" 
                                                variant="flat">
                                                Start
                                            </v-btn>
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
                                            Download Exam Connection Configuration
                                        </v-col>
                                        <v-col align="right" cols="4" xl="3">
                                            <v-btn 
                                                block
                                                rounded="sm" 
                                                color="primary" 
                                                variant="flat" 
                                                @click="startExamConfigDownloadProcess()">
                                                Download
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
                                                More Exam Options
                                            </div>

                                            <v-list class="mt-4" select-strategy="leaf">

                                                <!----------Apply Screen Proctoring--------->
                                                <v-list-item>
                                                    <v-list-item-title>Apply Screen Proctoring</v-list-item-title>
                                                    <template v-slot:append="{ isSelected }" >
                                                        <v-list-item-action class="flex-column align-right">
                                                            <v-switch 
                                                                v-model="isScreenProctoringActive"
                                                                v-on:update:model-value="applyScreenProctoring()"
                                                                hide-details
                                                                color="primary">
                                                            </v-switch>
                                                        </v-list-item-action>
                                                    </template>
                                                </v-list-item>
                                                <v-divider class="border-opacity-25" :thickness="2"></v-divider>

                                                <!----------Apply SEB Lock--------->
                                                <v-list-item>
                                                    <v-list-item-title>Apply SEB Lock</v-list-item-title>
                                                    <template v-slot:append="{ isSelected }" >
                                                        <v-list-item-action class="flex-column align-right">
                                                            <v-switch 
                                                                hide-details
                                                                color="primary">
                                                            </v-switch>
                                                        </v-list-item-action>
                                                    </template>
                                                </v-list-item>
                                                <v-divider class="border-opacity-25" :thickness="2"></v-divider>

                                                <!----------SEB Keys--------->
                                                <v-list-item>
                                                    <v-list-item-title>SEB Keys</v-list-item-title>
                                                    <template v-slot:append="{ isSelected }" >
                                                        <v-list-item-action class="flex-column align-right">
                                                            <v-icon 
                                                                icon="mdi-key-outline"
                                                                style="font-size: 30px;"
                                                                @click="">
                                                            </v-icon>
                                                        </v-list-item-action>
                                                    </template>
                                                </v-list-item>
                                                <v-divider class="border-opacity-25" :thickness="2"></v-divider>

                                                <!----------Archive Exam--------->
                                                <v-list-item>
                                                    <v-list-item-title :class="[isFunctionalityDisabled(ExamStatusEnum.FINISHED) ? 'disabled-text-color' : '']">Archive Exam</v-list-item-title>
                                                    <template v-slot:append="{ isSelected }" >
                                                        <v-list-item-action class="flex-column align-right">
                                                            <v-icon 
                                                                icon="mdi-archive-outline"
                                                                style="font-size: 30px;"
                                                                :disabled="isFunctionalityDisabled(ExamStatusEnum.FINISHED)"
                                                                @click="openArchiveDialog()">
                                                            </v-icon>
                                                        </v-list-item-action>
                                                    </template>

                                                    <v-tooltip v-if="isFunctionalityDisabled(ExamStatusEnum.FINISHED)" activator="parent">
                                                        Archiving is only activated when exam is finished
                                                    </v-tooltip>

                                                </v-list-item>
                                                <v-divider class="border-opacity-25" :thickness="2"></v-divider>

                                                <!----------Delete Exam--------->
                                                <v-list-item>
                                                    <v-list-item-title>Delete Exam</v-list-item-title>
                                                    <template v-slot:append="{ isSelected }" >
                                                        <v-list-item-action class="flex-column align-right">
                                                            <v-icon 
                                                                icon="mdi-trash-can-outline"
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

    <!-----------supervisor popup---------->      
    <v-dialog v-model="supervisorsDialog" max-width="1200">
        <ExamDetailSupervisorsDialog @closeSupervisorsDialog="closeSupervisorsDialog"></ExamDetailSupervisorsDialog>
    </v-dialog>

    <!-----------connection configuration popup---------->      
    <v-dialog v-model="configDialog" v-if="connectionConfigurationsPar" max-width="800">
        <ExamDetailConfigDialog 
            :connection-configurations="connectionConfigurationsPar" 
            @closeConfigDialog="closeConfigDialog"
            @downloadExamConfig="downloadExamConfig">
        </ExamDetailConfigDialog>
    </v-dialog>

    <!-----------archive popup---------->      
    <v-dialog v-model="archiveDialog" max-width="800">
        <ExamDetailArchiveDialog 
            @close-archive-dialog="closeArchiveDialog"
            @archive-exam="archiveExam">
        </ExamDetailArchiveDialog>
    </v-dialog>

    <!-----------delete exam popup---------->      
    <v-dialog v-model="deleteDialog" max-width="800">
        <ExamDetailDeleteDialog 
            @close-delete-dialog="closeDeleteDialog"
            @delete-exam="deleteExam">
        </ExamDetailDeleteDialog>
    </v-dialog>

    <!-----------exam template popup---------->      
    <v-dialog v-model="examTemplateDialog" max-width="600">
        <ExamTemplateDialog 
            :exam-template="examStore.selectedExamTemplate"
            @close-exam-template-dialog="closeExamTemplateDialog()">
        </ExamTemplateDialog>
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
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import { storeToRefs } from "pinia";
    import * as timeUtils from "@/utils/timeUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import { navigateTo } from '@/router/navigation';
    import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";


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

    //screen proctoring
    const isScreenProctoringActive = ref<boolean>(false);
    

    onBeforeMount(async () => {
        //todo: clear store before reload
        await getExam();
        await getExamTemplate();
        await getExamSupervisors();
        setQuitPassword();
        setScreenProctoring();
        isPageInitalizing.value = false;
    });

    watch(supervisorsDialog, () => {
        if(supervisorsDialog.value == false){
            //update exam if supervisors changed
            closeSupervisorsDialog();
        }
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
            //todo: add error handling
            return;
        }

        examStore.selectedExam = examResponse;
    }

    async function updateExam(){
        alertAvailable.value = false;

        if(examStore.selectedExam == null){
            //todo
            return;
        }

        const updateExamResponse: Exam | null = await examViewService.updateExam(examId, examStore.selectedExam);

        if(updateExamResponse == null){
                alertAvailable.value = true;
                alertColor.value = "error";
                alertKey.value = "exam-update-failed";
            return;
        }

        alertAvailable.value = true;
        alertColor.value = "success";
        alertKey.value = "exam-update-successful";
        examStore.selectedExam = updateExamResponse;
    }
    //=========================================


    //===============supervisors logic====================
    async function getExamSupervisors(){
        if(examStore.selectedExam?.supporter == null || examStore.selectedExam.supporter.length == 0){
            return;
        }

        for(let i = 0; i < examStore.selectedExam.supporter.length; i++){
            const userAccount: UserAccount | null = await userAccountViewService.getUserAccountById(examStore.selectedExam.supporter[i]);

            if(userAccount == null){
                //todo: add error handling
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
        updateExamSupervisors();
    }

    function updateExamSupervisors(){
        if(examStore.selectedExam == null){
            //todo
            return;
        }

        if(didSupervisorsChange()){
            examStore.selectedExam.supporter = examStore.selectedExamSupervisors.map(supporter => supporter.uuid);
            updateExam();
        }
    }

    function fillAlreadySelectedSupervisors(){
        initialSupervisorsIds = [];
        for(let i = 0; i < examStore.selectedExamSupervisors.length; i++){
            initialSupervisorsIds.push(examStore.selectedExamSupervisors[i].uuid);
        }
    }

    function didSupervisorsChange(): boolean{
        if(initialSupervisorsIds.length != examStore.selectedExamSupervisors.length){
            return true;
        }

        const uuidsFromStoreArray = new Set(examStore.selectedExamSupervisors.map(userAccount => userAccount.uuid));
        return !initialSupervisorsIds.every(uuid => uuidsFromStoreArray.has(uuid));
    }
    //=========================================


    //===============password logic====================
    function setQuitPassword(){
        if(examStore.selectedExam?.quitPassword == null || examStore.selectedExam?.quitPassword == ""){
            return;
        }

        quitPassword.value = examStore.selectedExam?.quitPassword;
        initalPassword = examStore.selectedExam?.quitPassword;
    }

    async function updateQuitPassword(){
        console.log("updateQuitPassword called")

        if(examStore.selectedExam == null || initalPassword == quitPassword.value){
            return;
        }

        console.log("updateQuitPassword called 2")


        examStore.selectedExam.quitPassword = quitPassword.value;
        updateExam();
    }
    //=========================================


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
            //todo
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
            //todo
            return;
        }

        const blobResponse = await examViewService.downloadExamConfig(examStore.selectedExam.id.toString(), connectionId);

        if(blobResponse == null){
            //todo
            return;
        }

        createDownloadLink(blobResponse);
    }

    function createDownloadLink(blob: any){
        // Create a link element
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", getExamConfigFileName());
        document.body.appendChild(link);
        
        // Trigger the download
        link.click();
        
        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    function getExamConfigFileName(): string{
        let examName = examStore.selectedExam?.quizName;
        examName = examName?.replaceAll(" ", "_");

        return `${examName}_${timeUtils.getCurrentDateString()}.seb`;
    }
    //=========================================


    //===============monitor & archive exam logic====================
    function isFunctionalityDisabled(allowedExamStatus: ExamStatusEnum): boolean{
        if(examStore.selectedExam == null){
            return true;
        }

        const examStatus: ExamStatusEnum | null = generalUtils.findEnumValue(ExamStatusEnum, examStore.selectedExam?.status);
        
        //Running = monitor is allowed
        //Fished = archived is allowed
        if(examStatus != allowedExamStatus){
            return true;
        }

        return false;
    }

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
            //todo
            return;
        }

        updateExam();

        console.log("archive exam will be pressed")

    }

    //=========================================


    //===============screen proctoring logic====================
    function setScreenProctoring(){
        if(examStore.selectedExam == null){
            return;
        } 

        console.log(examStore.selectedExam.additionalAttributes.enableScreenProctoring)

        if(examStore.selectedExam.additionalAttributes.enableScreenProctoring == "true"){
            isScreenProctoringActive.value = true;
        }
    }

    async function applyScreenProctoring(){
        if(isScreenProctoringActive.value){
            changeScreenProctoringSettings(true, "activate");
            return;
        }

        changeScreenProctoringSettings(false, "deactivate");
    }

    async function changeScreenProctoringSettings(enable: boolean, type: string){  

        console.log("changeScreenProctoringSettings " + enable + " " + type);

        if(examStore.selectedExam == null){
            return;
        }

        const params: ScreenProctoringSettings = examViewService.createDefaultScreenProctoringSettings(
            enable,
            examStore.selectedExam.id, 
            examStore.selectedExam.quizName
        );

        const saveScreenProcResponse: Exam | null = await examViewService.saveScreenProctoringSettings(
            examStore.selectedExam.id.toString(), 
            params
        );

        if(saveScreenProcResponse == null){
            isScreenProctoringActive.value = !enable;

            alertAvailable.value = true;
            alertColor.value = "error";
            alertKey.value = type + "-screen-proctoring-failed";

            return;
        }

        // updateExam();
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
            //todo
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
            //todo: add error handling
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



</script>

<style scoped>

</style>