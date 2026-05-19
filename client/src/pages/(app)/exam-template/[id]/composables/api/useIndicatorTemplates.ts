import { computed } from "vue";
import { useFetch } from "@/composables/useFetch.ts";
import { useMutation } from "@/composables/useMutation.ts";
import { useNotificationsStore } from "@/stores/seb-server/notificationstore.ts";
import i18n from "@/i18n";
import {
    createIndicator,
    deleteIndicator,
    getIndicators,
    updateIndicator,
} from "@/services/seb-server/examTemplateIndicatorService.ts";
import { Indicator } from "@/components/widgets/indicatorsTable/types.ts";

export const useIndicatorTemplates = (examTemplateId: number) => {
    const notifications = useNotificationsStore();

    const {
        data,
        loading,
        error: fetchError,
    } = useFetch(() => getIndicators(examTemplateId), { immediate: true });

    const deleteMutation = useMutation((indicatorId: number) =>
        deleteIndicator(examTemplateId, indicatorId),
    );

    const indicators = computed<Indicator[]>(() => data.value ?? []);

    const errors = computed<string[]>(() =>
        fetchError.value ? [fetchError.value] : [],
    );

    const createItem = async (indicator: Indicator) => {
        const created = await createIndicator(examTemplateId, indicator);
        data.value = [...(data.value ?? []), created];
    };

    const updateItem = async (indicator: Indicator) => {
        const updated = await updateIndicator(examTemplateId, indicator);

        data.value = (data.value ?? []).map((existing) =>
            existing.id === updated.id ? updated : existing,
        );
    };

    const deleteItem = async (indicator: Indicator) => {
        await deleteMutation.mutateData(indicator.id);

        if (deleteMutation.error.value) {
            // TODO @andrei: rework this once error handling flow is ready
            notifications.serverError(
                i18n.global.t(
                    "examTemplateDetail.boxes.indicators.errors.deleteFailed",
                ),
                deleteMutation.error.value,
            );
            return;
        }

        data.value = (data.value ?? []).filter(
            (existing) => existing.id !== indicator.id,
        );
    };

    return {
        indicators,
        loading,
        errors,
        createItem,
        updateItem,
        deleteItem,
    };
};
