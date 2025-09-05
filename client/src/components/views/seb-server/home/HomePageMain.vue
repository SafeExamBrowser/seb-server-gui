<template>
    <v-row data-testid="homePageMain-page-container">
        <!-- First Column -->
        <v-col
            cols="3"
            class="d-flex flex-column align-center"
            style="min-height: 92vh; gap: 2rem;"
            data-testid="homePageMain-leftCol-container"
        >
            <!-- Create Templates -->
            <v-sheet
                elevation="4"
                class="rounded-sm pa-4 d-flex flex-column justify-space-between"
                style="width: 100%; max-width: 95%; height: 30%;"
                data-testid="homePageMain-createTemplates-card"
            >
                <div
                    class="primary-text-color text-h5 font-weight-black mb-16"
                    data-testid="homePageMain-createTemplates-title-text"
                >
                    {{ translate('homePage.createTemplates') }}
                </div>
                <div class="d-flex justify-end mt-auto">
                    <v-btn
                        rounded="sm"
                        color="primary"
                        variant="flat"
                        :to="constants.CREATE_TEMPLATE_ROUTE"
                        class="bigger-btn"
                        data-testid="homePageMain-createTemplates-startNow-button"
                    >
                        {{ translate('homePage.startNow') }}
                    </v-btn>
                </div>
            </v-sheet>

            <!-- Prepare Exam -->
            <v-sheet
                elevation="4"
                class="rounded-sm pa-4 d-flex flex-column justify-space-between"
                style="width: 100%; max-width: 95%; height: 30%;"
                data-testid="homePageMain-prepareExam-card"
            >
                <div
                    class="primary-text-color text-h5 font-weight-black mb-16"
                    data-testid="homePageMain-prepareExam-title-text"
                >
                    {{ translate('homePage.prepareExam') }}
                </div>
                <div class="d-flex justify-end mt-auto">
                    <v-btn
                        rounded="sm"
                        color="primary"
                        variant="flat"
                        :to="constants.QUIZ_IMPORT_ROUTE"
                        class="bigger-btn"
                        data-testid="homePageMain-prepareExam-startNow-button"
                    >
                        {{ translate('homePage.startNow') }}
                    </v-btn>
                </div>
            </v-sheet>

            <!-- Monitor Exams -->
            <v-sheet
                elevation="4"
                class="rounded-sm pa-4 d-flex flex-column justify-space-between"
                style="width: 100%; max-width: 95%; height: 30%;"
                data-testid="homePageMain-monitorExams-card"
            >
                <div
                    class="primary-text-color text-h5 font-weight-black mb-16"
                    data-testid="homePageMain-monitorExams-title-text"
                >
                    {{ translate('homePage.monitorExams') }}
                </div>
                <div class="d-flex justify-end mt-auto">
                    <v-btn
                        rounded="sm"
                        color="primary"
                        variant="flat"
                        :to="constants.MONITORING_ROUTE"
                        class="bigger-btn"
                        data-testid="homePageMain-monitorExams-startNow-button"
                    >
                        {{ translate('homePage.startNow') }}
                    </v-btn>
                </div>
            </v-sheet>
        </v-col>

        <!-- Right Column -->
        <v-col cols="9" data-testid="homePageMain-rightCol-container">
            <v-sheet data-testid="homePageMain-rightCol-sheet">
            </v-sheet>
        </v-col>
    </v-row>
</template>


<script setup lang="ts">
import * as constants from "@/utils/constants";
import {translate} from "@/utils/generalUtils";
</script>



<style scoped>

.bigger-btn {
    font-size: 0.90rem;
    min-height: 40px;
    padding: 0.5rem 1.25rem;
}

</style>
