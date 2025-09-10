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
        <v-row class="mt-6" dense>
            <v-col cols="12" md="6">
                <div class="text-subtitle-1 font-weight-medium mb-2">
                    {{
                        translate("quizImportWizard.passwordMain.quitPassword")
                    }}
                </div>
            </v-col>
        </v-row>

        <v-row dense>
            <v-col cols="6">
                <v-text-field
                    v-model="quizImportStore.selectedQuitPassword"
                    density="comfortable"
                    :placeholder="
                        translate('quizImportWizard.passwordMain.password')
                    "
                    prepend-inner-icon="mdi-lock-outline"
                    :type="passwordVisible ? 'text' : 'password'"
                    variant="outlined"
                >
                    <template #append-inner>
                        <v-btn
                            density="compact"
                            icon
                            variant="text"
                            @click="passwordVisible = !passwordVisible"
                        >
                            <v-icon>{{
                                passwordVisible ? "mdi-eye-off" : "mdi-eye"
                            }}</v-icon>
                        </v-btn>
                    </template>
                </v-text-field>

                <!-- Imported Info Text -->
                <div
                    v-if="showImportedHint"
                    class="text-caption text-grey mt-1"
                >
                    Password imported from selected Exam Template
                </div>

                <!-- Warning Box -->
                <v-alert
                    border="start"
                    class="mt-4"
                    density="comfortable"
                    type="warning"
                    variant="outlined"
                >
                    <template #prepend>
                        <v-icon>mdi-alert</v-icon>
                    </template>
                    {{ translate("quizImportWizard.passwordMain.warning") }}
                </v-alert>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { useQuizImportStore } from "@/stores/seb-server/quizImportStore";
import { storeToRefs } from "pinia";
import { translate } from "@/utils/generalUtils";
import { computed, ref } from "vue";

// stores
const quizImportStore = useQuizImportStore();
const { templateQuitPassword, selectedQuitPassword } =
    storeToRefs(quizImportStore);

// pw visibility toggle
const passwordVisible = ref(false);

// show a hint in case password is imported from template
const showImportedHint = computed(
    () =>
        !!templateQuitPassword.value &&
        selectedQuitPassword.value === templateQuitPassword.value,
);
</script>

<style scoped></style>
