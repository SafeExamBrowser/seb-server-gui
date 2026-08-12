import { computed, type Ref } from "vue";

import i18n from "@/i18n";
import type { Indicator, IndicatorExisting } from "@/models/examTemplate.ts";
import { useCreateIndicatorTemplateMutation } from "@/pages/(app)/exam-template/api/useCreateIndicatorTemplateMutation.ts";
import { useDeleteIndicatorTemplateMutation } from "@/pages/(app)/exam-template/api/useDeleteIndicatorTemplateMutation.ts";
import { useSaveIndicatorTemplateMutation } from "@/pages/(app)/exam-template/api/useSaveIndicatorTemplateMutation.ts";
import { notify } from "@/services/notifications/notify.ts";

export const useIndicators = (
    examTemplateId: number,
    indicators: Readonly<Ref<IndicatorExisting[]>>,
) => {
    const createMutation = useCreateIndicatorTemplateMutation();
    const saveMutation = useSaveIndicatorTemplateMutation();
    const deleteMutation = useDeleteIndicatorTemplateMutation();

    const createItem = async (indicator: Indicator) => {
        await createMutation.mutateAsync({ examTemplateId, indicator });
    };

    const updateItem = async (indicator: IndicatorExisting) => {
        await saveMutation.mutateAsync({ examTemplateId, indicator });
    };

    const deleteItem = async (indicator: IndicatorExisting) => {
        try {
            await deleteMutation.mutateAsync({
                examTemplateId,
                indicatorId: indicator.id,
            });
        } catch (error) {
            notify.serverError(error, {
                titleOverride: i18n.global.t(
                    "examTemplateDetail.boxes.indicators.errors.deleteFailed",
                ),
            });
        }
    };

    return {
        indicators: computed(() => indicators.value),
        createItem,
        updateItem,
        deleteItem,
    };
};
