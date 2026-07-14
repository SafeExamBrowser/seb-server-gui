<template>
    <div class="d-flex flex-column h-100">
        <div
            class="flex-grow-1 overflow-y-auto px-4 pt-6 pb-3 d-flex flex-column ga-4"
            :style="{ minHeight: 0 }"
        >
            <div class="d-flex flex-column ga-1 align-start">
                <span
                    class="text-body-small text-medium-emphasis text-uppercase font-weight-bold"
                >
                    {{ $t("examDetail.info.status") }}
                </span>
                <v-chip
                    v-if="statusEnum"
                    :color="statusColor"
                    size="small"
                    variant="tonal"
                >
                    {{ statusLabel }}
                </v-chip>
            </div>

            <div
                v-if="examTemplateRoute && examTemplateName"
                class="d-flex flex-column ga-1 align-start"
            >
                <span
                    class="text-body-small text-medium-emphasis text-uppercase font-weight-bold"
                >
                    {{ $t("examDetail.sidePanel.createdWithTemplate") }}
                </span>
                <RouterLink
                    :to="examTemplateRoute"
                    class="text-primary font-weight-medium text-decoration-none"
                >
                    {{ examTemplateName }}
                </RouterLink>
            </div>
        </div>

        <template v-if="exam">
            <v-divider />

            <div class="pa-4 d-flex flex-column ga-2">
                <v-btn
                    block
                    class="text-none"
                    color="primary"
                    :variant="testRunActive ? 'tonal' : 'flat'"
                    :disabled="!testRunEnabled"
                    @click="handleTestRunClick"
                >
                    {{
                        $t(
                            testRunActive
                                ? "examDetail.sidePanel.actions.testRunApplied"
                                : "examDetail.sidePanel.actions.applyTestRun",
                        )
                    }}
                </v-btn>

                <v-btn
                    v-if="monitorVisible"
                    block
                    class="text-none"
                    color="primary"
                    variant="flat"
                    :to="monitoringRoute"
                >
                    {{ $t("examDetail.sidePanel.actions.monitorExam") }}
                </v-btn>

                <v-btn
                    block
                    class="text-none"
                    color="primary"
                    variant="flat"
                    :disabled="!downloadConnectionEnabled"
                    @click="handleDownloadConnectionClick"
                >
                    {{
                        $t(
                            "examDetail.sidePanel.actions.downloadExamConnection",
                        )
                    }}
                </v-btn>

                <v-btn
                    v-if="sebLockVisible"
                    block
                    class="text-none"
                    color="primary"
                    :variant="sebLockActive ? 'tonal' : 'flat'"
                    :disabled="!sebLockEnabled"
                    @click="handleSebLockClick"
                >
                    {{
                        $t(
                            sebLockActive
                                ? "examDetail.sidePanel.actions.sebLockApplied"
                                : "examDetail.sidePanel.actions.applySebLock",
                        )
                    }}
                </v-btn>

                <v-btn
                    v-if="excludeFromDeletionVisible"
                    block
                    class="text-none"
                    color="primary"
                    :variant="excludedFromDeletion ? 'tonal' : 'flat'"
                    @click="handleExcludeFromDeletionClick"
                >
                    <v-icon start>mdi-delete-off-outline</v-icon>
                    {{
                        $t(
                            excludedFromDeletion
                                ? "examDetail.sidePanel.actions.excludedFromDeletion"
                                : "examDetail.sidePanel.actions.excludeFromDeletion",
                        )
                    }}
                </v-btn>

                <v-btn
                    block
                    class="text-none"
                    color="error"
                    variant="outlined"
                    :disabled="!deleteEnabled"
                    @click="handleDeleteClick"
                >
                    <v-icon start>mdi-delete-outline</v-icon>
                    {{ $t("examDetail.sidePanel.actions.deleteExam") }}
                </v-btn>
            </div>
        </template>
    </div>

    <ConnectionConfigDialog
        v-model="connectionDialogOpen"
        :connection-configurations="connectionConfigurations"
        @confirm="handleConnectionConfigConfirm"
    />

    <DeleteConfirmDialog
        v-model="deleteDialogOpen"
        :detail-text="exam?.quizName"
        translation-key-prefix="examDetail"
        @confirm="handleDeleteConfirm"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import * as generalUtils from "@/utils/generalUtils.ts";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum.ts";
