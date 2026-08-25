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
                            :edit-hidden="basicSettingsEditHidden"
                            :edit-disabled="basicSettingsEditDisabled"
                            @change="handleBasicSettingsChange"
                        />
                    </template>

                    <template #02_sebSettings>
                        <BoxSEBSettings
                            :exam-id="examId"
                            :edit-hidden="sebSettingsEditHidden"
                            :edit-disabled="sebSettingsEditDisabled"
                            :last-modified-items="lastModifiedItems"
                            :last-modified-loading="lastModifiedLoading"
                        />
                    </template>

                    <template #03_sebKeys>
                        <BoxSEBKeys
                            :last-modified-items="lastModifiedItems"
                            :last-modified-loading="lastModifiedLoading"
                            :edit-hidden="sebKeysEditHidden"
                            :edit-disabled="sebKeysEditDisabled"
                        />
                    </template>

                    <template #04_supervisors>
                        <BoxSupervisors
                            :available-supervisors="availableSupervisors"
                            :selected-supervisor-ids="selectedSupervisorIds"
                            :edit-hidden="supervisorsEditHidden"
                            :edit-disabled="supervisorsEditDisabled"
                            @change="handleSupervisorsChange"
                        />
                    </template>

                    <template #05_clientGroups>
                        <BoxClientGroups
                            :exam-id="examId"
                            :exam="exam"
                            :refetch-exam="refetchExam"
                        />
                    </template>
                </BasicGrid>
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

import BasicGrid from "@/components/layout/BasicGrid.vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import NotFoundPage from "@/components/layout/pages/NotFoundPage.vue";
import BoxSupervisors from "@/components/widgets/BoxSupervisors.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { typedTo } from "@/router/typedTo";
import { GUIAction } from "@/services/ability.ts";

import BoxBasicSettings from "./components/BoxBasicSettings/BoxBasicSettings.vue";
import BoxClientGroups from "./components/BoxClientGroups/BoxClientGroups.vue";
import BoxSEBKeys from "./components/BoxSEBKeys/BoxSEBKeys.vue";
import BoxSEBSettings from "./components/BoxSEBSettings/BoxSEBSettings.vue";
import ExamSidePanel from "./components/ExamSidePanel/ExamSidePanel.vue";
import { useExamActionAccess } from "./composables/useExamActionAccess.ts";
import { useExamDetailPage } from "./composables/useExamDetailPage.ts";

definePage({
    meta: {
        titleKey: "titles.examDetails",
        pageTestId: "exam-details-page",
        requiredComponent: "EXAM_DETAIL",
    },
});

const dataTestId = "examDetail";

const { t } = useI18n();

const {
    examId,
    exam,
    refetchExam,
    title,
    breadCrumb,
    errors,
    loading,
    notFound,
    sebLockActive,
    examWithURL,
    basicSettings,
    sebSettings,
    supervisors,
    actions,
} = useExamDetailPage();

const {
    settings: basicSettingsValues,
    editHidden: basicSettingsEditHidden,
    editDisabled: basicSettingsEditDisabled,
    handleChange: handleBasicSettingsChange,
} = basicSettings;

const {
    editHidden: sebSettingsEditHidden,
    editDisabled: sebSettingsEditDisabled,
    lastModifiedItems,
    lastModifiedLoading,
} = sebSettings;

const {
    availableSupervisors,
    selectedSupervisorIds,
    editHidden: supervisorsEditHidden,
    editDisabled: supervisorsEditDisabled,
    handleChange: handleSupervisorsChange,
} = supervisors;

const { hidden: sebKeysEditHidden, disabled: sebKeysEditDisabled } =
    useExamActionAccess(exam, GUIAction.EDIT_SEB_KEYS);

const notFoundBackLink = {
    label: t("examDetail.notFound.backToList"),
    to: typedTo({
        name: "/(app)/exam/",
        query: { status: "UP_COMING,TEST_RUN,RUNNING" },
    }),
};
</script>
