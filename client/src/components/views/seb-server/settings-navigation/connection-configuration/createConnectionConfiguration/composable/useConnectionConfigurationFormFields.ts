import { computed } from "vue";
import { storeToRefs } from "pinia";
import i18n from "@/i18n";
import type { FormField } from "@/components/widgets/formBuilder/types";
import { useCreateConnectionConfigurationStore } from "./store/useCreateConnectionConfigurationStore";

export const useConnectionConfigurationFormFields = () => {
    const store = useCreateConnectionConfigurationStore();
    const {
        name: modelName,
        configurationPurpose: modelConfigurationPurpose,
        configurationPassword: modelConfigurationPassword,
        confirmConfigurationPassword: modelConfirmConfigurationPassword,
        pingInterval: modelPingInterval,
        asymmetricOnlyEncryption: modelAsymmetricOnlyEncryption,
        withFallback,
        fallbackStartUrl: modelFallbackStartUrl,
        connectionAttempts: modelConnectionAttempts,
        interval: modelInterval,
        connectionTimeout: modelConnectionTimeout,
        fallbackPassword: modelFallbackPassword,
        confirmFallbackPassword: modelConfirmFallbackPassword,
        quitPassword: modelQuitPassword,
        confirmQuitPassword: modelConfirmQuitPassword,
    } = storeToRefs(store);

    const t = (key: string) =>
        i18n.global.t(
            `connectionConfigurations.createConnectionConfigurationPage.${key}`,
        );

    const requiredMessage = t("validation.required");
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
            model: modelName,
            label: t("labels.name"),
            required: true,
        },
        {
            type: "select" as const,
            name: "configurationPurpose",
            model: modelConfigurationPurpose,
            label: t("labels.configurationPurpose"),
            options: configurationPurposeOptions,
            required: true,
        },
        {
            type: "password" as const,
            name: "configurationPassword",
            model: modelConfigurationPassword,
            label: t("labels.configurationPassword"),
        },
        {
            type: "password" as const,
            name: "confirmConfigurationPassword",
            model: modelConfirmConfigurationPassword,
            label: t("labels.confirmConfigurationPassword"),
            validationDependsOn: ["configurationPassword"],
            rules: [
                () => {
                    const a = (modelConfigurationPassword.value ?? "").trim();
                    const b = (
                        modelConfirmConfigurationPassword.value ?? ""
                    ).trim();
                    if (!a && !b) return true;
                    if (!a || !b) return mustMatchMessage;
                    return a === b || mustMatchMessage;
                },
            ],
        },
        {
            type: "number" as const,
            name: "pingInterval",
            model: modelPingInterval,
            label: t("labels.pingInterval"),
            required: true,
            rules: [
                (v: number | undefined) => {
                    if (v == null) return requiredMessage;
                    if (Number.isNaN(Number(v))) return mustBeNumberMessage;
                    return true;
                },
            ],
        },
        {
            type: "switch" as const,
            name: "asymmetricOnlyEncryption",
            model: modelAsymmetricOnlyEncryption,
            label: t("labels.useAsymmetricOnlyEncryption"),
        },
    ]);

    const fallbackFormFields = computed<FormField[]>(() => [
        {
            type: "text" as const,
            name: "fallbackStartUrl",
            model: modelFallbackStartUrl,
            label: t("labels.fallbackStartURL"),
            required: true,
            rules: [
                (v: string | undefined) => {
                    if (!withFallback.value) return true;
                    if (!v || !v.trim()) return requiredMessage;
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
            model: modelConnectionAttempts,
            label: t("labels.connectionAttempts"),
            required: true,
            rules: [
                (v: number | undefined) => {
                    if (!withFallback.value) return true;
                    if (v == null) return requiredMessage;
                    return !Number.isNaN(Number(v)) || mustBeNumberMessage;
                },
            ],
        },
        {
            type: "number" as const,
            name: "interval",
            model: modelInterval,
            label: t("labels.interval"),
            required: true,
            rules: [
                (v: number | undefined) => {
                    if (!withFallback.value) return true;
                    if (v == null) return requiredMessage;
                    return !Number.isNaN(Number(v)) || mustBeNumberMessage;
                },
            ],
        },
        {
            type: "number" as const,
            name: "connectionTimeout",
            model: modelConnectionTimeout,
            label: t("labels.connectionTimeout"),
            required: true,
            rules: [
                (v: number | undefined) => {
                    if (!withFallback.value) return true;
                    if (v == null) return requiredMessage;
                    return !Number.isNaN(Number(v)) || mustBeNumberMessage;
                },
            ],
        },
        {
            type: "password" as const,
            name: "fallbackPassword",
            model: modelFallbackPassword,
            label: t("labels.fallbackPassword"),
        },
        {
            type: "password" as const,
            name: "confirmFallbackPassword",
            model: modelConfirmFallbackPassword,
            label: t("labels.confirmFallbackPassword"),
            validationDependsOn: ["fallbackPassword"],
            rules: [
                () => {
                    const a = (modelFallbackPassword.value ?? "").trim();
                    const b = (modelConfirmFallbackPassword.value ?? "").trim();
                    if (!a && !b) return true;
                    if (!a || !b) return mustMatchMessage;
                    return a === b || mustMatchMessage;
                },
            ],
        },
        {
            type: "password" as const,
            name: "quitPassword",
            model: modelQuitPassword,
            label: t("labels.quitPassword"),
        },
        {
            type: "password" as const,
            name: "confirmQuitPassword",
            model: modelConfirmQuitPassword,
            label: t("labels.confirmQuitPassword"),
            validationDependsOn: ["quitPassword"],
            rules: [
                () => {
                    const a = (modelQuitPassword.value ?? "").trim();
                    const b = (modelConfirmQuitPassword.value ?? "").trim();
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
        withFallback,
    };
};
