<template>
    <v-btn
        class="text-none"
        color="primary"
        variant="text"
        density="compact"
        :title="$t('examTemplateDetail.boxes.basicSettings.dialogTitle')"
        :aria-label="$t('examTemplateDetail.boxes.basicSettings.dialogTitle')"
        @click="handleButtonEditClick"
    >
        <v-icon icon="mdi-pencil" size="x-small" />
    </v-btn>

    <v-dialog v-model="dialogOpen" :max-width="thresholds.sm">
        <v-card>
            <v-card-title>
                {{ $t("examTemplateDetail.boxes.basicSettings.dialogTitle") }}
            </v-card-title>
            <v-card-text>
                <LoadingFallbackComponent :loading="loading" :errors="errors">
                    <FormBuilder v-model="formReady" :fields="formFields" />
                </LoadingFallbackComponent>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn @click="handleButtonCancelClick">
                    {{ $t("general.cancelButton") }}
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
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import {
    ExamTypeEnum,
    toApiExamType,
    toSelectableExamType,
} from "@/models/seb-server/examFiltersEnum.ts";
import { useExamTemplateBasicSettingsFields } from "@/pages/(app)/exam-template/composables/useExamTemplateBasicSettingsFields.ts";
import { BasicSettings } from "@/models/seb-server/examTemplate.ts";

const { basicSettings } = defineProps<{ basicSettings: BasicSettings }>();

const emit = defineEmits<{
    (e: "change", value: BasicSettings): void;
}>();

const { thresholds: thresholdsRef } = useDisplay();
const thresholds = computed(() => thresholdsRef.value);

const dialogOpen = ref(false);
const formReady = ref(false);

const nameTransient = ref<string>();
const descriptionTransient = ref<string>();
const examTypeTransient = ref<ExamTypeEnum>();
const clientConfigurationTransient = ref<string>();
const lmsIntegrationTransient = ref(false);
const institutionalDefaultTransient = ref(false);

// TODO @alain (TanStack Query migration): these name lookups (examTemplateNames + clientConfigurationNames)
// fetch eagerly on page mount even though they're only needed once this dialog is open. Gate the underlying
// queries with `enabled` tied to `dialogOpen` so they only run on open. The wizard consumer keeps them eager.
const { formFields, loading, errors } = useExamTemplateBasicSettingsFields(
    {
        name: nameTransient,
        description: descriptionTransient,
        examType: examTypeTransient,
        clientConfiguration: clientConfigurationTransient,
        lmsIntegration: lmsIntegrationTransient,
        institutionalDefault: institutionalDefaultTransient,
    },
    { nameToExcludeFromBlacklist: computed(() => basicSettings.name) },
);

const handleButtonEditClick = () => {
    nameTransient.value = basicSettings.name;
    descriptionTransient.value = basicSettings.description;
    examTypeTransient.value = toSelectableExamType(basicSettings.examType);
    clientConfigurationTransient.value =
        basicSettings.clientConfigurationId !== undefined
            ? String(basicSettings.clientConfigurationId)
            : undefined;
    lmsIntegrationTransient.value = basicSettings.lmsIntegration;
    institutionalDefaultTransient.value = basicSettings.institutionalDefault;
    dialogOpen.value = true;
};

const handleButtonCancelClick = () => {
    dialogOpen.value = false;
};

const handleButtonSaveClick = () => {
    emit("change", {
        name: nameTransient.value ?? basicSettings.name,
        description: descriptionTransient.value,
        examType: toApiExamType(examTypeTransient.value),
        clientConfigurationId:
            clientConfigurationTransient.value !== undefined
                ? Number(clientConfigurationTransient.value)
                : undefined,
        lmsIntegration: lmsIntegrationTransient.value,
        institutionalDefault: institutionalDefaultTransient.value,
    });
    dialogOpen.value = false;
};
</script>
