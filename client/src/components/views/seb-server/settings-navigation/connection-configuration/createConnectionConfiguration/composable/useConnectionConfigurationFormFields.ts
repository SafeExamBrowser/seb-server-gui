import { computed, ref } from "vue";
import i18n from "@/i18n";
import type { FormField } from "@/components/widgets/formBuilder/types";

export const useConnectionConfigurationFormFields = () => {
    const name = ref<string | undefined>(undefined);
    const configurationPurpose = ref<string | undefined>(undefined);
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

    const t = (key: string) =>
        i18n.global.t(
            `connectionConfigurations.createConnectionConfigurationPage.${key}`,
        );

    const mustMatchMessage = t("validation.noMatch");
    const mustBeNumberMessage = t("validation.mustBeNumber");
    const mustBeUrlMessage = t("validation.mustBeWithUrl");

    const configurationPurposeOptions = [
        {
            value: "START_EXAM",
            text: t("selectValues.start_exam"),
        },
        {
            value: "CONFIGURE_CLIENT",
            text: t("selectValues.configure_client"),
        },
    ];

    const mainFormFields = computed<FormField[]>(() => [
        {
            type: "text" as const,
            name: "name",
            model: name,
            label: t("labels.name"),
            required: true,
        },
        {
            type: "select" as const,
            name: "configurationPurpose",
            model: configurationPurpose,
            label: t("labels.configurationPurpose"),
            options: configurationPurposeOptions,
            required: true,
        },
        {
            type: "password" as const,
            name: "configurationPassword",
            model: configurationPassword,
            label: t("labels.configurationPassword"),
        },
        {
            type: "password" as const,
            name: "confirmConfigurationPassword",
            model: confirmConfigurationPassword,
            label: t("labels.confirmConfigurationPassword"),
            validationDependsOn: ["configurationPassword"],
            rules: [
                () => {
                    const a = (configurationPassword.value ?? "").trim();
                    const b = (confirmConfigurationPassword.value ?? "").trim();
                    if (!a && !b) return true;
                    if (!a || !b) return mustMatchMessage;
                    return a === b || mustMatchMessage;
                },
            ],
        },
        {
            type: "number" as const,
            name: "pingInterval",
            model: pingInterval,
            label: t("labels.pingInterval"),
            required: true,
            rules: [
                (v: number | undefined) => {
                    if (v == null) return t("validation.required");
                    if (Number.isNaN(Number(v))) return mustBeNumberMessage;
                    return true;
                },
            ],
        },
        {
            type: "switch" as const,
            name: "asymmetricOnlyEncryption",
            model: asymmetricOnlyEncryption,
            label: t("labels.useAsymmetricOnlyEncryption"),
        },
    ]);

    const fallbackFormFields = computed<FormField[]>(() => [
        {
            type: "text" as const,
            name: "fallbackStartUrl",
            model: fallbackStartUrl,
            label: t("labels.fallbackStartURL"),
            required: true,
            rules: [
                (v: string | undefined) => {
                    if (!v || !v.trim()) return t("validation.required");
                    const lower = v.trim().toLowerCase();
                    return (
                        lower.startsWith("http://") ||
                        lower.startsWith("https://") ||
                        mustBeUrlMessage
                    );
                },
            ],
        },
        {
            type: "number" as const,
            name: "connectionAttempts",
            model: connectionAttempts,
            label: t("labels.connectionAttempts"),
            required: true,
            rules: [
                (v: number | undefined) => {
                    if (v == null) return t("validation.required");
                    return !Number.isNaN(Number(v)) || mustBeNumberMessage;
                },
            ],
        },
        {
            type: "number" as const,
            name: "interval",
            model: interval,
            label: t("labels.interval"),
            required: true,
            rules: [
                (v: number | undefined) => {
                    if (v == null) return t("validation.required");
                    return !Number.isNaN(Number(v)) || mustBeNumberMessage;
                },
            ],
        },
        {
            type: "number" as const,
            name: "connectionTimeout",
            model: connectionTimeout,
            label: t("labels.connectionTimeout"),
            required: true,
            rules: [
                (v: number | undefined) => {
                    if (v == null) return t("validation.required");
                    return !Number.isNaN(Number(v)) || mustBeNumberMessage;
                },
            ],
        },
        {
            type: "password" as const,
            name: "fallbackPassword",
            model: fallbackPassword,
            label: t("labels.fallbackPassword"),
        },
        {
            type: "password" as const,
            name: "confirmFallbackPassword",
            model: confirmFallbackPassword,
            label: t("labels.confirmFallbackPassword"),
            validationDependsOn: ["fallbackPassword"],
            rules: [
                () => {
                    const a = (fallbackPassword.value ?? "").trim();
                    const b = (confirmFallbackPassword.value ?? "").trim();
                    if (!a && !b) return true;
                    if (!a || !b) return mustMatchMessage;
                    return a === b || mustMatchMessage;
                },
            ],
        },
        {
            type: "password" as const,
            name: "quitPassword",
            model: quitPassword,
            label: t("labels.quitPassword"),
        },
        {
            type: "password" as const,
            name: "confirmQuitPassword",
            model: confirmQuitPassword,
            label: t("labels.confirmQuitPassword"),
            validationDependsOn: ["quitPassword"],
            rules: [
                () => {
                    const a = (quitPassword.value ?? "").trim();
                    const b = (confirmQuitPassword.value ?? "").trim();
                    if (!a && !b) return true;
                    if (!a || !b) return mustMatchMessage;
                    return a === b || mustMatchMessage;
                },
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
