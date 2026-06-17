<template>
    <v-btn
        class="text-none"
        color="primary"
        variant="text"
        density="compact"
        :title="
            $t('examTemplateDetail.boxes.screenProctoringSettings.dialogTitle')
        "
        :aria-label="
            $t('examTemplateDetail.boxes.screenProctoringSettings.dialogTitle')
        "
        @click="handleButtonEditClick"
    >
        <v-icon icon="mdi-pencil" size="x-small" />
    </v-btn>

    <v-dialog v-model="dialogOpen" :max-width="thresholds.sm">
        <v-card>
            <v-card-title>
                {{
                    $t(
                        "examTemplateDetail.boxes.screenProctoringSettings.dialogTitle",
                    )
                }}
            </v-card-title>
            <v-card-text>
                <FormBuilder :fields="formFields" />
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn @click="handleButtonCancelClick">
                    {{ $t("general.cancelButton") }}
                </v-btn>
                <v-btn
                    color="primary"
                    :disabled="!canSave"
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
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useScreenProctoringStrategyField } from "@/composables/useScreenProctoringStrategyField.ts";
import { ScreenProctoringCollectionStrategy } from "@/models/seb-server/screenProctoring.ts";
import { ScreenProctoringSelection } from "@/pages/(app)/exam-template/[id]/components/BoxScreenProctoringSettings/types.ts";

const { enabled, collectionStrategy } =
    defineProps<ScreenProctoringSelection>();

const emit = defineEmits<{
    (e: "change", value: ScreenProctoringSelection): void;
}>();

const { t } = useI18n();

const { thresholds: thresholdsRef } = useDisplay();
const thresholds = computed(() => thresholdsRef.value);

const dialogOpen = ref(false);
const enabledTransient = ref(false);
const collectionStrategyTransient = ref<ScreenProctoringCollectionStrategy>();

const strategyDisabled = computed(() => !enabledTransient.value);
const { field: strategyField } = useScreenProctoringStrategyField(
    collectionStrategyTransient,
    {
        disabled: strategyDisabled,
        required: enabledTransient,
    },
);

const enabledField = computed<FormField>(() => ({
    type: "switch" as const,
    name: "screenProctoringEnabled",
    model: enabledTransient,
    label: t("screenProctoring.enabled.label"),
}));

const formFields = computed<FormField[]>(() => [
    enabledField.value,
    strategyField.value,
]);

const canSave = computed(
    () =>
        !(
            enabledTransient.value &&
            collectionStrategyTransient.value === undefined
        ),
);

const handleButtonEditClick = () => {
    enabledTransient.value = enabled;
    collectionStrategyTransient.value = enabled
        ? collectionStrategy
        : undefined;
    dialogOpen.value = true;
};

const handleButtonCancelClick = () => {
    dialogOpen.value = false;
};

const handleButtonSaveClick = () => {
    emit("change", {
        enabled: enabledTransient.value,
        collectionStrategy: enabledTransient.value
            ? collectionStrategyTransient.value
            : undefined,
    });
    dialogOpen.value = false;
};
</script>
