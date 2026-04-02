import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import moment from "moment-timezone";
import { useRules } from "vuetify/labs/rules";
import i18n from "@/i18n";
import { FormField } from "@/components/widgets/formBuilder/types";
import { useCreateUserAccountStore } from "./store/useCreateUserAccountStore";
import { useInstitutions } from "./api/useInstitutions";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore";
import { UserRoleEnum } from "@/models/userRoleEnum";

const timezoneOptions = moment.tz
    .names()
    .map((tz) => ({ value: tz, text: tz }));

export const useFormFields = () => {
    const {
        institutionId: modelInstitutionId,
        username: modelUsername,
        name: modelName,
        surname: modelSurname,
        email: modelEmail,
        timezone: modelTimezone,
        password: modelPassword,
        confirmPassword: modelConfirmPassword,
        role: modelRole,
    } = storeToRefs(useCreateUserAccountStore());

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

    const institutionSelectDisabled = ref(!hasSebServerAdmin);

    watch(
        institutions,
        (data) => {
            if (!data || !hasInstitutionalAdmin || hasSebServerAdmin) return;
            const userInstitutionId = String(authenticatedUser?.institutionId);
            const matched = data.find((i) => i.modelId === userInstitutionId);
            if (matched) {
                modelInstitutionId.value = matched.modelId;
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
        const allRoles = Object.values(UserRoleEnum).map((role) => ({
            value: role,
            text: i18n.global.t(`general.userRoles.${role}`),
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

        return [
            {
                type: "select" as const,
                name: "institutionId",
                model: modelInstitutionId,
                label: i18n.global.t(
                    "userAccount.createUserAccountPage.labels.institutionLabel",
                ),
                options: institutionOptions.value,
                required: true,
                disabled: institutionSelectDisabled.value,
            },
            {
                type: "text" as const,
                name: "username",
                model: modelUsername,
                label: i18n.global.t(
                    "userAccount.createUserAccountPage.labels.usernameLabel",
                ),
                required: true,
            },
            {
                type: "text" as const,
                name: "name",
                model: modelName,
                label: i18n.global.t(
                    "userAccount.createUserAccountPage.labels.nameLabel",
                ),
                required: true,
            },
            {
                type: "text" as const,
                name: "surname",
                model: modelSurname,
                label: i18n.global.t(
                    "userAccount.createUserAccountPage.labels.surnameLabel",
                ),
                required: true,
            },
            {
                type: "text" as const,
                name: "email",
                model: modelEmail,
                label: i18n.global.t(
                    "userAccount.createUserAccountPage.labels.emailLabel",
                ),
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
                model: modelTimezone,
                label: i18n.global.t(
                    "userAccount.createUserAccountPage.labels.timeZoneLabel",
                ),
                options: timezoneOptions,
                required: true,
            },
            {
                type: "password" as const,
                name: "password",
                model: modelPassword,
                label: i18n.global.t(
                    "userAccount.createUserAccountPage.labels.passwordLabel",
                ),
                required: true,
                rules: [useRules().minLength(8)],
            },
            {
                type: "password" as const,
                name: "confirmPassword",
                model: modelConfirmPassword,
                label: i18n.global.t(
                    "userAccount.createUserAccountPage.labels.confirmPasswordLabel",
                ),
                required: true,
                validationDependsOn: ["password"],
                rules: [
                    (v: string | undefined) =>
                        v === modelPassword.value ||
                        i18n.global.t(
                            "userAccount.general.validation.passwordsDontMatch",
                        ),
                ],
            },
        ];
    });

    const rightFormFields = computed<FormField[]>(() => [
        {
            type: "select" as const,
            name: "role",
            model: modelRole,
            label: i18n.global.t(
                "userAccount.createUserAccountPage.labels.selectRolesLabel",
            ),
            options: availableRoles.value,
            required: true,
        },
    ]);

    return {
        leftFormFields,
        rightFormFields,
        loading,
        errors,
    };
};
