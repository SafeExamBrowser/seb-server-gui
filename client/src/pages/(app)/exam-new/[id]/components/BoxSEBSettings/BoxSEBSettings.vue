<template>
    <DetailBox :title="$t('examDetail.boxes.sebSettings.title')">
        <template #action>
            <SebSettingsEditDialog :exam-id="examId" />
        </template>

        <!-- TODO @alain: render "Last modified by" (figure out how to get it from the BE; Andreas said it's already possible) -->
    </DetailBox>
</template>

<script setup lang="ts">
import DetailBox from "@/components/widgets/DetailBox.vue";
import SebSettingsEditDialog from "./components/SebSettingsEditDialog.vue";

defineProps<{
    examId: number;
}>();
</script>
