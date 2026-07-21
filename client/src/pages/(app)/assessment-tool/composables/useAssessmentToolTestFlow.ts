import { type Ref } from "vue";
import { useI18n } from "vue-i18n";

import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import type { AssessmentToolTestResult } from "@/models/assessmentTool.ts";
import type { AppError } from "@/services/errors/types.ts";
import { notify } from "@/services/notifications/notify.ts";

// Static per-errorType message keys: the directive forbids programmatically assembled i18n
// keys, and errorType is optional on the wire, so an unmapped/absent value must fall back to
// the backend-provided message instead of rendering a raw missing key.
const TEST_ERROR_MESSAGE_KEYS = {
    API_NOT_SUPPORTED:
        "assessmentToolConnections.test.error.message.API_NOT_SUPPORTED",
    MISSING_ATTRIBUTE:
        "assessmentToolConnections.test.error.message.MISSING_ATTRIBUTE",
    TOKEN_REQUEST: "assessmentToolConnections.test.error.message.TOKEN_REQUEST",
    QUIZ_ACCESS_API_REQUEST:
        "assessmentToolConnections.test.error.message.QUIZ_ACCESS_API_REQUEST",
    QUIZ_RESTRICTION_API_REQUEST:
        "assessmentToolConnections.test.error.message.QUIZ_RESTRICTION_API_REQUEST",
    TEMPLATE_CREATION:
        "assessmentToolConnections.test.error.message.TEMPLATE_CREATION",
    APPLY_FULL_INTEGRATION:
        "assessmentToolConnections.test.error.message.APPLY_FULL_INTEGRATION",
} as const;

type TestError = NonNullable<AssessmentToolTestResult["errors"]>[number];

export const useAssessmentToolTestFlow = (config: {
    run: (item: TableItem) => Promise<AssessmentToolTestResult>;
    error: Ref<AppError | undefined>;
    contextLabel: string;
}) => {
    const { t } = useI18n();

    const errorBody = (err: TestError): string => {
        const key = err.errorType
            ? TEST_ERROR_MESSAGE_KEYS[err.errorType]
            : undefined;
        if (key) {
            return t(key);
        }
        // Unknown/absent errorType: surface the backend message rather than a raw key.
        return (
            err.errorMessage || t("assessmentToolConnections.test.error.title")
        );
    };

    const testAssessmentTool = async (item: TableItem) => {
        try {
            const result = await config.run(item);

            if (result.errors && result.errors.length > 0) {
                result.errors.forEach((err) =>
                    notify.warning(
                        t("assessmentToolConnections.test.error.title"),
                        errorBody(err),
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
