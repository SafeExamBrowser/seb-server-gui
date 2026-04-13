import { computed, ref, watch } from "vue";
import i18n from "@/i18n";
import type { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useInstitutions } from "@/composables/useInstitutions.ts";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore.ts";
import { LMSTypeEnum } from "@/models/seb-server/assessmentToolEnums.ts";

export type AuthMode = "client" | "token";

export const useAssessmentToolFormFields = () => {
    const institutionId = ref<string | undefined>(undefined);
    const name = ref<string | undefined>(undefined);
    const lmsType = ref<string | undefined>(undefined);
    const serverAddress = ref<string | undefined>(undefined);
    const authMode = ref<AuthMode>("token");
    const clientUsername = ref<string | undefined>(undefined);
    const clientPassword = ref<string | undefined>(undefined);
    const accessToken = ref<string | undefined>(undefined);
    const withProxy = ref<boolean>(false);
    const proxyHost = ref<string | undefined>(undefined);
    const proxyPort = ref<string | undefined>(undefined);
    const proxyUsername = ref<string | undefined>(undefined);
    const proxyPassword = ref<string | undefined>(undefined);

    watch(authMode, (mode) => {
        if (mode === "client") {
            accessToken.value = undefined;
        } else {
            clientUsername.value = undefined;
            clientPassword.value = undefined;
        }
    });

    const {
        data: institutions,
        loading: loadingInstitutions,
        error: errorInstitutions,
    } = useInstitutions();

    const authenticatedUser = useUserAccountStore().userAccount;

    watch(
        institutions,
        (data) => {
            if (!data) return;
            const userInstitutionId = String(authenticatedUser?.institutionId);
            const matched = data.find((i) => i.modelId === userInstitutionId);
            if (matched) {
                institutionId.value = matched.modelId;
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
                model: institutionId,
                label: t("labels.institutionLabel"),
                options: institutionOptions.value,
                required: true,
                disabled: true,
            },
            {
                type: "text" as const,
                name: "name",
                model: name,
                label: t("labels.nameLabel"),
                required: true,
            },
            {
                type: "select" as const,
                name: "lmsType",
                model: lmsType,
                label: t("labels.typeLabel"),
                options: lmsTypeOptions,
                required: true,
            },
            {
                type: "text" as const,
                name: "serverAddress",
                model: serverAddress,
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
                    model: clientUsername,
                    label: t("labels.assessmentToolServerUsernameLabel"),
                    required: true,
                },
                {
                    type: "password" as const,
                    name: "clientPassword",
                    model: clientPassword,
                    label: t("labels.assessmentToolServerPasswordLabel"),
                    required: true,
                },
            ];
        }
        return [
            {
                type: "password" as const,
                name: "accessToken",
                model: accessToken,
                label: t("labels.accessTokenLabel"),
                required: true,
            },
        ];
    });

    const proxyFormFields = computed<FormField[]>(() => [
        {
            type: "text" as const,
            name: "proxyHost",
            model: proxyHost,
            label: t("labels.proxyHostLabel"),
            required: true,
        },
        {
            type: "text" as const,
            name: "proxyPort",
            model: proxyPort,
            label: t("labels.proxyPortLabel"),
            required: true,
            rules: [
                (v: string | undefined) => {
                    if (!v) return t("validation.required");
                    const n = Number(v);
                    return (
                        (Number.isInteger(n) && n >= 1 && n <= 65535) ||
                        t("validation.invalidPort")
                    );
                },
            ],
        },
        {
            type: "text" as const,
            name: "proxyUsername",
            model: proxyUsername,
            label: t("labels.proxyUsernameLabel"),
            required: true,
        },
        {
            type: "password" as const,
            name: "proxyPassword",
            model: proxyPassword,
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
        institutionId,
        name,
        lmsType,
        serverAddress,
        clientUsername,
        clientPassword,
        accessToken,
        proxyHost,
        proxyPort,
        proxyUsername,
        proxyPassword,
    };
};
