<template>
    <NotFoundPage
        v-if="notFound"
        :message="$t('examTemplateDetail.notFound.message')"
        :back-link="notFoundBackLink"
    />
    <BasicPage
        v-else
        floating
        :title="title"
        :bread-crumb="breadCrumb"
        :data-test-id="dataTestId"
    >
        <template #PanelMain>
            <LoadingFallbackComponent :loading="loading" :errors="errors">
                <BasicGrid v-if="examTemplateId !== undefined">
                    <template #basicSettings>
                        <BoxBasicSettings
                            :basic-settings="basicSettings"
                            @change="handleBasicSettingsChange"
                        />
                    </template>
                    <template
                        v-if="basicSettings.configurationTemplateId"
                        #sebSettings
                    >
                        <BoxSEBSettings
                            :exam-template-name="basicSettings.name"
                            :config-template-id="
                                basicSettings.configurationTemplateId
                            "
                        />
                    </template>
                    <template #indicators>
                        <BoxIndicators
                            :exam-template-id="examTemplateId"
                            :indicators="indicators"
                        />
                    </template>
                    <template #supervisors>
                        <BoxSupervisors
                            :available-supervisors="availableSupervisors ?? []"
                            :selected-supervisor-ids="selectedSupervisorIds"
                            @change="handleSupervisorsChange"
                        />
                    </template>
                    <template #screenProctoringSettings>
                        <BoxScreenProctoringSettings
                            :enabled="screenProctoring.enabled.value"
                            :collection-strategy="
                                screenProctoring.collectionStrategy.value
                            "
                            @change="handleScreenProctoringChange"
                        />
                    </template>
                    <template #groups>
                        <BoxClientGroups
                            :exam-template-id="examTemplateId"
                            :client-groups="clientGroups"
                            :screen-proctoring="screenProctoring"
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
import { useExamTemplateDetailPage } from "./composables/useExamTemplateDetailPage.ts";
import BoxBasicSettings from "@/pages/(app)/exam-template/[id]/components/BoxBasicSettings/BoxBasicSettings.vue";
import BoxSEBSettings from "@/pages/(app)/exam-template/[id]/components/BoxSEBSettings/BoxSEBSettings.vue";
import BoxIndicators from "./components/BoxIndicators.vue";
import BoxSupervisors from "./components/BoxSupervisors.vue";
import BoxScreenProctoringSettings from "./components/BoxScreenProctoringSettings/BoxScreenProctoringSettings.vue";
import BoxClientGroups from "./components/BoxClientGroups.vue";

definePage({
    meta: {
        titleKey: "titles.examTemplateDetail",
        pageTestId: "exam-template-detail-page",
    },
});

const dataTestId = "examTemplateDetail";

const { t } = useI18n();

const {
    examTemplateId,
    title,
    breadCrumb,
    errors,
    loading,
    notFound,
    indicators,
    availableSupervisors,
    selectedSupervisorIds,
    clientGroups,
    screenProctoring,
    basicSettings,
    updateTemplate,
    handleScreenProctoringChange,
    handleBasicSettingsChange,
} = useExamTemplateDetailPage();

const notFoundBackLink = {
    label: t("examTemplateDetail.notFound.backToList"),
    to: typedTo({ name: "/(app)/exam-template/" }),
};

const handleSupervisorsChange = (ids: string[]) =>
    updateTemplate({
        supporter: ids,
    });
</script>
