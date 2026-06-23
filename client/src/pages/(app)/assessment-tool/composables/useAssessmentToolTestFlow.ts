import { type Ref } from "vue";
import { notify } from "@/services/notifications/notify.ts";
import type { AppError } from "@/services/errors/types.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useI18n } from "vue-i18n";
import { AssessmentToolTestResult } from "@/models/seb-server/assessmentTool";

export const useAssesmentToolTestFlow = (config: {
    test: (item: TableItem) => Promise<void>;
    testResult: Ref<AssessmentToolTestResult | undefined>;
    error: Ref<AppError | undefined>;
    loading: Ref<boolean>;
    contextLabel: string;
}) => {
    const { t } = useI18n();

    const testAssessmentTool = async (item: TableItem) => {
        await config.test(item);

        if (config.error.value !== undefined) {
            notify.serverError(config.error.value, {
                contextLabel: config.contextLabel,
            });
            return;
        }

        if (
            config.testResult.value !== undefined &&
            config.testResult.value.errors.length > 0
        ) {
            config.testResult.value.errors.forEach((err) =>
                notify.warning(
                    t("assessmentToolConnections.test.error.title"),
                    t(
                        `assessmentToolConnections.test.error.message.${err.errorType}`,
                    ),
                ),
            );
            return;
        }

        notify.success(
            t("assessmentToolConnections.test.success.title"),
            t("assessmentToolConnections.test.success.message"),
        );
    };

    return {
        testAssessmentTool,
        statusErrors: config.error,
        statusLoading: config.loading,
    };
};
