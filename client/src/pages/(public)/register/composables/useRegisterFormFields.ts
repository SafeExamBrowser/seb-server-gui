import { computed, ref, watch } from "vue";
import moment from "moment-timezone";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types.ts";
import { useInstitutions } from "@/composables/useInstitutions.ts";
import { useZodFormRules } from "@/composables/useZodFormRules.ts";
import { userAccountCreateSchema } from "@/models/userAccount.ts";

const t = (key: string) => i18n.global.t(`userAccount.fields.${key}.label`);

const timezoneOptions = moment.tz
    .names()
    .map((tz) => ({ value: tz, text: tz }));

export const useRegisterFormFields = () => {
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

    const { isRequired, fieldRules } = useZodFormRules();
    const schema = userAccountCreateSchema;

    const { data: institutions, loading, error } = useInstitutions();
    const institutionSelectDisabled = ref(false);

    watch(
        institutions,
        (list) => {
            if (list && list.length === 1) {
                institutionId.value = list[0].modelId;
                institutionSelectDisabled.value = true;
            }
        },
        { immediate: true },
    );

    const institutionOptions = computed(() =>
        (institutions.value ?? []).map((institution) => ({
            value: institution.modelId,
            text: institution.name,
        })),
    );

    const errors = computed(() => (error.value ? [error.value] : []));

    const confirmPasswordRule = (value: string | undefined) =>
        value === password.value || i18n.global.t("validation.passwordsMatch");

    const fieldValidation = {
        institutionId: { required: isRequired(schema.shape.institutionId) },
        username: {
            required: isRequired(schema.shape.username),
            rules: fieldRules(schema.shape.username),
        },
        name: {
            required: isRequired(schema.shape.name),
            rules: fieldRules(schema.shape.name),
        },
        surname: {
            required: isRequired(schema.shape.surname),
            rules: fieldRules(schema.shape.surname),
        },
        email: {
            required: isRequired(schema.shape.email),
            rules: fieldRules(schema.shape.email),
        },
        timezone: { required: isRequired(schema.shape.timezone) },
        newPassword: {
            required: isRequired(schema.shape.newPassword),
            rules: fieldRules(schema.shape.newPassword),
        },
        confirmNewPassword: {
            required: isRequired(schema.shape.confirmNewPassword),
            rules: fieldRules(schema.shape.confirmNewPassword),
        },
    };

    const formFields = computed<FormField[]>(() => [
        {
            type: "select" as const,
            name: "institutionId",
            model: institutionId,
            label: t("institution"),
            options: institutionOptions.value,
            required: fieldValidation.institutionId.required,
            disabled: institutionSelectDisabled.value,
        },
        {
            type: "text" as const,
            name: "username",
            model: username,
            label: t("username"),
            required: fieldValidation.username.required,
            rules: fieldValidation.username.rules,
        },
        {
            type: "text" as const,
            name: "name",
            model: name,
            label: t("name"),
            required: fieldValidation.name.required,
            rules: fieldValidation.name.rules,
        },
        {
            type: "text" as const,
            name: "surname",
            model: surname,
            label: t("surname"),
            required: fieldValidation.surname.required,
            rules: fieldValidation.surname.rules,
        },
        {
            type: "text" as const,
            name: "email",
            model: email,
            label: t("email"),
            required: fieldValidation.email.required,
            rules: fieldValidation.email.rules,
        },
        {
            type: "select" as const,
            name: "timezone",
            model: timezone,
            label: t("timezone"),
            options: timezoneOptions,
            required: fieldValidation.timezone.required,
        },
        {
            type: "password" as const,
            name: "password",
            model: password,
            label: t("password"),
            required: fieldValidation.newPassword.required,
            rules: fieldValidation.newPassword.rules,
        },
        {
            type: "password" as const,
            name: "confirmPassword",
            model: confirmPassword,
            label: t("confirmPassword"),
            required: fieldValidation.confirmNewPassword.required,
            rules: [
                ...fieldValidation.confirmNewPassword.rules,
                confirmPasswordRule,
            ],
            validationDependsOn: ["password"],
        },
    ]);

    return {
        formFields,
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
    };
};
