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
</template>

<script setup lang="ts">
import { computed } from "vue";
import { VChip } from "vuetify/components";

import { Exam } from "@/models/seb-server/exam.ts";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum.ts";
import * as generalUtils from "@/utils/generalUtils.ts";

const props = defineProps<{
    exam?: Exam;
}>();

const statusEnum = computed(() =>
    generalUtils.findEnumValue(ExamStatusEnum, props.exam?.status),
);

const statusLabel = computed(() => generalUtils.translate(statusEnum.value));

const statusColor = computed(() =>
    generalUtils.getExamStatusFilterColor(statusEnum.value),
);
</script>
