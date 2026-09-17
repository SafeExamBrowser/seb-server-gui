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
                    <template #01_basicSettings>
                        <BoxBasicSettings
                            :basic-settings="basicSettings"
                            @change="handleBasicSettingsChange"
                        />
                    </template>
                    <template
                        v-if="basicSettings.configurationTemplateId"
                        #02_sebSettings
                    >
                        <BoxSEBSettings
                            :exam-template-name="basicSettings.name"
                            :config-template-id="
                                basicSettings.configurationTemplateId
                            "
                        />
                    </template>
                    <template #03_indicators>
                        <BoxIndicators
                            :exam-template-id="examTemplateId"
                            :indicators="indicators"
                        />
                    </template>
                    <template #04_supervisors>
                        <BoxSupervisors
                            :available-supervisors="availableSupervisors ?? []"
                            :selected-supervisor-ids="selectedSupervisorIds"
                            @change="handleSupervisorsChange"
                        />
                    </template>
                    <template #05_groups>
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

import BasicGrid from "@/components/layout/BasicGrid.vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import NotFoundPage from "@/components/layout/pages/NotFoundPage.vue";
import BoxSupervisors from "@/components/widgets/BoxSupervisors.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import BoxBasicSettings from "@/pages/(app)/exam-template/[id]/components/BoxBasicSettings/BoxBasicSettings.vue";
import BoxSEBSettings from "@/pages/(app)/exam-template/[id]/components/BoxSEBSettings/BoxSEBSettings.vue";
import { typedTo } from "@/router/typedTo";

import BoxClientGroups from "./components/BoxClientGroups.vue";
import BoxIndicators from "./components/BoxIndicators.vue";
import { useExamTemplateDetailPage } from "./composables/useExamTemplateDetailPage.ts";

definePage({
    meta: {
        titleKey: "titles.examTemplateDetail",
        pageTestId: "exam-template-detail-page",
        requiredComponent: "EXAM_TEMPLATE_DETAIL",
    },
});

const dataTestId = "examTemplateDetail";

const { t } = useI18n();

// TODO @andrei: fix this, once we switched to TanStackQuery
// - This currently fetches all data and passes it to the boxes via props (propdrilling)
// - The boxes then still manage their internal state based on the initial data from outside. This leads to syncing problems, because
//   when data changes from inside the box, the outside representation of the data is stale and needs to be updated manually.
// - This happens e.g. with indicators and client groups (check the code)
// - With TanStackQuery, we can just "fetch the data twice" (`useExamTemplateQuery`): once for the basic settings and once for
//   the respective box. We would only write our code like we would fetch twice but TanstackQuery would
//   cache the data under the hood and only hit the server once – This is one of the big benefits of TanStackQuery.
// - The stale data / syncing problem can be solved by using optimistic updates (https://tanstack.com/query/latest/docs/framework/vue/guides/optimistic-updates)
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
