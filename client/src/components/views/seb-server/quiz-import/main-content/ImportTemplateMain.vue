<template>
    <div class="h-100 w-100">
        <v-row dense>
            <v-col>
                <div class="text-h6 font-weight-bold mb-1">
                    {{ translate("quizImportWizard.templateMain.title") }}
                </div>
                <div class="mb-10 text-body-2">
                    {{ translate("quizImportWizard.templateMain.description") }}
                </div>
            </v-col>
        </v-row>

        <!-- SCROLLABLE CONTAINER -->
        <div class="template-scroll-wrapper">
            <v-card
                v-for="examTemplate in examTemplates?.content"
                :key="examTemplate.id"
                :aria-label="
                    translate('quizImportWizard.templateMain.templateSelect')
                "
                class="exam-template-card"
                :class="{
                    selected:
                        quizImportStore.selectedExamTemplate?.id ===
                        examTemplate.id,
                }"
                :ripple="false"
                tabindex="0"
                variant="outlined"
                @click="onTemplateCardClick(examTemplate)"
                @keyup.enter="onTemplateCardClick(examTemplate)"
            >
                <div class="card-content">
                    <div class="card-text">
                        <div class="text-subtitle-1 font-weight-medium">
                            {{ examTemplate.name }}
                        </div>
                        <div class="text-body-2 text-medium-emphasis">
                            {{ examTemplate.description }}
                        </div>
                    </div>

                    <v-btn
                        :aria-label="
                            translate(
                                'quizImportWizard.templateMain.templateInfo',
                            )
                        "
                        class="info-button"
                        color="grey-darken-1"
                        icon="mdi-information"
                        variant="text"
                        @click.stop="openExamTemplateDialog(examTemplate)"
                    />
                </div>
            </v-card>
        </div>
    </div>

    <!-----------description popup---------->
    <v-dialog v-model="dialog" max-width="600">
        <ExamTemplateDialog
            :exam-template="selectedTemplate"
            @close-exam-template-dialog="closeExamTemplateDialog()"
        >
        </ExamTemplateDialog>
    </v-dialog>
</template>

<script setup lang="ts">
import ExamTemplateDialog from "@/components/widgets/ExamTemplateDialog.vue";
import * as quizImportWizardViewService from "@/services/seb-server/component-services/quizImportWizardViewService";
import * as examViewService from "@/services/seb-server/component-services/examViewService";
import { useQuizImportStore } from "@/stores/seb-server/quizImportStore";
import { translate } from "@/utils/generalUtils";
import * as generalUtils from "@/utils/generalUtils";
import * as userAccountViewService from "@/services/seb-server/component-services/userAccountViewService";
import { useUserAccountStore } from "@/stores/authentication/authenticationStore";
import { ref, onBeforeMount } from "vue";
import { UserAccountName } from "@/models/userAccount";

// stores
const quizImportStore = useQuizImportStore();
const userAccountStore = useUserAccountStore();

// items
const examTemplates = ref<ExamTemplates>();

// dialog - description popup
const dialog = ref(false);
const selectedTemplate = ref<ExamTemplate | null>(null);

//= ======================events & watchers=======================
onBeforeMount(async () => {
    const examTemplatesResponse: ExamTemplates | null =
        await quizImportWizardViewService.getExamTemplates();
    if (examTemplatesResponse == null) {
        return;
    }

    examTemplates.value = examTemplatesResponse;
});

async function onTemplateCardClick(examTemplate: ExamTemplate) {
    // if the same is selected just leave
    if (examTemplate.id === quizImportStore.selectedExamTemplate?.id) {
        return;
    }

    // clear exam template affected settings first. They will be re-assigned from actual selected template.
    quizImportStore.clearTemplatePreSelection();

    // select template and set quit password from template
    quizImportStore.selectedExamTemplate = examTemplate;
    if (examTemplate.EXAM_ATTRIBUTES.quitPassword && examTemplate.id) {
        // get single template to get plain quit-password
        const examTemplateResponse: ExamTemplate | null =
            await quizImportWizardViewService.getExamTemplate(
                examTemplate.id.toString(),
            );
        if (examTemplateResponse != null) {
            quizImportStore.selectedQuitPassword =
                examTemplateResponse.EXAM_ATTRIBUTES.quitPassword || "";
            quizImportStore.templateQuitPassword =
                examTemplateResponse.EXAM_ATTRIBUTES.quitPassword || "";
        }
    }
    await getExamTemplateSpGroups();

    // select supervisors from template
    const userAccountNamesResponse: UserAccountName[] | null =
        await userAccountViewService.getSupervisorNames({
            institutionId: userAccountStore.userAccount?.institutionId,
        });
    if (userAccountNamesResponse != null) {
        // add supervisors from template to list
        if (quizImportStore.selectedExamTemplate?.supporter != null) {
            quizImportStore.selectedExamSupervisors.push(
                ...userAccountNamesResponse.filter((user) =>
                    quizImportStore.selectedExamTemplate?.supporter.includes(
                        user.modelId,
                    ),
                ),
            );
        }
    }

    // apply client groups
    if (
        quizImportStore.selectedExamTemplate.CLIENT_GROUP_TEMPLATES != null &&
        quizImportStore.selectedExamTemplate.CLIENT_GROUP_TEMPLATES.length > 1
    ) {
        quizImportStore.addGroupSelectionComponents();

        // TODO why is this necessary?
        // if (quizImportStore.selectedExamTemplate.EXAM_ATTRIBUTES.enableScreenProctoring) {
        //     await getExamTemplateSpGroups();
        // }

        return;
    }

    if (
        quizImportStore.selectedExamTemplate.CLIENT_GROUP_TEMPLATES != null &&
        quizImportStore.selectedExamTemplate.CLIENT_GROUP_TEMPLATES.length === 1
    ) {
        quizImportStore.selectedClientGroups.push(
            quizImportStore.selectedExamTemplate.CLIENT_GROUP_TEMPLATES[0],
        );
        return;
    }

    quizImportStore.removeGroupSelectionComponents();
}

function openExamTemplateDialog(examTemplate: ExamTemplate) {
    selectedTemplate.value = examTemplate;
    dialog.value = true;
}

function closeExamTemplateDialog() {
    dialog.value = false;
}

async function getExamTemplateSpGroups() {
    if (quizImportStore.selectedExamTemplate!.id == null) {
        return;
    }
    const examTemplateSp: ScreenProctoringSettings | null =
        await examViewService.getExamTemplateSp(
            quizImportStore.selectedExamTemplate!.id.toString(),
        );

    if (examTemplateSp == null) {
        return;
    }

    quizImportStore.availableSpClientGroupIds = generalUtils.createNumberIdList(
        examTemplateSp.spsSEBGroupsSelection,
    );
}
</script>

<style scoped>
.template-scroll-wrapper {
    overflow-y: auto;
    max-height: 100%;
    padding-right: 4px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Card layout */
.exam-template-card {
    width: 100%;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e0e0e0;
    background-color: #ffffff;
    transition:
        border-color 0.2s ease,
        background-color 0.2s ease;
}

/* Selected style */
.exam-template-card.selected {
    background-color: #f5faff;
    border-color: #2196f3;
}

/* Content inside the card */
.card-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Left side (title + description) */
.card-text {
    display: flex;
    flex-direction: column;
}

/* Info button style */
.info-button {
    opacity: 0.7;
    transition: opacity 0.2s ease;
}

.info-button:hover {
    opacity: 1;
}
</style>
