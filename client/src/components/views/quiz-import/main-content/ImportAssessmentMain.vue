<template>
    <v-row>
        <v-spacer></v-spacer>
        <v-col cols="4">
            <v-select
                hide-details
                :placeholder="translate('quizImportWizard.assessmentTool.title')"
                density="compact"
                variant="outlined"  
                v-model="quizImportStore.selectedAssessmentTool"
                :items="quizImportStore.availableAssessmentTools?.content"
                item-value="id"
                item-title="name">
            </v-select>
        </v-col>
        <v-spacer></v-spacer>
    </v-row>

</template>

<script setup lang="ts">
    import { useQuizImportStore } from "@/stores/quizImportStore";
    import {translate} from "@/utils/generalUtils";

    //stores
    const quizImportStore = useQuizImportStore();

</script>

<style scoped>
</style>