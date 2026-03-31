import { defineStore } from "pinia";
import { ref } from "vue";

const getInitialState = () => ({
    isFormValid: false as boolean | null,
    selectedInstitution: undefined as string | undefined,
    username: undefined as string | undefined,
    name: undefined as string | undefined,
    surname: undefined as string | undefined,
    email: undefined as string | undefined,
    timezone: undefined as string | undefined,
    password: undefined as string | undefined,
    confirmPassword: undefined as string | undefined,
    selectedUserRole: undefined as string | undefined,
});

export const useCreateUserAccountStore = defineStore(
    "createUserAccount",
    () => {
        const isFormValid = ref<boolean | null>(getInitialState().isFormValid);
        const selectedInstitution = ref<string | undefined>(
            getInitialState().selectedInstitution,
        );
        const username = ref<string | undefined>(getInitialState().username);
        const name = ref<string | undefined>(getInitialState().name);
        const surname = ref<string | undefined>(getInitialState().surname);
        const email = ref<string | undefined>(getInitialState().email);
        const timezone = ref<string | undefined>(getInitialState().timezone);
        const password = ref<string | undefined>(getInitialState().password);
        const confirmPassword = ref<string | undefined>(
            getInitialState().confirmPassword,
        );
        const selectedUserRole = ref<string | undefined>(
            getInitialState().selectedUserRole,
        );

        const $reset = () => {
            isFormValid.value = getInitialState().isFormValid;
            selectedInstitution.value = getInitialState().selectedInstitution;
            username.value = getInitialState().username;
            name.value = getInitialState().name;
            surname.value = getInitialState().surname;
            email.value = getInitialState().email;
            timezone.value = getInitialState().timezone;
            password.value = getInitialState().password;
            confirmPassword.value = getInitialState().confirmPassword;
            selectedUserRole.value = getInitialState().selectedUserRole;
        };

        return {
            isFormValid,
            selectedInstitution,
            username,
            name,
            surname,
            email,
            timezone,
            password,
            confirmPassword,
            selectedUserRole,
            $reset,
        };
    },
);
