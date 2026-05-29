import { computed, ref, watch } from "vue";
import moment from "moment-timezone";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useInstitutions } from "@/composables/useInstitutions.ts";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore.ts";
import { useZodFormRules } from "@/composables/useZodFormRules.ts";
import {
    USER_ROLES,
    UserRole,
    type UserAccountRole,
} from "@/models/userAccount.ts";
import {
    zUserInfo,
    zUserMod,
} from "@/api/seb-server/generated/hey-api/zod.gen.ts";

const ADMIN_VISIBLE_ROLES: ReadonlySet<UserAccountRole> = new Set([
    UserRole.SEB_SERVER_ADMIN,
    UserRole.INSTITUTIONAL_ADMIN,
    UserRole.EXAM_ADMIN,
    UserRole.EXAM_SUPPORTER,
]);

const INSTITUTIONAL_VISIBLE_ROLES: ReadonlySet<UserAccountRole> = new Set([
    UserRole.INSTITUTIONAL_ADMIN,
    UserRole.EXAM_ADMIN,
    UserRole.EXAM_SUPPORTER,
]);

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
    const role = ref<UserAccountRole | undefined>(undefined);

    const { isRequired, lengthRules, formatRules } = useZodFormRules();

    const {
        data: institutions,
        loading: loadingInstitutions,
        error: errorInstitutions,
    } = useInstitutions();

    const authenticatedUser = useUserAccountStore().userAccount;
    const userRoles = authenticatedUser?.userRoles ?? [];
    const hasSebServerAdmin = userRoles.includes(UserRole.SEB_SERVER_ADMIN);
    const hasInstitutionalAdmin = userRoles.includes(
        UserRole.INSTITUTIONAL_ADMIN,
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
        const allRoles = USER_ROLES.map((value) => ({
            value,
            text: i18n.global.t(`general.userRoles.${value}`),
        }));

        if (hasSebServerAdmin) {
            return allRoles.filter((r) => ADMIN_VISIBLE_ROLES.has(r.value));
        }
        if (hasInstitutionalAdmin) {
            return allRoles.filter((r) =>
                INSTITUTIONAL_VISIBLE_ROLES.has(r.value),
            );
        }
        return [];
    });

    const loading = computed(() => loadingInstitutions.value);
    const errors = computed(() =>
        [errorInstitutions.value].filter((e) => e !== undefined),
    );
    const confirmPasswordRule = (value: string | undefined) =>
        value === password.value ||
        i18n.global.t("userAccount.general.validation.passwordsDontMatch");

    const leftFormFields = computed<FormField[]>(() => {
        if (loading.value) return [];

        const fields: FormField[] = [
            {
                type: "select" as const,
                name: "institutionId",
                model: institutionId,
                label: t("fields.institution.label"),
                options: institutionOptions.value,
                required: isRequired(zUserInfo.shape.institutionId),
                disabled: institutionSelectDisabled.value,
            },
            {
                type: "text" as const,
                name: "username",
                model: username,
                label: t("fields.username.label"),
                required: isRequired(zUserInfo.shape.username),
                rules: lengthRules(zUserInfo.shape.username),
            },
            {
                type: "text" as const,
                name: "name",
                model: name,
                label: t("fields.name.label"),
                required: isRequired(zUserInfo.shape.name),
                rules: lengthRules(zUserInfo.shape.name),
            },
            {
                type: "text" as const,
                name: "surname",
                model: surname,
                label: t("fields.surname.label"),
                required: isRequired(zUserInfo.shape.surname),
                rules: lengthRules(zUserInfo.shape.surname),
            },
            {
                type: "text" as const,
                name: "email",
                model: email,
                label: t("fields.email.label"),
                required: isRequired(zUserInfo.shape.email),
                rules: [
                    ...lengthRules(zUserInfo.shape.email),
                    ...formatRules(zUserInfo.shape.email),
                ],
            },
            {
                type: "select" as const,
                name: "timezone",
                model: timezone,
                label: t("fields.timezone.label"),
                options: timezoneOptions,
                required: isRequired(zUserInfo.shape.timezone),
            },
        ];

        if (mode === "create") {
            fields.push(
                {
                    type: "password" as const,
                    name: "password",
                    model: password,
                    label: t("fields.password.label"),
                    required: isRequired(zUserMod.shape.newPassword),
                    rules: lengthRules(zUserMod.shape.newPassword),
                },
                {
                    type: "password" as const,
                    name: "confirmPassword",
                    model: confirmPassword,
                    label: t("fields.confirmPassword.label"),
                    required: isRequired(zUserMod.shape.confirmNewPassword),
                    rules: [confirmPasswordRule],
                    validationDependsOn: ["password"],
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
            required: isRequired(zUserMod.shape.userRoles),
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
