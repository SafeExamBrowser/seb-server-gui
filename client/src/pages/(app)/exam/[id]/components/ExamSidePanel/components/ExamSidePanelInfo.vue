<template>
    <div class="d-flex flex-column ga-1 align-start">
        <span
            class="text-body-small text-medium-emphasis text-uppercase font-weight-bold"
        >
            {{ $t("examDetail.info.status") }}
        </span>
        <v-chip
            v-if="statusEnum"
            :color="statusColor"
            size="small"
            variant="tonal"
        >
            {{ statusLabel }}
        </v-chip>
    </div>

    <div
        v-if="examTemplateName"
        class="d-flex flex-column ga-1 mt-2 align-start"
    >
        <span
            class="text-body-small text-medium-emphasis text-uppercase font-weight-bold"
        >
            {{ $t("examDetail.sidePanel.createdWithTemplate") }}
        </span>
        <span class="text-primary font-weight-medium text-decoration-none">
            {{ examTemplateName }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { VChip } from "vuetify/components";

import { useExamTemplateNames } from "@/composables/useExamTemplateNames.ts";
import { Exam } from "@/models/seb-server/exam.ts";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum.ts";
import * as generalUtils from "@/utils/generalUtils.ts";

const props = defineProps<{
    exam?: Exam;
}>();

const { data: examTemplateNames } = useExamTemplateNames();

const examTemplateName = computed(
    () =>
        examTemplateNames.value?.find(
            (templateName) =>
                templateName.modelId === String(props.exam?.examTemplateId),
        )?.name,
);

const statusEnum = computed(() =>
    generalUtils.findEnumValue(ExamStatusEnum, props.exam?.status),
);

const statusLabel = computed(() => generalUtils.translate(statusEnum.value));

const statusColor = computed(() =>
    generalUtils.getExamStatusFilterColor(statusEnum.value),
);
</script>
