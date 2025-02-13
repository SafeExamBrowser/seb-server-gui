<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-8">


                <!----------title--------->
                <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="10">
                        <div class="primary-text-color text-h4 font-weight-bold">
                            Configuration Summary
                        </div>
                        <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                    </v-col>
                    <v-spacer></v-spacer>
                </v-row>
                <!----------------------->

                <!----------infos and actions--------->
                <v-row>
                    <v-spacer></v-spacer>

                    <!----------left side--------->
                    <v-col cols="5" class="pr-16">

                        <!----------test run--------->
                        <v-row class="mt-6">
                            <v-col cols="8">
                                <v-sheet 
                                    elevation="4"
                                    class="rounded-lg pa-4">

                                    <v-row>
                                        <v-col>
                                            Test Exam
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col align="right">
                                            <v-btn 
                                                rounded="sm" 
                                                color="error" 
                                                variant="flat" 
                                                class="mt-8">
                                                Apply Test Run
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                </v-sheet>
                            </v-col>
                        </v-row>
                        <!----------------------->

                        <!----------template--------->
                        <v-row class="mt-10">
                            <v-col>
                                <template v-if="examStore.selectedExamTemplate != null">
                                    <div class="primary-text-color text-h5">
                                        {{ examStore.selectedExamTemplate?.name }}
                                    </div>
                                    <v-divider class="border-opacity-25" :thickness="2"></v-divider>

                                    <div v-if="examStore.selectedExamTemplate.description != null && examStore.selectedExamTemplate.description != ''" class="mt-4">
                                    {{ examStore.selectedExamTemplate.description }}
                                    </div>
                                    <div v-else class="mt-4">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tortor mi, tincidunt nec nibh placerat, aliquet luctus nulla. Vestibulum aliquam aliquet augue, eget laoreet purus ultrices sit amet. Donec fermentum congue elit, et egestas enim volutpat a. Vivamus finibus ante non mauris consectetur, lacinia accumsan ante ullamcorper. Ut ultricies augue tortor, ut dignissim ante interdum at. Pellentesque quis mi faucibus, tristique libero vel, auctor nunc. Fusce nec sapien consequat, finibus dui non, fermentum dolor.
                                    </div>
                                </template>

                                <template v-else>
                                    No exam template
                                    <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                                </template>
                            </v-col>
                        </v-row>
                        <!----------------------->

                        <!-------supervisors------>
                        <v-row class="mt-10">
                            <v-col>
                                <div class="primary-text-color text-h5">
                                    Examination Supervisors
                                </div>
                                <v-divider class="border-opacity-25" :thickness="2"></v-divider>
                            </v-col>
                        </v-row>
                        <v-row class="mb-10">
                            <v-col>
                                <v-list>
                                    <template 
                                        v-for="supervisor in supervisors"
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
                                    v-model="passwordValue"
                                    readonly>

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

                    <!----------right side--------->
                    <v-col cols="5" class="pl-16">

                        <!----------edit seb settings--------->
                        <v-row class="mt-6">
                            <v-col cols="10">
                                <v-sheet 
                                    elevation="4"
                                    class="rounded-lg pa-4">

                                    <v-row align="center">
                                        <v-col>
                                            Edit SEB Settings
                                        </v-col>
                                        <v-col align="right">
                                            <v-btn 
                                                rounded="sm" 
                                                color="primary" 
                                                variant="flat" 
                                                class="">
                                                Start now
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                </v-sheet>
                            </v-col>
                        </v-row>
                        <!----------------------->

                        <!----------exam config--------->
                        <v-row class="mt-6">
                            <v-col cols="10">
                                <v-sheet 
                                    elevation="4"
                                    class="rounded-lg pa-4">

                                    <v-row align="center">
                                        <v-col>
                                            Export Exam Connection Configuration
                                        </v-col>
                                        <v-col align="right">
                                            <v-btn 
                                                rounded="sm" 
                                                color="primary" 
                                                variant="flat" 
                                                class="">
                                                Export
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                </v-sheet>
                            </v-col>
                        </v-row>
                        <!----------------------->

                        <!----------monitor exam--------->
                        <v-row class="mt-6">
                            <v-col cols="10">
                                <v-card 
                                    color="primary"
                                    variant="outlined"
                                    class="rounded-lg pa-4">

                                    <v-row align="center">
                                        <v-col>
                                            Export Exam Connection Configuration
                                        </v-col>
                                        <v-col align="right">
                                            <v-btn 
                                                rounded="sm" 
                                                color="primary" 
                                                variant="flat" 
                                                class="">
                                                Start
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                </v-card>
                            </v-col>
                        </v-row>
                        <!----------------------->

                        <!----------archive exam--------->
                        <v-row class="mt-6">
                            <v-col cols="10">
                                <v-card 
                                    color="primary"
                                    variant="outlined"
                                    class="rounded-lg pa-4">

                                    <v-row align="center">
                                        <v-col>
                                            Archive Exam
                                        </v-col>
                                        <v-col align="right">
                                            <v-btn 
                                                rounded="sm" 
                                                color="primary" 
                                                variant="flat" 
                                                class="">
                                                Start
                                            </v-btn>
                                        </v-col>
                                    </v-row>

                                </v-card>
                            </v-col>
                        </v-row>
                        <!----------------------->

                        <!----------more configs--------->
                        <v-row class="mt-6">
                            <v-col cols="10">
                                <v-card 
                                    color="primary"
                                    variant="outlined"
                                    class="rounded-lg pa-4">

                                    <v-row align="center">
                                        <v-col>
                                            <div>
                                                More Exam Configurations
                                            </div>

                                            <v-list class="mt-4" select-strategy="leaf">
                                                <template 
                                                    v-for="(examConfigOption, index) in examConfigOptions"
                                                    :key="examConfigOption.name"
                                                    :value="examConfigOption.name">
                                                
                                                    <v-list-item>
                                                        <v-list-item-title>{{ examConfigOption.name }}</v-list-item-title>

                                                        <template v-slot:append="{ isSelected }" >
                                                            <v-list-item-action class="flex-column align-right">
                                                                <v-icon 
                                                                    v-if="examConfigOption.actionType == 'link'"
                                                                    icon="mdi-chevron-right"
                                                                    style="font-size: 30px;"
                                                                    @click="">
                                                                </v-icon>
                                                                 
                                                                <v-switch 
                                                                    v-if="examConfigOption.actionType == 'switch'"
                                                                    hide-details
                                                                    color="primary">
                                                                </v-switch>

                                                                <v-icon 
                                                                    v-if="examConfigOption.actionType == 'delete-button'"
                                                                    icon="mdi-trash-can-outline"
                                                                    style="font-size: 30px;"
                                                                    @click="">
                                                                </v-icon>

                                                            </v-list-item-action>
                                                        </template>
                                                    </v-list-item>

                                                    <v-divider v-if="index != examConfigOptions.length-1" class="border-opacity-25" :thickness="2"></v-divider>

                                                </template>
                                            </v-list>





                                        </v-col>
                                    </v-row>

                                </v-card>
                            </v-col>
                        </v-row>
                        <!----------------------->
                        
                    
                    </v-col>
                    <!----------------------->

                    <v-spacer></v-spacer>

                </v-row>
                <!----------------------->
            
            
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import { useExamStore } from '@/stores/examStore';
    import * as constants from "@/utils/constants";
    import * as examViewService from "@/services/component-services/examViewService";
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";

    //stores
    const examStore = useExamStore();

    //exam
    const examId = useRoute().params.examId.toString();

    //supervisors
    const supervisors = ref<UserAccount[]>([]);

    //pw field
    const passwordVisible = ref<boolean>(false);
    const passwordValue = ref<string>("");

    //more exam configurations
    const examConfigOptions: {name: string, actionType: string, link: string}[] = [
        {
            name: "App Signature Key",
            actionType: "link",
            link: ""
        },
        {
            name: "SEB Restriction Details",
            actionType: "link",
            link: ""
        },
        {
            name: "Edit Screen Proctoring",
            actionType: "link",
            link: ""
        },
        {
            name: "Release SEB Lock",
            actionType: "switch",
            link: ""
        },
        {
            name: "Delete Exam",
            actionType: "delete-button",
            link: ""
        }
    ];


    onBeforeMount(async () => {
        await getExam();
        await getExamTemplate();
        await getExamSupervisors();
        setPasswordValue();
    });

    async function getExam(){
        const examResponse: Exam | null = await examViewService.getExam(examId);

        if(examResponse == null){
            //todo: add error handling
            return;
        }

        examStore.selectedExam = examResponse;
    }


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

            supervisors.value.push(userAccount);
        }
    }

    function setPasswordValue(){
        if(examStore.selectedExam?.quitPassword == null || examStore.selectedExam?.quitPassword == ""){
            return;
        }

        passwordValue.value = examStore.selectedExam?.quitPassword;
    }


</script>

<style scoped>

</style>