import { LMSFeatureEnum } from "@/models/seb-server/assessmentToolEnums.ts";
import { GUIAction, useAbilities } from "@/services/ability.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import { typedTo } from "@/router/typedTo.ts";
import { useExamTemplateNames } from "@/composables/useExamTemplateNames.ts";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import ConnectionConfigDialog from "./components/ConnectionConfigDialog.vue";
import { useAssessmentTool } from "./composables/api/useAssessmentTool.ts";
import { useDownloadExamConnection } from "./composables/useDownloadExamConnection.ts";

const props = defineProps<{
    exam?: Exam;
    sebLockActive?: boolean;
}>();

const emit = defineEmits<{
    toggleTestRun: [];
    toggleSebLock: [];
    toggleExcludeFromDeletion: [];
    deleteExam: [];
}>();

const ability = useAbilities();

const { data: examTemplateNames } = useExamTemplateNames();

const examTemplateName = computed(
    () =>
        examTemplateNames.value?.find(
            (templateName) =>
                templateName.modelId === String(props.exam?.examTemplateId),
        )?.name,
);

const statusEnum = computed(() =>
    generalUtils.findEnumValue(ExamStatusEnum, props.exam?.status),
);

const statusLabel = computed(() => generalUtils.translate(statusEnum.value));

const statusColor = computed(() =>
    generalUtils.getExamStatusFilterColor(statusEnum.value),
);

const examTemplateRoute = computed(() => {
    const examTemplateId = props.exam?.examTemplateId;

    if (examTemplateId === undefined) {
        return undefined;
    }

    return typedTo({
        name: "/(app)/exam-template/[id]/",
        params: { id: String(examTemplateId) },
    });
});

const testRunActive = computed(
    () => statusEnum.value === ExamStatusEnum.TEST_RUN,
);

const testRunEnabled = computed(() =>
    ability.canDoExamAction(
        testRunActive.value ? GUIAction.DisableTestRun : GUIAction.ApplyTestRun,
        props.exam ?? null,
    ),
);

const monitorVisible = computed(() =>
    ability.canDoExamAction(GUIAction.ShowMonitoring, props.exam ?? null),
);

const monitoringRoute = computed(() => {
    if (!props.exam) {
        return undefined;
    }

    return typedTo({
        name: "/(app)/monitoring/[examId]/",
        params: { examId: String(props.exam.id) },
    });
});

const downloadConnectionEnabled = computed(() =>
    ability.canDoExamAction(GUIAction.EditSEBSettings, props.exam ?? null),
);

const { data: assessmentTool } = useAssessmentTool(
    () => props.exam?.lmsSetupId,
);

const sebLockVisible = computed(() => {
    if (!assessmentTool.value) {
        return false;
    }

    return generalUtils.hasLMSFeature(
        assessmentTool.value.lmsType,
        LMSFeatureEnum.SEB_RESTRICTION,
    );
});

const sebLockEnabled = computed(() =>
    ability.canDoExamAction(GUIAction.ApplySEBRestriction, props.exam ?? null),
);

const excludeFromDeletionVisible = computed(() =>
    ability.canDoExamAction(GUIAction.ExcludeFromDeletion, props.exam ?? null),
);

const excludedFromDeletion = computed(
    () => props.exam?.excludeFromDeletion ?? false,
);

const deleteEnabled = computed(
    () =>
        ability.canDoExamAction(GUIAction.DeleteExam, props.exam ?? null) &&
        !excludedFromDeletion.value,
);

const {
    dialogOpen: connectionDialogOpen,
    connectionConfigurations,
    start: startConnectionDownload,
    download: downloadConnection,
} = useDownloadExamConnection({
    examId: () => props.exam?.id,
    quizName: () => props.exam?.quizName,
});

const deleteDialogOpen = ref(false);

const handleTestRunClick = () => {
    emit("toggleTestRun");
};

const handleDownloadConnectionClick = () => startConnectionDownload();

const handleConnectionConfigConfirm = (connectionId: string) =>
    downloadConnection(connectionId);

const handleSebLockClick = () => {
    emit("toggleSebLock");
};

const handleExcludeFromDeletionClick = () => {
    emit("toggleExcludeFromDeletion");
};

const handleDeleteClick = () => {
    deleteDialogOpen.value = true;
};

const handleDeleteConfirm = () => {
    deleteDialogOpen.value = false;
    emit("deleteExam");
};
</script>
