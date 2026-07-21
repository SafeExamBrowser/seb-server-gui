<template>
    <NotFoundPage
        v-if="notFound"
        :message="$t('examDetail.notFound.message')"
        :back-link="notFoundBackLink"
    />
    <BasicPage
        v-else
        floating
        :title="title"
        :bread-crumb="breadCrumb"
        :data-test-id="dataTestId"
    >
        <template #PanelLeft>
            <ExamSidePanel
                :exam="exam"
                :seb-lock-active="sebLockActive"
                @toggle-test-run="actions.handleTestRunToggle"
                @toggle-seb-lock="actions.handleSebLockToggle"
                @toggle-exclude-from-deletion="
                    actions.handleExcludeFromDeletionToggle
                "
                @delete-exam="actions.handleDeleteExam"
            />
        </template>
        <template #PanelMain>
            <LoadingFallbackComponent :loading="loading" :errors="errors">
                <BasicGrid v-if="examId !== undefined">
                    <template #01_basicSettings>
                        <BoxBasicSettings
                            :exam-id="examId"
                            :basic-settings="basicSettingsValues"
                            :exam-with-u-r-l="examWithURL"
                            :edit-disabled="basicSettingsEditDisabled"
                            @change="handleBasicSettingsChange"
                        />
                    </template>

                    <template #02_sebSettings>
                        <BoxSEBSettings
                            :exam-id="examId"
                            :edit-disabled="sebSettingsEditDisabled"
                        />
                    </template>
                </BasicGrid>
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import BasicGrid from "@/components/layout/BasicGrid.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import NotFoundPage from "@/components/layout/pages/NotFoundPage.vue";
import { typedTo } from "@/router/typedTo";
import { useExamDetailPage } from "./composables/useExamDetailPage.ts";
import ExamSidePanel from "./components/ExamSidePanel/ExamSidePanel.vue";
import BoxBasicSettings from "./components/BoxBasicSettings/BoxBasicSettings.vue";
import BoxSEBSettings from "./components/BoxSEBSettings/BoxSEBSettings.vue";

definePage({
    meta: {
        titleKey: "titles.examDetails",
        pageTestId: "exam-details-page",
    },
});

const dataTestId = "examDetail";

const { t } = useI18n();

const {
    examId,
    exam,
    title,
    breadCrumb,
    errors,
    loading,
    notFound,
    sebLockActive,
    examWithURL,
    basicSettings,
    sebSettings,
    actions,
} = useExamDetailPage();

const {
    settings: basicSettingsValues,
    editDisabled: basicSettingsEditDisabled,
    handleChange: handleBasicSettingsChange,
} = basicSettings;

const { editDisabled: sebSettingsEditDisabled } = sebSettings;

const notFoundBackLink = {
    label: t("examDetail.notFound.backToList"),
    to: typedTo({ name: "/(app)/exam/" }),
};
</script>
