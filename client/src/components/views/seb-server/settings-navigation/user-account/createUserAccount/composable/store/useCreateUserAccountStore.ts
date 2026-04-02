import { defineStore } from "pinia";
import { ref } from "vue";

const getInitialState = () => ({
    institutionId: undefined as string | undefined,
    username: undefined as string | undefined,
    name: undefined as string | undefined,
    surname: undefined as string | undefined,
    email: undefined as string | undefined,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as
        | string
        | undefined,
    password: undefined as string | undefined,
    confirmPassword: undefined as string | undefined,
    role: undefined as string | undefined,
});

export const useCreateUserAccountStore = defineStore(
    "createUserAccount",
    () => {
        const institutionId = ref<string | undefined>(
            getInitialState().institutionId,
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
        const role = ref<string | undefined>(getInitialState().role);

        const $reset = () => {
            institutionId.value = getInitialState().institutionId;
            username.value = getInitialState().username;
            name.value = getInitialState().name;
            surname.value = getInitialState().surname;
            email.value = getInitialState().email;
            timezone.value = getInitialState().timezone;
            password.value = getInitialState().password;
            confirmPassword.value = getInitialState().confirmPassword;
            role.value = getInitialState().role;
        };

        return {
            institutionId,
            username,
            name,
            surname,
            email,
            timezone,
            password,
            confirmPassword,
            role,
            $reset,
        };
    },
);
