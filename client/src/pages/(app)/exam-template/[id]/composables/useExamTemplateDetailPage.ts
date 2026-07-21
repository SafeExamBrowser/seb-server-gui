import { computed } from "vue";
import { useRoute } from "vue-router";
import { z } from "zod";

import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";
import { useMutation } from "@/composables/useMutation.ts";
import { useSupervisors } from "@/composables/useSupervisors.ts";
import i18n from "@/i18n";
import {
    BasicSettings,
    ClientGroupExisting,
    ExamTemplate,
    IndicatorExisting,
} from "@/models/seb-server/examTemplate.ts";
import {
    buildScreenProctoringExamAttributes,
    SCREEN_PROCTORING_COLLECTION_STRATEGY,
    ScreenProctoringCollectionStrategy,
} from "@/models/seb-server/screenProctoring.ts";
import { updateExamTemplate } from "@/services/seb-server/examTemplateService.ts";

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

    const notFound = computed(
        () =>
            examTemplateError.value?.kind === "backend" &&
            examTemplateError.value.status === 404,
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

        if (examTemplateError.value && !notFound.value) {
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

    const basicSettings = computed<BasicSettings>(() => ({
        name: examTemplate.value?.name ?? "",
        description: examTemplate.value?.description,
        examType: examTemplate.value?.examType,
        clientConfigurationId: examTemplate.value?.clientConfigurationId,
        configurationTemplateId: examTemplate.value?.configurationTemplateId,
        lmsIntegration: examTemplate.value?.lmsIntegration ?? false,
        institutionalDefault: examTemplate.value?.institutionalDefault ?? false,
    }));

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
        fallbackGroupName: computed(
            () => examTemplate.value?.EXAM_ATTRIBUTES?.spsCollectingGroupName,
        ),
    };

    const updateMutation = useMutation((template: ExamTemplate) =>
        updateExamTemplate(template),
    );

    const updateTemplate = async (
        patch: Partial<
            Omit<ExamTemplate, "indicatorTemplates" | "CLIENT_GROUP_TEMPLATES">
        >,
    ) => {
        if (!examTemplate.value) {
            return;
        }

        // indicatorTemplates and CLIENT_GROUP_TEMPLATES have their own endpoints. The API
        // ignores them on the examTemplate update endpoint, so we need to send empty arrays.
        const examTemplateUpdated = await updateMutation.mutateData({
            ...examTemplate.value,
            ...patch,
            indicatorTemplates: [],
            CLIENT_GROUP_TEMPLATES: [],
        });

        if (!examTemplateUpdated) {
            // TODO andrei: proper error handling
            // eslint-disable-next-line no-console
            console.error(updateMutation.error.value);
            return;
        }

        examTemplate.value = examTemplateUpdated;
    };

    const handleBasicSettingsChange = (patch: BasicSettings) =>
        updateTemplate(patch);

    const handleScreenProctoringChange = ({
        enabled,
        collectionStrategy,
    }: {
        enabled: boolean;
        collectionStrategy?: ScreenProctoringCollectionStrategy;
    }) => {
        if (!examTemplate.value) {
            return;
        }

        // spsSEBGroupsSelection is deliberately not managed here, as this is owned by the backend
        return updateTemplate({
            EXAM_ATTRIBUTES: {
                ...examTemplate.value.EXAM_ATTRIBUTES,
                ...buildScreenProctoringExamAttributes({
                    enabled,
                    collectionStrategy,
                }),
            },
        });
    };

    return {
        examTemplateId,
        loading,
        notFound,
        errors,
        title,
        breadCrumb,
        indicators,
        availableSupervisors,
        selectedSupervisorIds,
        clientGroups,
        screenProctoring,
        basicSettings,
        updateTemplate,
        handleScreenProctoringChange,
        handleBasicSettingsChange,
    };
};
