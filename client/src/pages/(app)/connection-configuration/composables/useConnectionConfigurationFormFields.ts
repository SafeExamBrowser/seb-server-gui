import { computed, ref } from "vue";

import type { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useZodFormRules } from "@/composables/useZodFormRules.ts";
import i18n from "@/i18n";
import {
    connectionConfigurationCreateSchema,
    SEB_CONFIG_PURPOSES,
} from "@/models/connectionConfiguration.ts";
import { CONNECTION_CONFIG_FIELD } from "@/pages/(app)/connection-configuration/connectionConfigurationFormConfig.ts";

export const useConnectionConfigurationFormFields = () => {
    const { isRequired, fieldRules } = useZodFormRules();

    const name = ref<string | undefined>(undefined);
    const configurationPurpose = ref<string | undefined>("START_EXAM");
    const configurationPassword = ref<string | undefined>(undefined);
    const confirmConfigurationPassword = ref<string | undefined>(undefined);
    const encryptWithCertificate = ref<string | undefined>(undefined);
    const pingInterval = ref<number | undefined>(1);
    const asymmetricOnlyEncryption = ref<boolean>(false);

    const withFallback = ref<boolean>(false);
    const fallbackStartUrl = ref<string | undefined>(undefined);
    const connectionAttempts = ref<number | undefined>(5);
    const interval = ref<number | undefined>(2);
    const connectionTimeout = ref<number | undefined>(30);
    const fallbackPassword = ref<string | undefined>(undefined);
    const confirmFallbackPassword = ref<string | undefined>(undefined);
    const quitPassword = ref<string | undefined>(undefined);
    const confirmQuitPassword = ref<string | undefined>(undefined);

    // Static i18n keys (per the i18n rule), but the value set is derived from the schema
    // enum via a typed record — a new backend purpose forces a label here at compile time.
    const configurationPurposeLabels: Record<
        (typeof SEB_CONFIG_PURPOSES)[number],
        string
    > = {
        START_EXAM: i18n.global.t(
            "connectionConfigurations.selectValues.start_exam",
        ),
        CONFIGURE_CLIENT: i18n.global.t(
            "connectionConfigurations.selectValues.configure_client",
        ),
    };
    const configurationPurposeOptions = SEB_CONFIG_PURPOSES.map((value) => ({
        value,
        text: configurationPurposeLabels[value],
    }));

    const passwordsMatch = (a?: string, b?: string): true | string => {
        const av = (a ?? "").trim();
        const bv = (b ?? "").trim();
        if (!av && !bv) return true;
        if (!av || !bv) {
            return i18n.global.t("connectionConfigurations.validation.noMatch");
        }
        return (
            av === bv ||
            i18n.global.t("connectionConfigurations.validation.noMatch")
        );
    };

    const numberRule = (v: number | undefined): true | string => {
        if (v === undefined) {
            return i18n.global.t(
                "connectionConfigurations.validation.required",
            );
        }
        return (
            !Number.isNaN(Number(v)) ||
            i18n.global.t("connectionConfigurations.validation.mustBeNumber")
        );
    };

    const mainFormFields = computed<FormField[]>(() => [
        {
            type: "text" as const,
            name: CONNECTION_CONFIG_FIELD.name,
            model: name,
            label: i18n.global.t("connectionConfigurations.fields.name.label"),
            required: isRequired(
                connectionConfigurationCreateSchema.shape.name,
            ),
            rules: fieldRules(connectionConfigurationCreateSchema.shape.name),
        },
        {
            type: "select" as const,
            name: CONNECTION_CONFIG_FIELD.configurationPurpose,
            model: configurationPurpose,
            label: i18n.global.t(
                "connectionConfigurations.fields.configurationPurpose.label",
            ),
            options: configurationPurposeOptions,
            required: isRequired(
                connectionConfigurationCreateSchema.shape.sebConfigPurpose,
            ),
        },
        {
            type: "password" as const,
            name: CONNECTION_CONFIG_FIELD.configurationPassword,
            model: configurationPassword,
            label: i18n.global.t(
                "connectionConfigurations.fields.configurationPassword.label",
            ),
        },
        {
            type: "password" as const,
            name: CONNECTION_CONFIG_FIELD.confirmConfigurationPassword,
            model: confirmConfigurationPassword,
            label: i18n.global.t(
                "connectionConfigurations.fields.confirmConfigurationPassword.label",
            ),
            validationDependsOn: ["configurationPassword"],
            rules: [
                () =>
                    passwordsMatch(
                        configurationPassword.value,
                        confirmConfigurationPassword.value,
                    ),
            ],
        },
        {
            type: "number" as const,
            name: CONNECTION_CONFIG_FIELD.pingInterval,
            model: pingInterval,
            label: i18n.global.t(
                "connectionConfigurations.fields.pingInterval.label",
            ),
            required: true,
            rules: [numberRule],
        },
        {
            type: "switch" as const,
            name: CONNECTION_CONFIG_FIELD.asymmetricOnlyEncryption,
            model: asymmetricOnlyEncryption,
            label: i18n.global.t(
                "connectionConfigurations.fields.useAsymmetricOnlyEncryption.label",
            ),
        },
    ]);

    const fallbackFormFields = computed<FormField[]>(() => [
        {
            type: "text" as const,
            name: CONNECTION_CONFIG_FIELD.fallbackStartUrl,
            model: fallbackStartUrl,
            label: i18n.global.t(
                "connectionConfigurations.fields.fallbackStartUrl.label",
            ),
            required: true,
            rules: [
                (v: string | undefined) => {
                    if (!v || !v.trim()) {
                        return i18n.global.t(
                            "connectionConfigurations.validation.required",
                        );
                    }
                    const lower = v.trim().toLowerCase();
                    return (
                        lower.startsWith("http://") ||
                        lower.startsWith("https://") ||
                        i18n.global.t(
                            "connectionConfigurations.validation.mustBeWithUrl",
                        )
                    );
                },
            ],
        },
        {
            type: "number" as const,
            name: CONNECTION_CONFIG_FIELD.connectionAttempts,
            model: connectionAttempts,
            label: i18n.global.t(
                "connectionConfigurations.fields.connectionAttempts.label",
            ),
            required: true,
            rules: [numberRule],
        },
        {
            type: "number" as const,
            name: CONNECTION_CONFIG_FIELD.interval,
            model: interval,
            label: i18n.global.t(
                "connectionConfigurations.fields.interval.label",
            ),
            required: true,
            rules: [numberRule],
        },
        {
            type: "number" as const,
            name: CONNECTION_CONFIG_FIELD.connectionTimeout,
            model: connectionTimeout,
            label: i18n.global.t(
                "connectionConfigurations.fields.connectionTimeout.label",
            ),
            required: true,
            rules: [numberRule],
        },
        {
            type: "password" as const,
            name: CONNECTION_CONFIG_FIELD.fallbackPassword,
            model: fallbackPassword,
            label: i18n.global.t(
                "connectionConfigurations.fields.fallbackPassword.label",
            ),
        },
        {
            type: "password" as const,
            name: CONNECTION_CONFIG_FIELD.confirmFallbackPassword,
            model: confirmFallbackPassword,
            label: i18n.global.t(
                "connectionConfigurations.fields.confirmFallbackPassword.label",
            ),
            validationDependsOn: ["fallbackPassword"],
            rules: [
                () =>
                    passwordsMatch(
                        fallbackPassword.value,
                        confirmFallbackPassword.value,
                    ),
            ],
        },
        {
            type: "password" as const,
            name: CONNECTION_CONFIG_FIELD.quitPassword,
            model: quitPassword,
            label: i18n.global.t(
                "connectionConfigurations.fields.quitPassword.label",
            ),
        },
        {
            type: "password" as const,
            name: CONNECTION_CONFIG_FIELD.confirmQuitPassword,
            model: confirmQuitPassword,
            label: i18n.global.t(
                "connectionConfigurations.fields.confirmQuitPassword.label",
            ),
            validationDependsOn: ["quitPassword"],
            rules: [
                () =>
                    passwordsMatch(
                        quitPassword.value,
                        confirmQuitPassword.value,
                    ),
            ],
        },
    ]);

    return {
        mainFormFields,
        fallbackFormFields,
        name,
        configurationPurpose,
        configurationPassword,
        confirmConfigurationPassword,
        encryptWithCertificate,
        pingInterval,
        asymmetricOnlyEncryption,
        withFallback,
        fallbackStartUrl,
        connectionAttempts,
        interval,
        connectionTimeout,
        fallbackPassword,
        confirmFallbackPassword,
        quitPassword,
        confirmQuitPassword,
    };
};
