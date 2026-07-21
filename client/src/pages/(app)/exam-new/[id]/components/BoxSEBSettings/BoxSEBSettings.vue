<template>
    <DetailBox :title="$t('examDetail.boxes.sebSettings.title')">
        <template #action>
            <BoxActionButton
                icon="mdi-pencil"
                :label="$t('examDetail.boxes.sebSettings.edit')"
            />
        </template>

        <!-- TODO @alain: render "Last modified by" (figure out how to get it from the BE; Andreas said it's already possible) -->
    </DetailBox>
</template>

<script setup lang="ts">
import DetailBox from "@/components/widgets/DetailBox.vue";
import BoxActionButton from "@/components/widgets/BoxActionButton.vue";
</script>
