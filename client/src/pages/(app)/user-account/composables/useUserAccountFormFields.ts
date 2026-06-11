import { computed, ref, watch } from "vue";
import moment from "moment-timezone";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useInstitutions } from "@/composables/useInstitutions.ts";
import { useCurrentUserQuery } from "@/composables/useCurrentUser.ts";
import { useZodFormRules } from "@/composables/useZodFormRules.ts";
import {
    USER_ROLES,
    userAccountCreateSchema,
    userAccountSchema,
    type UserRole,
} from "@/models/userAccount.ts";

const ADMIN_VISIBLE_ROLES: ReadonlySet<UserRole> = new Set<UserRole>([
    "SEB_SERVER_ADMIN",
    "INSTITUTIONAL_ADMIN",
    "EXAM_ADMIN",
    "EXAM_SUPPORTER",
]);

const INSTITUTIONAL_VISIBLE_ROLES: ReadonlySet<UserRole> = new Set<UserRole>([
    "INSTITUTIONAL_ADMIN",
    "EXAM_ADMIN",
    "EXAM_SUPPORTER",
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
    const role = ref<UserRole | undefined>(undefined);

    const { isRequired, lengthRules, formatRules } = useZodFormRules();

    const sharedSchema =
        mode === "create" ? userAccountCreateSchema : userAccountSchema;

    const {
        data: institutions,
        loading: loadingInstitutions,
        error: errorInstitutions,
    } = useInstitutions();

    const { data: authenticatedUser } = useCurrentUserQuery();
    const userRoles = computed(() => authenticatedUser.value?.userRoles ?? []);
    const hasSebServerAdmin = computed(() =>
        userRoles.value.includes("SEB_SERVER_ADMIN"),
    );
    const hasInstitutionalAdmin = computed(() =>
        userRoles.value.includes("INSTITUTIONAL_ADMIN"),
    );

    const institutionSelectDisabled = ref(
        !hasSebServerAdmin.value || mode !== "create",
    );

    watch(
        institutions,
        (data) => {
            if (!data || mode !== "create") return;
            if (!hasInstitutionalAdmin.value || hasSebServerAdmin.value) return;
            const userInstitutionId = String(
                authenticatedUser.value?.institutionId,
            );
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
                    hasSebServerAdmin.value ||
                    i.modelId ===
                        String(authenticatedUser.value?.institutionId),
            )
            .map((i) => ({ value: i.modelId, text: i.name })),
    );

    const availableRoles = computed(() => {
        const allRoles = USER_ROLES.map((value) => ({
            value,
            text: i18n.global.t(`general.userRoles.${value}`),
        }));

        if (hasSebServerAdmin.value) {
            return allRoles.filter((r) => ADMIN_VISIBLE_ROLES.has(r.value));
        }
        if (hasInstitutionalAdmin.value) {
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
                required: isRequired(sharedSchema.shape.institutionId),
                disabled: institutionSelectDisabled.value,
            },
            {
                type: "text" as const,
                name: "username",
                model: username,
                label: t("fields.username.label"),
                required: isRequired(sharedSchema.shape.username),
                rules: lengthRules(sharedSchema.shape.username),
            },
            {
                type: "text" as const,
                name: "name",
                model: name,
                label: t("fields.name.label"),
                required: isRequired(sharedSchema.shape.name),
                rules: lengthRules(sharedSchema.shape.name),
            },
            {
                type: "text" as const,
                name: "surname",
                model: surname,
                label: t("fields.surname.label"),
                required: isRequired(sharedSchema.shape.surname),
                rules: lengthRules(sharedSchema.shape.surname),
            },
            {
                type: "text" as const,
                name: "email",
                model: email,
                label: t("fields.email.label"),
                required: isRequired(sharedSchema.shape.email),
                rules: [
                    ...lengthRules(sharedSchema.shape.email),
                    ...formatRules(sharedSchema.shape.email),
                ],
            },
            {
                type: "select" as const,
                name: "timezone",
                model: timezone,
                label: t("fields.timezone.label"),
                options: timezoneOptions,
                required: isRequired(sharedSchema.shape.timezone),
            },
        ];

        if (mode === "create") {
            fields.push(
                {
                    type: "password" as const,
                    name: "password",
                    model: password,
                    label: t("fields.password.label"),
                    required: isRequired(
                        userAccountCreateSchema.shape.newPassword,
                    ),
                    rules: lengthRules(
                        userAccountCreateSchema.shape.newPassword,
                    ),
                },
                {
                    type: "password" as const,
                    name: "confirmPassword",
                    model: confirmPassword,
                    label: t("fields.confirmPassword.label"),
                    required: isRequired(
                        userAccountCreateSchema.shape.confirmNewPassword,
                    ),
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
            required: isRequired(sharedSchema.shape.userRoles),
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
