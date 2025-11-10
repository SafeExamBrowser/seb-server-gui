<template>
    <v-btn
        icon="mdi-delete"
        color="medium-emphasis"
        variant="text"
        density="compact"
        size="small"
        :title="$t('general.deleteButton')"
        :aria-label="$t('general.deleteButton')"
        @click="handleDeleteClick"
    ></v-btn>
</template>

<script setup lang="ts">
import { useStepIndicatorsStore } from "@/components/views/seb-server/template/exam/components/stepIndicators/composables/store/useStepIndicatorsStore";
import { Indicator } from "@/components/views/seb-server/template/exam/components/stepIndicators/types";

const props = defineProps<{
    indicator: Indicator;
}>();

const { deleteIndicator } = useStepIndicatorsStore();

const handleDeleteClick = () => {
    deleteIndicator(props.indicator);
};
</script>
