<template>
    <v-row>
        <v-col>
            <v-sheet class="pa-4">

                <div>
                    Exam Detail
                </div>
            
            
            
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import { useAppBarStore } from '@/stores/store';
    import * as constants from "@/utils/constants";
    import * as examViewService from "@/services/component-services/examViewService";


    //stores
    const appBarStore = useAppBarStore();

    //exam
    const examId = useRoute().params.examId.toString();


    onBeforeMount(async () => {
        appBarStore.title = constants.EXAMS_DETAIL_TITLE;


        console.log(await examViewService.getExam(examId));

    });


</script>

<style scoped>

</style>