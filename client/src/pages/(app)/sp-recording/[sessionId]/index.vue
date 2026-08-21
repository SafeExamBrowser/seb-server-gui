<template>
    <ProctoringViewPage :session-id-prop="sessionId" />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

import ProctoringViewPage from "@/components/widgets/ProctoringViewPage.vue";
definePage({
    meta: {
        titleKey: "titles.screenProctoring",
        pageTestId: "sp-recording-page",
        requiredComponent: "SCREEN_PROCTORING_RECORDING",
    },
});

const sessionId = useRoute().params.sessionId;
</script>
