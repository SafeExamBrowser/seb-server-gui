import { computed, ref } from "vue";
import { useMutation } from "@/composables/useMutation.ts";
import { notify } from "@/services/notifications/notify.ts";
import i18n from "@/i18n";
import {
    createIndicator,
    deleteIndicator,
    updateIndicator,
} from "@/services/seb-server/examTemplateIndicatorService.ts";
import { Indicator } from "@/components/widgets/indicatorsTable/types.ts";

export const useIndicatorTemplates = (
    examTemplateId: number,
    initialIndicators: Indicator[],
) => {
    const data = ref<Indicator[]>([...initialIndicators]);

    const deleteMutation = useMutation((indicatorId: number) =>
        deleteIndicator(examTemplateId, indicatorId),
    );

    const indicators = computed<Indicator[]>(() => data.value);

    const createItem = async (indicator: Indicator) => {
        const created = await createIndicator(examTemplateId, indicator);
        data.value = [...data.value, created];
    };

    const updateItem = async (indicator: Indicator) => {
        const updated = await updateIndicator(examTemplateId, indicator);

        data.value = data.value.map((existing) =>
            existing.id === updated.id ? updated : existing,
        );
    };

    const deleteItem = async (indicator: Indicator) => {
        await deleteMutation.mutateData(indicator.id);

        if (deleteMutation.error.value) {
            notify.serverError(deleteMutation.error.value, {
                titleOverride: i18n.global.t(
                    "examTemplateDetail.boxes.indicators.errors.deleteFailed",
                ),
            });
            return;
        }

        data.value = data.value.filter(
            (existing) => existing.id !== indicator.id,
        );
    };

    return {
        indicators,
        createItem,
        updateItem,
        deleteItem,
    };
};
