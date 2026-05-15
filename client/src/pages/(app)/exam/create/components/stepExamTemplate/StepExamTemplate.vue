<template>
    <StepItem
        :title="$t('createExam.steps.examTemplate.title')"
        :subtitle="$t('createExam.steps.examTemplate.subtitle')"
        :manual-scroll-management="true"
    >
        <LoadingFallbackComponent :loading="loading" :errors="errors">
            <v-list
                class="bg-transparent pa-0 d-flex flex-column ga-3"
                lines="two"
            >
                <v-list-item
                    v-for="template in examTemplates?.content ?? []"
                    :key="template.id"
                    :active="store.selectedExamTemplate?.id === template.id"
                    class="border rounded-lg pa-4"
                    rounded
                    @click="handleSelect(template)"
                >
                    <template #prepend>
                        <v-icon class="mr-3" color="primary">
                            mdi-clipboard-text-outline
                        </v-icon>
                    </template>
                    <v-list-item-title class="font-weight-medium">
                        {{ template.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-medium-emphasis">
                        {{
                            template.description ||
                            $t("createExam.steps.examTemplate.noDescription")
                        }}
                    </v-list-item-subtitle>
                    <template #append>
                        <v-btn
                            :aria-label="
                                $t('createExam.steps.examTemplate.openInfo')
                            "
                            color="grey-darken-1"
                            density="comfortable"
                            icon="mdi-information"
                            variant="text"
                            @click.stop="openInfoDialog(template)"
                        />
                    </template>
                </v-list-item>
            </v-list>
        </LoadingFallbackComponent>

        <v-dialog v-model="infoDialogOpen" max-width="600">
            <ExamTemplateDialog
                :exam-template="infoDialogTemplate"
                @close-exam-template-dialog="infoDialogOpen = false"
            />
        </v-dialog>
    </StepItem>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import ExamTemplateDialog from "@/components/widgets/ExamTemplateDialog.vue";
import { useStepExamTemplateStore } from "./composables/store/useStepExamTemplateStore.ts";
import { useStepSupervisorsStore } from "@/pages/(app)/exam/create/components/stepSupervisors/composables/store/useStepSupervisorsStore.ts";
import { useStepClientGroupsStore } from "@/pages/(app)/exam/create/components/stepClientGroups/composables/store/useStepClientGroupsStore.ts";
import { useStepQuitPasswordStore } from "@/pages/(app)/exam/create/components/stepQuitPassword/composables/store/useStepQuitPasswordStore.ts";
import { useExamTemplates } from "./composables/api/useExamTemplates.ts";
import { useExamTemplateDetail } from "./composables/api/useExamTemplateDetail.ts";
import { ExamTemplate } from "@/models/seb-server/examTemplate.ts";

const infoDialogOpen = ref(false);
const infoDialogTemplate = ref<ExamTemplate | null>(null);

const openInfoDialog = (template: ExamTemplate) => {
    infoDialogTemplate.value = template;
    infoDialogOpen.value = true;
};

const store = useStepExamTemplateStore();
const stepSupervisorsStore = useStepSupervisorsStore();
const stepClientGroupsStore = useStepClientGroupsStore();
const stepQuitPasswordStore = useStepQuitPasswordStore();

const {
    data: examTemplates,
    loading,
    error: errorLoading,
} = useExamTemplates();

const { data: templateDetail, fetch: fetchTemplateDetail } =
    useExamTemplateDetail();

const errors = computed(() =>
    [errorLoading.value].filter((error) => error !== undefined),
);

const handleSelect = (template: ExamTemplate) => {
    if (store.selectedExamTemplate?.id === template.id) {
        return;
    }

    stepSupervisorsStore.$reset();
    stepClientGroupsStore.$reset();
    stepQuitPasswordStore.$reset();

    store.selectedExamTemplate = template;

    stepSupervisorsStore.selectedSupervisorIds = [...template.supporter];

    if (template.CLIENT_GROUP_TEMPLATES.length === 1) {
        stepClientGroupsStore.selectedClientGroups = [
            ...template.CLIENT_GROUP_TEMPLATES,
        ];
    }

    if (template.EXAM_ATTRIBUTES.quitPassword && template.id !== undefined) {
        fetchTemplateDetail(template.id.toString());
    }
};

watch(templateDetail, (detail) => {
    if (!detail) {
        return;
    }
    stepQuitPasswordStore.quitPassword =
        detail.EXAM_ATTRIBUTES.quitPassword ?? "";
});
</script>
