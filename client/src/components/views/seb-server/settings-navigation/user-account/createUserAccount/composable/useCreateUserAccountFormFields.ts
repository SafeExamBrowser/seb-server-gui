import { computed, Ref } from "vue";
import { storeToRefs } from "pinia";
import { FormField } from "@/components/widgets/formBuilder/types";
import { useCreateUserAccountStore } from "../store/useCreateUserAccountStore";
import { translate } from "@/utils/generalUtils";
import { Institution } from "@/models/seb-server/institution";

type RoleOption = {
    label: string;
    value: string;
};

export const useCreateUserAccountFormFields = (
    institutions: Ref<Institution[]>,
    availableRoles: Ref<RoleOption[]>,
    timezoneOptions: Ref<string[]>,
) => {
    const store = useCreateUserAccountStore();

    const {
        selectedInstitution,
        username,
        name,
        surname,
        email,
        timezone,
        password,
        confirmPassword,
        selectedUserRole,
    } = storeToRefs(store);

    const requiredMessage = translate(
        "userAccount.general.validation.required",
    );
    const passwordTooShortMessage = translate(
        "userAccount.general.validation.passwordTooShort",
    );
    const passwordsDontMatchMessage = translate(
        "userAccount.general.validation.passwordsDontMatch",
    );
    const invalidEmailMessage = translate(
        "userAccount.general.validation.invalidEmail",
    );

    const requiredRule = (v: string | undefined) => !!v || requiredMessage;
    const passwordRule = (v: string | undefined) =>
        (v && v.length >= 8) || passwordTooShortMessage;
    const confirmPasswordRule = (v: string | undefined) =>
        v === password.value || passwordsDontMatchMessage;
    const emailRule = (v: string | undefined) =>
        !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || invalidEmailMessage;

    const formFields = computed<FormField[]>(() => [
        {
            type: "select",
            name: "selectedInstitution",
            model: selectedInstitution,
            label: translate(
                "userAccount.createUserAccountPage.labels.institutionLabel",
            ),
            required: true,
            rules: [requiredRule],
            options: institutions.value.map((institution) => ({
                value: institution.modelId,
                text: institution.name,
            })),
        },
        {
            type: "text",
            name: "username",
            model: username,
            label: translate(
                "userAccount.createUserAccountPage.labels.usernameLabel",
            ),
            required: true,
            rules: [requiredRule],
        },
        {
            type: "text",
            name: "name",
            model: name,
            label: translate(
                "userAccount.createUserAccountPage.labels.nameLabel",
            ),
            required: true,
            rules: [requiredRule],
        },
        {
            type: "text",
            name: "surname",
            model: surname,
            label: translate(
                "userAccount.createUserAccountPage.labels.surnameLabel",
            ),
            required: true,
            rules: [requiredRule],
        },
        {
            type: "text",
            name: "email",
            model: email,
            label: translate(
                "userAccount.createUserAccountPage.labels.emailLabel",
            ),
            rules: [emailRule],
        },
        {
            type: "select",
            name: "timezone",
            model: timezone,
            label: translate(
                "userAccount.createUserAccountPage.labels.timeZoneLabel",
            ),
            required: true,
            rules: [requiredRule],
            options: timezoneOptions.value.map((timezoneOption) => ({
                value: timezoneOption,
                text: timezoneOption,
            })),
        },
        {
            type: "text",
            name: "password",
            model: password,
            label: translate(
                "userAccount.createUserAccountPage.labels.passwordLabel",
            ),
            required: true,
            rules: [requiredRule, passwordRule],
        },
        {
            type: "text",
            name: "confirmPassword",
            model: confirmPassword,
            label: translate(
                "userAccount.createUserAccountPage.labels.confirmPasswordLabel",
            ),
            required: true,
            rules: [requiredRule, confirmPasswordRule],
        },
        {
            type: "select",
            name: "selectedUserRole",
            model: selectedUserRole,
            label: translate(
                "userAccount.createUserAccountPage.labels.selectRolesLabel",
            ),
            required: true,
            rules: [requiredRule],
            options: availableRoles.value.map((role) => ({
                value: role.value,
                text: role.label,
            })),
        },
    ]);

    return {
        formFields,
    };
};
