import { computed } from "vue";
import { z } from "zod";
import { useRoute } from "vue-router";
import i18n from "@/i18n";
import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";
import {
    ClientGroupExisting,
    ExamTemplate,
    IndicatorExisting,
} from "@/models/seb-server/examTemplate.ts";
import { updateExamTemplate } from "@/services/seb-server/examTemplateService.ts";
import { SCREEN_PROCTORING_COLLECTION_STRATEGY } from "@/models/seb-server/screenProctoring.ts";
import { useSupervisors } from "@/composables/useSupervisors.ts";
import { useMutation } from "@/composables/useMutation.ts";
import { useExamTemplate } from "./api/useExamTemplate.ts";

const idSchema = z.coerce.number().int().positive();

export const useExamTemplateDetailPage = () => {
    const route = useRoute("/(app)/exam-template/[id]/");
    const parseResult = idSchema.safeParse(route.params.id);
    const examTemplateId = parseResult.success ? parseResult.data : undefined;

    const {
        data: examTemplate,
        loading: examTemplateLoading,
        error: examTemplateError,
    } = useExamTemplate(examTemplateId);

    const {
        data: availableSupervisors,
        loading: availableSupervisorsLoading,
        error: availableSupervisorsError,
    } = useSupervisors();

    const loading = computed(
        () => examTemplateLoading.value || availableSupervisorsLoading.value,
    );

    const errors = computed(() => {
        const messages = [];

        if (!parseResult.success) {
            messages.push(
                i18n.global.t("examTemplateDetail.errors.invalidId", {
                    id: route.params.id,
                }),
            );
        }

        if (examTemplateError.value) {
            messages.push(examTemplateError.value);
        }

        if (availableSupervisorsError.value) {
            messages.push(availableSupervisorsError.value);
        }

        return messages;
    });

    const title = computed(() => {
        if (examTemplate.value) {
            return examTemplate.value.name;
        }

        if (loading.value) {
            return "";
        }

        return i18n.global.t("titles.examTemplateDetail");
    });

    const breadCrumb = computed<BreadCrumbItem[]>(() => [
        {
            label: i18n.global.t("titles.examTemplateList"),
            link: { name: "/(app)/exam-template/" },
        },
        ...(examTemplate.value ? [{ label: title.value }] : []),
    ]);

    const indicators = computed<IndicatorExisting[]>(
        () => examTemplate.value?.indicatorTemplates ?? [],
    );

    const selectedSupervisorIds = computed<string[]>(
        () => examTemplate.value?.supporter ?? [],
    );

    const clientGroups = computed<ClientGroupExisting[]>(
        () => examTemplate.value?.CLIENT_GROUP_TEMPLATES ?? [],
    );

    const screenProctoring = {
        enabled: computed(
            () =>
                examTemplate.value?.EXAM_ATTRIBUTES?.enableScreenProctoring ===
                "true",
        ),
        collectionStrategy: computed(() =>
            SCREEN_PROCTORING_COLLECTION_STRATEGY.find(
                (strategy) =>
                    strategy ===
                    examTemplate.value?.EXAM_ATTRIBUTES?.spsCollectingStrategy,
            ),
        ),
    };

    const updateMutation = useMutation((template: ExamTemplate) =>
        updateExamTemplate(template),
    );

    const updateTemplate = async (patch: Partial<ExamTemplate>) => {
        if (!examTemplate.value) {
            return;
        }

        const examTemplateUpdated = await updateMutation.mutateData({
            ...examTemplate.value,
            ...patch,
        });

        if (!examTemplateUpdated) {
            // TODO andrei: proper error handling
            // eslint-disable-next-line no-console
            console.error(updateMutation.error.value);
            return;
        }

        examTemplate.value = examTemplateUpdated;
    };

    return {
        examTemplateId,
        loading,
        errors,
        title,
        breadCrumb,
        indicators,
        availableSupervisors,
        selectedSupervisorIds,
        clientGroups,
        screenProctoring,
        updateTemplate,
    };
};
