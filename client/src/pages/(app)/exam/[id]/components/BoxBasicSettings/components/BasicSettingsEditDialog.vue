<template>
    <v-btn
        class="text-none"
        color="primary"
        variant="text"
        density="compact"
        :title="$t('examDetail.boxes.basicSettings.title')"
        :aria-label="$t('examDetail.boxes.basicSettings.title')"
        :disabled="editDisabled.value"
        @click="handleButtonEditClick"
    >
        <v-icon icon="mdi-pencil" size="x-small" />
    </v-btn>

    <v-dialog v-model="dialogOpen" :max-width="thresholds.sm">
        <v-card>
            <v-card-title>
                {{ $t("examDetail.boxes.basicSettings.title") }}
            </v-card-title>
            <v-card-text>
                <FormBuilder v-model="formReady" :fields="formFields" />
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
import { computed, Ref, ref } from "vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import {
    ExamTypeEnum,
    toApiExamType,
    toSelectableExamType,
} from "@/models/seb-server/examFiltersEnum.ts";
import { useExamBasicSettingsFields } from "@/pages/(app)/exam/[id]/components/BoxBasicSettings/composables/useExamBasicSettingsFields";
import { BasicSettings } from "@/models/seb-server/exam.ts";
import { TimeRange } from "@/components/widgets/formBuilder/types";
import {
    getDateWithTimeBackendFormat,
    getTimeRangeFromIsoToReadableDates,
} from "@/utils/timeUtils";
import { useDisplay } from "vuetify";
import { EntityName } from "@/api/seb-server/generated/hey-api";

const { thresholds: thresholdsRef } = useDisplay();
const thresholds = computed(() => thresholdsRef.value);

const { consecutiveExamNames, examWithURL, basicSettings, editDisabled } =
    defineProps<{
        consecutiveExamNames: Ref<EntityName[] | undefined>;
        examWithURL: boolean;
        basicSettings: BasicSettings;
        editDisabled: Ref<boolean>;
    }>();

const emit = defineEmits<{
    (e: "change", value: BasicSettings): void;
}>();

const dialogOpen = ref(false);
const formReady = ref(false);

const quizNameTransient = ref<string>();
const descriptionTransient = ref<string>();
const startURLTransient = ref<string>();
const quizTimeRangeTransient = ref<TimeRange>();
const typeTransient = ref<ExamTypeEnum>();
const consecutiveExamTransient = ref<string | undefined>();
const quitPasswordTransient = ref<string | undefined>();
const encryptPasswordTransient = ref<string | undefined>();

const { formFields } = useExamBasicSettingsFields(
    examWithURL,
    consecutiveExamNames,
    {
        quizName: quizNameTransient,
        description: descriptionTransient,
        startURL: startURLTransient,
        quizTimeRange: quizTimeRangeTransient,
        type: typeTransient,
        consecutiveExam: consecutiveExamTransient,
        quitPassword: quitPasswordTransient,
        encryptPassword: encryptPasswordTransient,
    },
);

const handleButtonEditClick = () => {
    quizNameTransient.value = basicSettings.quizName;
    descriptionTransient.value = basicSettings.quiz_description;
    startURLTransient.value = basicSettings.quiz_start_url;
    quizTimeRangeTransient.value = getTimeRangeFromIsoToReadableDates(
        basicSettings.quizStartTime,
        basicSettings.quizEndTime,
    );
    typeTransient.value = toSelectableExamType(basicSettings.type);
    consecutiveExamTransient.value =
        basicSettings.followupId?.toString() ?? undefined;
    quitPasswordTransient.value = basicSettings.quitPassword;
    encryptPasswordTransient.value = basicSettings.encryptPassword;

    dialogOpen.value = true;
};

const handleButtonCancelClick = () => {
    dialogOpen.value = false;
};

const handleButtonSaveClick = () => {
    emit("change", {
        quizName: quizNameTransient.value ?? basicSettings.quizName,
        quiz_description:
            descriptionTransient.value ?? basicSettings.quiz_description,
        quiz_start_url: startURLTransient.value ?? basicSettings.quiz_start_url,
        quizStartTime: getQuizFromDate(),
        quizEndTime: getQuizToDate(),
        type: toApiExamType(typeTransient.value),
        status: basicSettings.status,
        followupId: getFollowupIdNum(),
        quitPassword: quitPasswordTransient.value,
        encryptPassword: encryptPasswordTransient.value,
    });
    dialogOpen.value = false;
};

const getQuizFromDate = (): string => {
    if (!quizTimeRangeTransient.value) {
        return basicSettings.quizStartTime;
    }

    return getDateWithTimeBackendFormat(
        quizTimeRangeTransient.value.fromDate,
        quizTimeRangeTransient.value.fromTime,
    );
};

const getQuizToDate = (): string => {
    if (!quizTimeRangeTransient.value) {
        return basicSettings.quizEndTime;
    }

    return getDateWithTimeBackendFormat(
        quizTimeRangeTransient.value.toDate,
        quizTimeRangeTransient.value.toTime,
    );
};

const getFollowupIdNum = (): number | null => {
    if (consecutiveExamTransient.value) {
        return Number(consecutiveExamTransient.value);
    }

    return null;
};
</script>
