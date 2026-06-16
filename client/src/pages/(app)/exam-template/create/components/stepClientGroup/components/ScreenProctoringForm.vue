<template>
    <v-container class="ma-0 pa-0" :max-width="thresholds.sm">
        <v-row>
            <v-col>
                <SectionSubtitle
                    :name="
                        $t(
                            'createTemplateExam.steps.clientGroup.subtitleScreenProctoring',
                        )
                    "
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <FormBuilder
                    v-model="
                        useStepClientGroupStore().isScreenProctoringFormReady
                    "
                    :fields="formFields"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useDisplay } from "vuetify";
import { useStepClientGroupStore } from "@/pages/(app)/exam-template/create/components/stepClientGroup/composables/store/useStepClientGroupStore.ts";
import { useScreenProctoringStore } from "@/pages/(app)/exam-template/create/composables/store/useScreenProctoringStore.ts";
import { useScreenProctoringStrategyField } from "@/composables/useScreenProctoringStrategyField.ts";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";

const { thresholds: thresholdsRef } = useDisplay();
const thresholds = computed(() => thresholdsRef.value);

const { collectionStrategy } = storeToRefs(useScreenProctoringStore());
const { field } = useScreenProctoringStrategyField(collectionStrategy);
const formFields = computed(() => [field.value]);
</script>
