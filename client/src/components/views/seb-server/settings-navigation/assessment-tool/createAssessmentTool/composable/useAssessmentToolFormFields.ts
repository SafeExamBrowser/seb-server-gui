import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import i18n from "@/i18n";
import type { FormField } from "@/components/widgets/formBuilder/types";
import { useCreateAssessmentToolStore } from "./store/useCreateAssessmentToolStore";
import { useInstitutions } from "./api/useInstitutions";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";
import { LMSTypeEnum } from "@/models/seb-server/assessmentToolEnums";

export const useAssessmentToolFormFields = () => {
    const store = useCreateAssessmentToolStore();
    const {
        institutionId: modelInstitutionId,
        name: modelName,
        lmsType: modelLmsType,
        serverAddress: modelServerAddress,
        authMode,
        clientUsername: modelClientUsername,
        clientPassword: modelClientPassword,
        accessToken: modelAccessToken,
        withProxy,
        proxyHost: modelProxyHost,
        proxyPort: modelProxyPort,
        proxyUsername: modelProxyUsername,
        proxyPassword: modelProxyPassword,
    } = storeToRefs(store);

    const {
        data: institutions,
        loading: loadingInstitutions,
        error: errorInstitutions,
    } = useInstitutions();

    const authenticatedUser = useUserAccountStore().userAccount;
    const institutionSelectDisabled = ref(true);

    watch(
        institutions,
        (data) => {
            if (!data) return;
            const userInstitutionId = String(authenticatedUser?.institutionId);
            const matched = data.find((i) => i.modelId === userInstitutionId);
            if (matched) {
                modelInstitutionId.value = matched.modelId;
            }
        },
        { immediate: true },
    );

    const institutionOptions = computed(() =>
        (institutions.value ?? [])
            .filter(
                (i) => i.modelId === String(authenticatedUser?.institutionId),
            )
            .map((i) => ({ value: i.modelId, text: i.name })),
    );

    const lmsTypeOptions = Object.values(LMSTypeEnum).map((v) => ({
        value: v as string,
        text: i18n.global.t(`assessmentToolConnections.lmsTypes.${v}`),
    }));

    const t = (key: string) =>
        i18n.global.t(
            `assessmentToolConnections.createAssessmentToolConnectionsPage.${key}`,
        );

    const invalidPortMessage = t("validation.invalidPort");

    const loading = computed(() => loadingInstitutions.value);
    const errors = computed(() =>
        [errorInstitutions.value].filter((e) => e !== undefined),
    );

    const mainFormFields = computed<FormField[]>(() => {
        if (loading.value) return [];
        return [
            {
                type: "select" as const,
                name: "institutionId",
                model: modelInstitutionId,
                label: t("labels.institutionLabel"),
                options: institutionOptions.value,
                required: true,
                disabled: institutionSelectDisabled.value,
            },
            {
                type: "text" as const,
                name: "name",
                model: modelName,
                label: t("labels.nameLabel"),
                required: true,
            },
            {
                type: "select" as const,
                name: "lmsType",
                model: modelLmsType,
                label: t("labels.typeLabel"),
                options: lmsTypeOptions,
                required: true,
            },
            {
                type: "text" as const,
                name: "serverAddress",
                model: modelServerAddress,
                label: t("labels.assessmentToolServerAddressLabel"),
                required: true,
                rules: [
                    (v: string | undefined) =>
                        !v ||
                        /^https?:\/\//i.test(v) ||
                        t("validation.assessmentToolServerAddressLabel"),
                ],
            },
        ];
    });

    const authFormFields = computed<FormField[]>(() => {
        if (authMode.value === "client") {
            return [
                {
                    type: "text" as const,
                    name: "clientUsername",
                    model: modelClientUsername,
                    label: t("labels.assessmentToolServerUsernameLabel"),
                    required: true,
                },
                {
                    type: "password" as const,
                    name: "clientPassword",
                    model: modelClientPassword,
                    label: t("labels.assessmentToolServerPasswordLabel"),
                    required: true,
                },
            ];
        }
        return [
            {
                type: "password" as const,
                name: "accessToken",
                model: modelAccessToken,
                label: t("labels.accessTokenLabel"),
                required: true,
            },
        ];
    });

    const proxyFormFields = computed<FormField[]>(() => [
        {
            type: "text" as const,
            name: "proxyHost",
            model: modelProxyHost,
            label: t("labels.proxyHostLabel"),
            required: true,
        },
        {
            type: "text" as const,
            name: "proxyPort",
            model: modelProxyPort,
            label: t("labels.proxyPortLabel"),
            required: true,
            rules: [
                (v: string | undefined) => {
                    if (!v) return t("validation.required");
                    const n = Number(v);
                    return (
                        (Number.isInteger(n) && n >= 1 && n <= 65535) ||
                        invalidPortMessage
                    );
                },
            ],
        },
        {
            type: "text" as const,
            name: "proxyUsername",
            model: modelProxyUsername,
            label: t("labels.proxyUsernameLabel"),
            required: true,
        },
        {
            type: "password" as const,
            name: "proxyPassword",
            model: modelProxyPassword,
            label: t("labels.proxyPasswordLabel"),
            required: true,
        },
    ]);

    return {
        mainFormFields,
        authFormFields,
        proxyFormFields,
        authMode,
        withProxy,
        loading,
        errors,
    };
};
