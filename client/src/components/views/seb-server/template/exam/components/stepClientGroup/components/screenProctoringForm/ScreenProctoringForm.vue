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
                <Form
                    v-model="useStepClientGroupStore().isReady"
                    :fields="formFields"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useFormFields } from "./composables/useFormFields";
import { useDisplay } from "vuetify";
import { useStepClientGroupStore } from "@/components/views/seb-server/template/exam/components/stepClientGroup/composables/store/useStepClientGroupStore";

const { formFields } = useFormFields();
</script>
