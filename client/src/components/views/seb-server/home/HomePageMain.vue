<template>
    <v-row>
        <!-- First Column -->
        <v-col
            cols="3"
            class="d-flex flex-column align-center"
            style="min-height: 92vh; gap: 2rem;"
        >
            <v-sheet
                elevation="4"
                class="rounded-sm pa-4 d-flex flex-column justify-space-between"
                style="width: 100%; max-width: 95%; height: 30%;"
            >

                <div class="primary-text-color text-h5 font-weight-black mb-16">
                    {{ translate('homePage.createTemplates') }}
                </div>
                <div class="d-flex justify-end mt-auto">
                    <v-btn
                        rounded="sm"
                        color="primary"
                        variant="flat"
                        class="bigger-btn"
                    >
                        {{ translate('homePage.startNow') }}
                    </v-btn>
                </div>
            </v-sheet>

            <v-sheet
                elevation="4"
                class="rounded-sm pa-4 d-flex flex-column justify-space-between"
                style="width: 100%; max-width: 95%; height: 30%;"
            >

                <div class="primary-text-color text-h5 font-weight-black mb-16">
                    {{ translate('homePage.prepareExam') }}
                </div>
                <div class="d-flex justify-end mt-auto">
                    <v-btn
                        rounded="sm"
                        color="primary"
                        variant="flat"
                        :to="constants.QUIZ_IMPORT_ROUTE"
                        class="bigger-btn"
                    >
                        {{ translate('homePage.startNow') }}
                    </v-btn>
                </div>
            </v-sheet>

            <v-sheet
                elevation="4"
                class="rounded-sm pa-4 d-flex flex-column justify-space-between"
                style="width: 100%; max-width: 95%; height: 30%;"
            >

                <div class="primary-text-color text-h5 font-weight-black mb-16">
                    {{ translate('homePage.monitorExams') }}
                </div>
                <div class="d-flex justify-end mt-auto">
                    <v-btn
                        rounded="sm"
                        color="primary"
                        variant="flat"
                        :to="constants.MONITORING_ROUTE"
                        class="bigger-btn"
                    >
                        {{ translate('homePage.startNow') }}
                    </v-btn>
                </div>
            </v-sheet>

        </v-col>

        <!-- Right Column -->
        <v-col cols="9">
            <v-sheet>
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
