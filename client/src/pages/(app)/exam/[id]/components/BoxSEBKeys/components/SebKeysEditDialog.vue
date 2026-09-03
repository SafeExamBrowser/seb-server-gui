<template>
    <BoxActionButton
        icon="mdi-pencil"
        :label="$t('examDetail.boxes.sebKeys.edit')"
        :disabled="disabled"
        @click="handleButtonEditClick"
    />

    <v-dialog v-model="dialogOpen" :min-width="680" :max-width="thresholds.sm">
        <v-card>
            <v-card-title>
                {{ $t("examDetail.boxes.sebKeys.edit") }}
            </v-card-title>
            <v-card-text>
                <LoadingFallbackComponent :loading="loading">
                    <FormBuilder v-model="formReady" :fields="formFields" />
                </LoadingFallbackComponent>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn @click="handleButtonCloseClick">
                    {{ $t("general.closeButton") }}
                </v-btn>
                <v-btn
                    color="primary"
                    :disabled="!formReady"
                    @click="handleButtonSaveClick"
                >
                    {{ $t("general.saveButton") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import {
    VBtn,
    VCard,
    VCardActions,
    VCardText,
    VCardTitle,
    VDialog,
    VSpacer,
} from "vuetify/components";

import BoxActionButton from "@/components/widgets/BoxActionButton.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { SEBKeys } from "@/models/seb-server/sebKeys";
import { useSEBKeyFields } from "@/pages/(app)/exam/[id]/components/BoxSEBKeys/composables/useSEBKeyFields";

const props = withDefaults(
    defineProps<{
        examId: number;
        disabled?: boolean;
    }>(),
    {
        disabled: false,
    },
);

const { thresholds: thresholdsRef } = useDisplay();
const thresholds = computed(() => thresholdsRef.value);

const dialogOpen = ref(false);
const formReady = ref(false);

const handleButtonEditClick = () => {
    dialogOpen.value = true;
};

const handleButtonCloseClick = () => {
    dialogOpen.value = false;
};

const emit = defineEmits<{
    (e: "change", value: SEBKeys): void;
}>();

const {
    formFields,
    loading,

    browserExamKeyRef,
    sebServerBEKRef,
    configKeyRef,
} = useSEBKeyFields(String(props.examId));

const handleButtonSaveClick = () => {
    emit("change", {
        id: props.examId,
        browserExamKeys: browserExamKeyRef.value.split("\n"),
        configKeys: configKeyRef.value.split("\n"),
        additionalProperties: {
            ALTERNATIVE_SEB_BEK: sebServerBEKRef.value,
        },
    });
    dialogOpen.value = false;
};
</script>
