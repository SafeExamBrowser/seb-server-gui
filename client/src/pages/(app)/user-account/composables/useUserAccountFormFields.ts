import { computed, ref, watch } from "vue";
import moment from "moment-timezone";
import { useRules } from "vuetify/labs/rules";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useInstitutions } from "@/composables/useInstitutions.ts";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore.ts";
import { UserRoleEnum } from "@/models/userRoleEnum.ts";

const timezoneOptions = moment.tz
    .names()
    .map((tz) => ({ value: tz, text: tz }));

export type UserAccountFormMode = "create" | "edit" | "profile";

const t = (key: string) => i18n.global.t(`userAccount.${key}`);

export const useUserAccountFormFields = (mode: UserAccountFormMode) => {
    const institutionId = ref<string | undefined>(undefined);
    const username = ref<string | undefined>(undefined);
    const name = ref<string | undefined>(undefined);
    const surname = ref<string | undefined>(undefined);
    const email = ref<string | undefined>(undefined);
    const timezone = ref<string | undefined>(
        Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
    const password = ref<string | undefined>(undefined);
    const confirmPassword = ref<string | undefined>(undefined);
    const role = ref<string | undefined>(undefined);

    const {
        data: institutions,
        loading: loadingInstitutions,
        error: errorInstitutions,
    } = useInstitutions();

    const authenticatedUser = useUserAccountStore().userAccount;
    const userRoles = authenticatedUser?.userRoles ?? [];
    const hasSebServerAdmin = userRoles.includes(UserRoleEnum.SEB_SERVER_ADMIN);
    const hasInstitutionalAdmin = userRoles.includes(
        UserRoleEnum.INSTITUTIONAL_ADMIN,
    );

    const institutionSelectDisabled = ref(
        !hasSebServerAdmin || mode !== "create",
    );

    watch(
        institutions,
        (data) => {
            if (!data || mode !== "create") return;
            if (!hasInstitutionalAdmin || hasSebServerAdmin) return;
            const userInstitutionId = String(authenticatedUser?.institutionId);
            const matched = data.find((i) => i.modelId === userInstitutionId);
            if (matched) {
                institutionId.value = matched.modelId;
                institutionSelectDisabled.value = true;
            }
        },
        { immediate: true },
    );

    const institutionOptions = computed(() =>
        (institutions.value ?? [])
            .filter(
                (i) =>
                    hasSebServerAdmin ||
                    i.modelId === String(authenticatedUser?.institutionId),
            )
            .map((i) => ({ value: i.modelId, text: i.name })),
    );

    const availableRoles = computed(() => {
        const allRoles = Object.values(UserRoleEnum).map((r) => ({
            value: r,
            text: i18n.global.t(`general.userRoles.${r}`),
        }));

        if (hasSebServerAdmin) {
            return allRoles.filter((r) =>
                [
                    UserRoleEnum.SEB_SERVER_ADMIN,
                    UserRoleEnum.INSTITUTIONAL_ADMIN,
                    UserRoleEnum.EXAM_ADMIN,
                    UserRoleEnum.EXAM_SUPPORTER,
                ].includes(r.value as UserRoleEnum),
            );
        }
        if (hasInstitutionalAdmin) {
            return allRoles.filter((r) =>
                [
                    UserRoleEnum.INSTITUTIONAL_ADMIN,
                    UserRoleEnum.EXAM_ADMIN,
                    UserRoleEnum.EXAM_SUPPORTER,
                ].includes(r.value as UserRoleEnum),
            );
        }
        return [];
    });

    const loading = computed(() => loadingInstitutions.value);
    const errors = computed(() =>
        [errorInstitutions.value].filter((e) => e !== undefined),
    );

    const leftFormFields = computed<FormField[]>(() => {
        if (loading.value) return [];

        const fields: FormField[] = [
            {
                type: "select" as const,
                name: "institutionId",
                model: institutionId,
                label: t("fields.institution.label"),
                options: institutionOptions.value,
                required: true,
                disabled: institutionSelectDisabled.value,
            },
            {
                type: "text" as const,
                name: "username",
                model: username,
                label: t("fields.username.label"),
                required: true,
            },
            {
                type: "text" as const,
                name: "name",
                model: name,
                label: t("fields.name.label"),
                required: true,
            },
            {
                type: "text" as const,
                name: "surname",
                model: surname,
                label: t("fields.surname.label"),
                required: true,
            },
            {
                type: "text" as const,
                name: "email",
                model: email,
                label: t("fields.email.label"),
                rules: [
                    (v: string | undefined) =>
                        !v ||
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
                        i18n.global.t(
                            "userAccount.general.validation.invalidEmail",
                        ),
                ],
            },
            {
                type: "select" as const,
                name: "timezone",
                model: timezone,
                label: t("fields.timezone.label"),
                options: timezoneOptions,
                required: true,
            },
        ];

        if (mode === "create") {
            fields.push(
                {
                    type: "password" as const,
                    name: "password",
                    model: password,
                    label: t("fields.password.label"),
                    required: true,
                    rules: [useRules().minLength(8)],
                },
                {
                    type: "password" as const,
                    name: "confirmPassword",
                    model: confirmPassword,
                    label: t("fields.confirmPassword.label"),
                    required: true,
                    validationDependsOn: ["password"],
                    rules: [
                        (v: string | undefined) =>
                            v === password.value ||
                            i18n.global.t(
                                "userAccount.general.validation.passwordsDontMatch",
                            ),
                    ],
                },
            );
        }

        return fields;
    });

    const rightFormFields = computed<FormField[]>(() => [
        {
            type: "select" as const,
            name: "role",
            model: role,
            label: t("fields.role.label"),
            options: availableRoles.value,
            required: true,
            disabled: mode === "profile",
        },
    ]);

    return {
        leftFormFields,
        rightFormFields,
        loading,
        errors,
        institutionId,
        username,
        name,
        surname,
        email,
        timezone,
        password,
        confirmPassword,
        role,
    };
};
