<template>
    <ProctoringViewPage :session-id-prop="sessionId" />
</template>

<script setup lang="ts">
import ProctoringViewPage from "@/components/widgets/ProctoringViewPage.vue";
import { useRoute } from "vue-router";
definePage({
    meta: {
        titleKey: "titles.screenProctoring",
        pageTestId: "sp-recording-page",
    },
});

const sessionId = useRoute().params.sessionId;
</script>
