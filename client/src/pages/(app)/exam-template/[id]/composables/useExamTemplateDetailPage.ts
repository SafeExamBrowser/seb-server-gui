import { computed } from "vue";
import { useRoute } from "vue-router";
import { z } from "zod";

import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";
import { useSupervisors } from "@/composables/useSupervisors.ts";
import i18n from "@/i18n";
import {
    type BasicSettings,
    type ExamTemplate,
    type IndicatorExisting,
} from "@/models/examTemplate.ts";
import { ClientGroupExisting } from "@/models/seb-server/examTemplate.ts";
import { SCREEN_PROCTORING_COLLECTION_STRATEGY } from "@/models/seb-server/screenProctoring.ts";
import { useEditExamTemplateMutation } from "@/pages/(app)/exam-template/api/useEditExamTemplateMutation.ts";
import { useExamTemplateQuery } from "@/pages/(app)/exam-template/api/useExamTemplateQuery.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { notify } from "@/services/notifications/notify.ts";

const idSchema = z.coerce.number().int().positive();

export const useExamTemplateDetailPage = () => {
    const route = useRoute("/(app)/exam-template/[id]/");
    const parseResult = idSchema.safeParse(route.params.id);
    const examTemplateId = parseResult.success ? parseResult.data : undefined;

    const {
        data: examTemplate,
        isLoading: examTemplateLoading,
        error: examTemplateQueryError,
    } = useExamTemplateQuery(
        computed(() =>
            examTemplateId !== undefined ? String(examTemplateId) : undefined,
        ),
    );
    const examTemplateError = computed(() =>
        toAppErrorOrUndefined(examTemplateQueryError.value),
    );

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
        screenProctoringEnabled:
            examTemplate.value?.EXAM_ATTRIBUTES?.enableScreenProctoring ===
            "true",
    }));

    const screenProctoring = {
        enabled: computed(() => basicSettings.value.screenProctoringEnabled),
        // templates that never stored a strategy (e.g. created with screen proctoring
        // disabled) render as APPLY_SEB_GROUPS - display only, never written back
        collectionStrategy: computed(
            () =>
                SCREEN_PROCTORING_COLLECTION_STRATEGY.find(
                    (strategy) =>
                        strategy ===
                        examTemplate.value?.EXAM_ATTRIBUTES
                            ?.spsCollectingStrategy,
                ) ?? "APPLY_SEB_GROUPS",
        ),
        fallbackGroupName: computed(
            () => examTemplate.value?.EXAM_ATTRIBUTES?.spsCollectingGroupName,
        ),
    };

    const updateMutation = useEditExamTemplateMutation();

    const updateTemplate = async (
        patch: Partial<
            Omit<ExamTemplate, "indicatorTemplates" | "CLIENT_GROUP_TEMPLATES">
        >,
    ) => {
        if (!examTemplate.value) {
            return;
        }

        try {
            // indicatorTemplates and CLIENT_GROUP_TEMPLATES have their own endpoints. The API
            // ignores them on the examTemplate update endpoint, so we need to send empty arrays.
            await updateMutation.mutateAsync({
                ...examTemplate.value,
                ...patch,
                indicatorTemplates: [],
                CLIENT_GROUP_TEMPLATES: [],
            });
        } catch (error) {
            notify.serverError(error, {
                contextLabel: "examtemplate",
            });
        }
    };

    const handleBasicSettingsChange = ({
        screenProctoringEnabled,
        ...patch
    }: BasicSettings) => {
        if (!examTemplate.value) {
            return;
        }

        const attributes = examTemplate.value.EXAM_ATTRIBUTES;

        // stored strategy/group name pass through verbatim; only enabling a template
        // that has no strategy yet writes one, so the backend does not fall back to
        // its legacy EXAM default
        const seedStrategy =
            screenProctoringEnabled && !attributes?.spsCollectingStrategy;

        return updateTemplate({
            ...patch,
            EXAM_ATTRIBUTES: {
                ...attributes,
                enableScreenProctoring: screenProctoringEnabled
                    ? "true"
                    : "false",
                ...(seedStrategy
                    ? { spsCollectingStrategy: "APPLY_SEB_GROUPS" }
                    : {}),
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
        handleBasicSettingsChange,
    };
};
