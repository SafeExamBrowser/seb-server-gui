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
                        <v-divider></v-divider>
                    </v-col>
                    <v-spacer></v-spacer>
                </v-row>
                <!----------------------->

                <!----------infos and actions--------->
                <v-row>
                    <v-spacer></v-spacer>
                    <v-col cols="5">

                        <!----------test run--------->
                        <v-row class="mt-6">
                            <v-col cols="6">
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
                                    <v-divider></v-divider>

                                    <div v-if="examStore.selectedExamTemplate.description != null && examStore.selectedExamTemplate.description != ''" class="mt-4">
                                    {{ examStore.selectedExamTemplate.description }}
                                    </div>
                                    <div v-else class="mt-4">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tortor mi, tincidunt nec nibh placerat, aliquet luctus nulla. Vestibulum aliquam aliquet augue, eget laoreet purus ultrices sit amet. Donec fermentum congue elit, et egestas enim volutpat a. Vivamus finibus ante non mauris consectetur, lacinia accumsan ante ullamcorper. Ut ultricies augue tortor, ut dignissim ante interdum at. Pellentesque quis mi faucibus, tristique libero vel, auctor nunc. Fusce nec sapien consequat, finibus dui non, fermentum dolor.
                                    </div>
                                    

                                    
                                </template>
                                <template v-else>
                                    No exam template
                                    <v-divider></v-divider>
                                </template>
                            </v-col>
                        </v-row>
                        <!----------------------->

                        <!-- ------supervisors------>
                        <!-- <v-row>
                            <v-col>
                                <div class="primary-text-color text-subtitle-1">
                                    Examination Supervisors
                                </div>
                                <v-divider></v-divider>
                            </v-col>
                        </v-row>
                        <v-row class="mb-10">
                            <v-col>
                                <v-list>
                                    <template 
                                        v-for="supervisors in examStore.selectedExam?.supporter"
                                        :key="supervisors.modelId"
                                        :value="supervisors.modelId">
                                    
                                        <v-list-item>
                                            <v-list-item-title>{{ supervisors.name }}</v-list-item-title>
                                        </v-list-item>

                                        <v-divider></v-divider>

                                    </template>
                                </v-list>
                            </v-col>
                        </v-row> -->
                        <!----------------- -->

                        

                    
                    </v-col>

                    <v-col cols="5">
                    
                    </v-col>
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


    //stores
    const examStore = useExamStore();

    //exam
    const examId = useRoute().params.examId.toString();


    onBeforeMount(async () => {
        await getExam();
        await getExamTemplate();
        // await get
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


</script>

<style scoped>

</style>