<template>
    <div class="h-100 w-100">
        <!-- Title and Description -->
        <v-row dense>
            <v-col>
                <div class="text-h6 font-weight-bold mb-1">
                    {{ translate("quizImportWizard.passwordMain.title") }}
                </div>
                <div class="mb-3 text-body-2">
                    {{ translate("quizImportWizard.passwordMain.description") }}
                </div>
            </v-col>
        </v-row>

        <!-- Password Field -->
        <v-row dense class="mt-6">
            <v-col cols="12" md="6">
                <div class="text-subtitle-1 font-weight-medium mb-2">
                    {{ translate("quizImportWizard.passwordMain.quitPassword") }}
                </div>
            </v-col>
        </v-row>

        <v-row dense>
            <v-col cols="6">
                <v-text-field
                    v-model="quizImportStore.selectedQuitPassword"
                    :type="passwordVisible ? 'text' : 'password'"
                    prepend-inner-icon="mdi-lock-outline"
                    :placeholder="translate('quizImportWizard.passwordMain.password')"
                    variant="outlined"
                    density="comfortable"
                >
                    <template v-slot:append-inner>
                        <v-btn
                            icon
                            variant="text"
                            density="compact"
                            @click="passwordVisible = !passwordVisible"
                        >
                            <v-icon>{{ passwordVisible ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                        </v-btn>
                    </template>
                </v-text-field>

                <!-- Warning Box -->
                <v-alert
                    type="warning"
                    variant="outlined"
                    density="comfortable"
                    border="start"
                >
                    <template v-slot:prepend>
                        <v-icon>mdi-alert</v-icon>
                    </template>
                    {{ translate("quizImportWizard.passwordMain.warning") }}
                </v-alert>
            </v-col>
        </v-row>
    </div>
</template>



<script setup lang="ts">
    import { useQuizImportStore } from '@/stores/seb-server/quizImportStore';
    import {storeToRefs} from "pinia";
    import {translate} from "@/utils/generalUtils";


    //stores
    const quizImportStore = useQuizImportStore();
    const quizImportStoreRef = storeToRefs(quizImportStore);


    //pw field
    const passwordVisible = ref<boolean>(false);


    watch(quizImportStoreRef.selectedQuiz, () => {

    });

    function setQuitPwFromMoodle(){
        // if(quizImportStore.selectedQuiz?.additionalAttributes.q)
    }

</script>

<style scoped>


</style>
