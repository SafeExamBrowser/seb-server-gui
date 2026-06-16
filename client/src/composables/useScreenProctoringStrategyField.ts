import { computed, Ref } from "vue";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import {
    SCREEN_PROCTORING_COLLECTION_STRATEGY,
    ScreenProctoringCollectionStrategy,
} from "@/models/seb-server/screenProctoring.ts";
import i18n from "@/i18n";

export const useScreenProctoringStrategyField = (
    model: Ref<ScreenProctoringCollectionStrategy | undefined>,
    options?: {
        disabled?: Ref<boolean>;
        required?: Ref<boolean>;
    },
) => {
    const info = computed<string | undefined>(() => {
        if (model.value === undefined) {
            return undefined;
        }

        return i18n.global.t(
            `screenProctoring.collectionStrategy.info.${model.value}`,
        );
    });

    const field = computed<FormField>(() => ({
        type: "select" as const,
        name: "screenProctoringCollectionStrategy",
        model,
        options: SCREEN_PROCTORING_COLLECTION_STRATEGY.map((enumValue) => ({
            value: enumValue,
            text: i18n.global.t(
                `screenProctoring.collectionStrategy.strategies.${enumValue}`,
            ),
        })),
        label: i18n.global.t("screenProctoring.collectionStrategy.label"),
        placeholder: i18n.global.t(
            "screenProctoring.collectionStrategy.placeholder",
        ),
        required: options?.required?.value ?? true,
        disabled: options?.disabled?.value ?? false,
        info: info.value,
    }));

    return { field };
};
