<template>
    <div class="d-flex flex-column h-100">
        <div
            class="flex-grow-1 overflow-y-auto px-4 pt-6 pb-3 d-flex flex-column ga-4"
            :style="{ minHeight: 0 }"
        >
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
                v-if="examTemplateRoute && examTemplateName"
                class="d-flex flex-column ga-1 align-start"
            >
                <span
                    class="text-body-small text-medium-emphasis text-uppercase font-weight-bold"
                >
                    {{ $t("examDetail.sidePanel.createdWithTemplate") }}
                </span>
                <RouterLink
                    :to="examTemplateRoute"
                    class="text-primary font-weight-medium text-decoration-none"
                >
                    {{ examTemplateName }}
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import * as generalUtils from "@/utils/generalUtils.ts";
import { ExamStatusEnum } from "@/models/seb-server/examFiltersEnum.ts";
import { typedTo } from "@/router/typedTo.ts";
import { useExamTemplateNames } from "@/composables/useExamTemplateNames.ts";

const props = defineProps<{
    status?: string;
    examTemplateId?: number;
}>();

const { data: examTemplateNames } = useExamTemplateNames();

const examTemplateName = computed(
    () =>
        examTemplateNames.value?.find(
            (templateName) =>
                templateName.modelId === String(props.examTemplateId),
        )?.name,
);

const statusEnum = computed(() =>
    generalUtils.findEnumValue(ExamStatusEnum, props.status),
);

const statusLabel = computed(() => generalUtils.translate(statusEnum.value));

const statusColor = computed(() =>
    generalUtils.getExamStatusFilterColor(statusEnum.value),
);

const examTemplateRoute = computed(() => {
    if (props.examTemplateId === undefined) {
        return undefined;
    }

    return typedTo({
        name: "/(app)/exam-template/[id]/",
        params: { id: String(props.examTemplateId) },
    });
});
</script>
