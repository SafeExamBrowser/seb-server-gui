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
                :status="exam?.status"
                :exam-template-id="exam?.examTemplateId"
            />
        </template>
        <template #PanelMain>
            <LoadingFallbackComponent :loading="loading" :errors="errors">
                <BasicGrid v-if="examId !== undefined" />
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
import ExamSidePanel from "./components/ExamSidePanel.vue";

definePage({
    meta: {
        titleKey: "titles.examDetails",
        pageTestId: "exam-details-page",
    },
});

const dataTestId = "examDetail";

const { t } = useI18n();

const { examId, exam, title, breadCrumb, errors, loading, notFound } =
    useExamDetailPage();

const notFoundBackLink = {
    label: t("examDetail.notFound.backToList"),
    to: typedTo({ name: "/(app)/exam/" }),
};
</script>
