<template>
    <div class="h-100 w-100">
        <!-- Title and Description -->
        <v-row dense>
            <v-col>
                <div class="text-h6 font-weight-bold mb-1">
                    {{ translate("quizImportWizard.summaryMain.title") }}
                </div>
                <div class="mb-3 text-body-2">
                    {{ translate("quizImportWizard.summaryMain.description") }}
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12">
                <!-- Template -->
                <v-row>
                    <v-col>
                        <div class="text-subtitle-1 font-weight-medium mb-2">
                            {{ translate("quizImportWizard.summaryMain.examTemplate") }}
                        </div>
                    </v-col>
                </v-row>
                <div class="summary-box mb-10">
                    <div class="summary-row">
                        <v-row>
                            <v-col cols="4">
                                <span class="summary-label">{{ translate("quizImportWizard.summaryMain.templateName") }}</span>
                            </v-col>
                            <v-col>
                                <span>{{ quizImportStore.selectedExamTemplate?.name }}</span>
                            </v-col>
                        </v-row>
                    </div>
                </div>

                <!-- Client Groups -->
                <v-row v-if="quizImportStore.selectedClientGroups.length">
                    <v-col>
                        <div class="text-subtitle-1 font-weight-medium mb-2">
                            {{ translate("quizImportWizard.summaryMain.clientGroups") }}
                        </div>
                    </v-col>
                </v-row>
                <div v-if="quizImportStore.selectedClientGroups.length" class="summary-box mb-10">
                    <div
                        v-for="clientGroup in quizImportStore.selectedClientGroups"
                        :key="clientGroup.id"
                        class="summary-row"
                    >
                        <v-row>
                            <v-col cols="4">
                                <span class="summary-label">Client Group:</span>
                            </v-col>
                            <v-col>
                                <span>{{ clientGroup.name }}</span>
                            </v-col>
                        </v-row>
                    </div>
                </div>

                <!-- Supervisors -->
                <v-row>
                    <v-col>
                        <div class="text-subtitle-1 font-weight-medium mb-2">
                            {{ translate("quizImportWizard.summaryMain.supervisors") }}
                        </div>
                    </v-col>
                </v-row>
                <div class="summary-box mb-10">
                    <div
                        v-for="supervisor in quizImportStore.selectedExamSupervisors"
                        :key="supervisor.modelId"
                        class="summary-row"
                    >
                        <span>{{ supervisor.name }}</span>
                    </div>
                </div>

                <!-- Quit Password -->
                <v-row>
                    <v-col>
                        <div class="text-subtitle-1 font-weight-medium mb-2">
                            {{ translate("quizImportWizard.summaryMain.password") }}
                        </div>
                    </v-col>
                </v-row>
                <div class="summary-box">
                    <div class="summary-row">
                        <v-row class="align-center">
                            <v-col cols="4">
                                <span class="summary-label">Quit Password:</span>
                            </v-col>
                            <v-col class="d-flex align-center">
                                <span>{{ passwordVisible ? quizImportStore.selectedQuitPassword : maskedPassword }}</span>
                                <v-btn
                                    size="small"
                                    icon
                                    variant="text"
                                    @click="passwordVisible = !passwordVisible"
                                >
                                    <v-icon>
                                        {{ passwordVisible ? 'mdi-eye-off' : 'mdi-eye' }}
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>



<script setup lang="ts">
import * as quizImportWizardViewService from "@/services/seb-server/component-services/quizImportWizardViewService";
import {useQuizImportStore} from "@/stores/seb-server/quizImportStore";
import {useExamStore} from '@/stores/seb-server/examStore';
import {navigateTo} from "@/router/navigation";
import * as constants from "@/utils/constants";
import {translate} from "@/utils/generalUtils";
import * as generalUtils from "@/utils/generalUtils";


//stores
const quizImportStore = useQuizImportStore();

//pw field
const passwordVisible = ref<boolean>(false);

const maskedPassword = computed(() =>
    quizImportStore.selectedQuitPassword?.replace(/./g, "•") || ""
);

</script>

<style scoped>
.summary-box {
    background-color: #f9fafb;
    border-radius: 8px;
    padding: 16px;
}

.summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #1f2937;
    margin-bottom: 8px;
}

.summary-label {
    font-weight: 600;
    margin-right: 8px;
}

.v-btn {
    margin-left: 12px;
}
</style>


<style scoped>

</style>
