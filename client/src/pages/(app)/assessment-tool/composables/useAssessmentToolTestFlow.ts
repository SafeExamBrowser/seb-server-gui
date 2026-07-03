import { type Ref } from "vue";
import { notify } from "@/services/notifications/notify.ts";
import type { AppError } from "@/services/errors/types.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useI18n } from "vue-i18n";
import type { AssessmentToolTestResult } from "@/models/assessmentTool.ts";

export const useAssesmentToolTestFlow = (config: {
    run: (item: TableItem) => Promise<AssessmentToolTestResult>;
    error: Ref<AppError | undefined>;
    contextLabel: string;
}) => {
    const { t } = useI18n();

    const testAssessmentTool = async (item: TableItem) => {
        try {
            const result = await config.run(item);

            if (result.errors && result.errors.length > 0) {
                result.errors.forEach((err) =>
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
        } catch {
            notify.serverError(config.error.value, {
                contextLabel: config.contextLabel,
            });
        }
    };

    return {
        testAssessmentTool,
    };
};
