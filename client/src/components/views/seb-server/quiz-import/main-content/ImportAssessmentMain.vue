<template>
    <div class="h-100 w-100">

        <v-row dense>
            <v-col>
                <div class="text-h6 font-weight-bold mb-1">
                    {{translate('quizImportWizard.assessmentTool.title')}}
                </div>
                <div class="mb-10 text-body-2">
                    {{ translate("quizImportWizard.assessmentTool.description") }}
                </div>
            </v-col>
        </v-row>

    <v-row>
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
    </div>

</template>

<script setup lang="ts">
    import { useQuizImportStore } from "@/stores/seb-server/quizImportStore";
    import {translate} from "@/utils/generalUtils";

    //stores
    const quizImportStore = useQuizImportStore();

</script>

<style scoped>
</style>
