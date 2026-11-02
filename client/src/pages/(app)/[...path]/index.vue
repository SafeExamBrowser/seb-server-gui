<template>
    <NotFoundPage :message="$t('notFound.message')" :back-link="backLink" />
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";

import NotFoundPage from "@/components/layout/pages/NotFoundPage.vue";
import { typedTo } from "@/router/typedTo";

definePage({
    meta: {
        titleKey: "titles.pageNotFound",
        pageTestId: "not-found-page",
    },
});

const { t } = useI18n();

const backLink = {
    label: t("notFound.backToHome"),
    to: typedTo({ name: "/(app)/" }),
};
</script>
