<template>
    <v-row>
        <v-spacer></v-spacer>
        <v-col cols="4">
            <v-select
                hide-details
                density="compact"
                variant="outlined"  
                v-model="quizImportStore.selectedAssessmentTool"
                :items="quizImportStore.availableAssessmentTools?.content"
                item-title="name">
            </v-select>
        </v-col>
        <v-spacer></v-spacer>
    </v-row>

</template>

<script setup lang="ts">
    import { useQuizImportStore } from "@/stores/quizImportStore";

    //stores
    const quizImportStore = useQuizImportStore();

</script>

<style scoped>
</style>