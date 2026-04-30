<template>
    <v-container
        class="ma-0 pa-0"
        :max-width="useDisplay().thresholds.value.sm"
    >
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
import { useFormFields } from "./composables/useFormFields.ts";
import { useDisplay } from "vuetify";
import { useStepClientGroupStore } from "@/pages/(app)/exam-template/create/components/stepClientGroup/composables/store/useStepClientGroupStore.ts";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";

const { formFields } = useFormFields();
</script>
