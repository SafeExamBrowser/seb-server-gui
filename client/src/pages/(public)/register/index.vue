<template>
    <v-main data-testid="register-page-container">
        <v-container class="fill-height d-flex align-center justify-center">
            <v-row class="w-100 justify-center">
                <v-col cols="12" lg="8" md="6" sm="6">
                    <v-card class="pa-8">
                        <div class="d-flex ml-15 mr-15 justify-center">
                            <img
                                alt="SEB Logo"
                                class="w-100 mb-4"
                                style="max-width: 150px; height: auto"
                                src="/img/seb-logo-no-border.png"
                            />
                        </div>
                        <div class="d-flex ml-15 mr-15 mt-5 justify-center">
                            <div class="text-title-large">
                                {{
                                    translate("userAccount.registerPage.title")
                                }}
                            </div>
                        </div>

                        <div class="mt-10">
                            <div
                                v-if="registerSuccess"
                                data-testid="register-success-alert"
                            >
                                <AlertMsg
                                    :alert-props="{
                                        title: '',
                                        color: 'success',
                                        type: 'alert',
                                        textKey: 'register-success',
                                    }"
                                >
                                </AlertMsg>
                            </div>
                        </div>

                        <v-card-title class="mt-10">
                            {{ translate("titles.register") }}
                        </v-card-title>
                        <v-card-subtitle
                            >{{
                                translate(
                                    "userAccount.registerPage.info.accountRegistrationInfo",
                                )
                            }}
                        </v-card-subtitle>

                        <v-card-text class="pt-12">
                            <v-form ref="formRef" @keyup.enter="register()">
                                <v-row density="compact">
                                    <v-col cols="12">
                                        <v-select
                                            v-model="selectedInstitution"
                                            data-testid="register-institution-select"
                                            density="compact"
                                            :disabled="
                                                institutionSelectDisabled
                                            "
                                            :error-messages="
                                                backendFieldErrors.selectedInstitution
                                            "
                                            item-title="name"
                                            item-value="modelId"
                                            :items="institutions ?? []"
                                            :label="
                                                translate(
                                                    'userAccount.registerPage.labels.institutionLabel',
                                                )
                                            "
                                            prepend-inner-icon="mdi-domain"
                                            :required="institutionRequired"
                                            :rules="institutionRules"
                                            variant="outlined"
                                            @update:model-value="
                                                handleInstitutionInput
                                            "
                                        />
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="username"
                                            data-testid="register-username-input"
                                            density="compact"
                                            :error-messages="
                                                backendFieldErrors.username
                                            "
                                            :label="
                                                translate(
                                                    'userAccount.registerPage.labels.usernameLabel',
                                                )
                                            "
                                            prepend-inner-icon="mdi-account-outline"
                                            :required="usernameRequired"
                                            :rules="usernameRules"
                                            variant="outlined"
                                            @update:model-value="
                                                handleUsernameInput
                                            "
                                        />
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="name"
                                            data-testid="register-name-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'userAccount.registerPage.labels.nameLabel',
                                                )
                                            "
                                            prepend-inner-icon="mdi-account-outline"
                                            :required="nameRequired"
                                            :rules="nameRules"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="surname"
                                            data-testid="register-surname-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'userAccount.registerPage.labels.surnameLabel',
                                                )
                                            "
                                            prepend-inner-icon="mdi-account-outline"
                                            :required="surnameRequired"
                                            :rules="surnameRules"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="email"
                                            data-testid="register-email-input"
                                            density="compact"
                                            :error-messages="
                                                backendFieldErrors.email
                                            "
                                            :label="
                                                translate(
                                                    'userAccount.registerPage.labels.emailLabel',
                                                )
                                            "
                                            prepend-inner-icon="mdi-email-outline"
                                            :required="emailRequired"
                                            :rules="emailRules"
                                            validate-on="blur"
                                            variant="outlined"
                                            @update:model-value="
                                                handleEmailInput
                                            "
                                        />
                                    </v-col>

                                    <v-col cols="12">
                                        <v-select
                                            v-model="timezone"
                                            data-testid="register-timezone-select"
                                            density="compact"
                                            :items="timezoneOptions"
                                            :label="
                                                translate(
                                                    'userAccount.registerPage.labels.timeZoneLabel',
                                                )
                                            "
                                            prepend-inner-icon="mdi-map-clock-outline"
                                            :required="timezoneRequired"
                                            :return-object="false"
                                            :rules="timezoneRules"
                                            variant="outlined"
                                        />
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="password"
                                            data-testid="register-password-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'userAccount.registerPage.labels.passwordLabel',
                                                )
                                            "
                                            prepend-inner-icon="mdi-lock-outline"
                                            :required="passwordRequired"
                                            :rules="passwordRules"
                                            :type="
                                                passwordVisible
                                                    ? 'text'
                                                    : 'password'
                                            "
                                            validate-on="blur"
                                            variant="outlined"
                                        >
                                            <template #append-inner>
                                                <v-btn
                                                    data-testid="register-password-toggle"
                                                    density="compact"
                                                    :icon="
                                                        passwordVisible
                                                            ? 'mdi-eye-off'
                                                            : 'mdi-eye'
                                                    "
                                                    variant="text"
                                                    @click="
                                                        passwordVisible =
                                                            !passwordVisible
                                                    "
                                                />
                                            </template>
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="confirmPassword"
                                            class="mb-2"
                                            data-testid="register-confirmPassword-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'userAccount.registerPage.labels.confirmPasswordLabel',
                                                )
                                            "
                                            prepend-inner-icon="mdi-lock-outline"
                                            :required="confirmPasswordRequired"
                                            :rules="confirmPasswordRules"
                                            :type="
                                                confirmPasswordVisible
                                                    ? 'text'
                                                    : 'password'
                                            "
                                            validate-on="blur"
                                            variant="outlined"
                                        >
                                            <template #append-inner>
                                                <v-btn
                                                    data-testid="register-confirmPassword-toggle"
                                                    density="compact"
                                                    :icon="
                                                        confirmPasswordVisible
                                                            ? 'mdi-eye-off'
                                                            : 'mdi-eye'
                                                    "
                                                    variant="text"
                                                    @click="
                                                        confirmPasswordVisible =
                                                            !confirmPasswordVisible
                                                    "
                                                />
                                            </template>
                                        </v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-btn
                                            block
                                            color="primary"
                                            data-testid="register-submit-btn"
                                            rounded="sm"
                                            :loading="registerLoading"
                                            @click="register"
                                        >
                                            Register
                                        </v-btn>
                                    </v-col>
                                </v-row>

                                <div class="text-center mt-7">
                                    <span>{{
                                        translate(
                                            "userAccount.registerPage.info.alreadyHaveAccount",
                                        )
                                    }}</span>
                                    <span
                                        class="text-decoration-underline"
                                        role="button"
                                        tabindex="0"
                                        data-testid="register-login-link"
                                        @keydown="
                                            handleTabKeyEvent(
                                                $event,
                                                'navigate',
                                            )
                                        "
                                    >
                                        <RouterLink
                                            :to="{
                                                name: '/(public)/login/',
                                            }"
                                            >{{
                                                translate(
                                                    "userAccount.registerPage.buttons.login",
                                                )
                                            }}</RouterLink
                                        >
                                    </span>
                                </div>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import moment from "moment-timezone";
import { translate } from "@/utils/generalUtils";
import { useInstitutions } from "@/composables/useInstitutions";
import { useRegisterUserAccountMutation } from "@/pages/(app)/user-account/api/useRegisterUserAccountMutation.ts";
import { useZodFormRules } from "@/composables/useZodFormRules.ts";
import { userAccountCreateSchema } from "@/models/userAccount.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import {
    buildBackendFieldErrorMap,
    hasOnlyHandledFieldErrors,
    type ApplyBackendErrorsResult,
} from "@/services/errors/formErrorMapping.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import type {
    BackendFieldAliasMap,
    BackendFieldErrorMap,
} from "@/services/errors/types.ts";
import { RouterLink, useRouter } from "vue-router";
import AlertMsg from "@/components/widgets/AlertMsg.vue";

const REGISTER_FIELD_ALIASES = {
    institutionId: "selectedInstitution",
} satisfies BackendFieldAliasMap;
const REGISTER_FIELD_NAMES = ["selectedInstitution", "username", "email"];

definePage({
    meta: {
        pageTestId: "register-page",
    },
});

const router = useRouter();

const selectedInstitution = ref<string>("");
const name = ref<string>("");
const surname = ref<string>("");
const username = ref<string>("");
const email = ref<string>();
const timezone = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");

const passwordVisible = ref<boolean>(false);
const confirmPasswordVisible = ref<boolean>(false);

const timezoneOptions = moment.tz.names();

const { data: institutions } = useInstitutions();
const institutionSelectDisabled = ref(false);

watch(
    institutions,
    (list) => {
        if (list && list.length === 1) {
            selectedInstitution.value = list[0].modelId;
            institutionSelectDisabled.value = true;
        }
    },
    { immediate: true },
);

const {
    mutateAsync: submitRegister,
    data: registered,
    isPending: registerLoading,
    error: registerSubmitError,
} = useRegisterUserAccountMutation();

const registerError = computed(() =>
    toAppErrorOrUndefined(registerSubmitError.value),
);
const registerSuccess = computed(() => !!registered.value);

const backendFieldErrors = ref<BackendFieldErrorMap>({});

function applyBackendErrors(error: unknown): ApplyBackendErrorsResult {
    const result = buildBackendFieldErrorMap(error, {
        aliases: REGISTER_FIELD_ALIASES,
        allowedFields: REGISTER_FIELD_NAMES,
    });
    backendFieldErrors.value = result.fieldErrors;
    return {
        fullyHandled: hasOnlyHandledFieldErrors(result),
        appError: result.appError,
        unhandledMessages: result.unhandledMessages,
    };
}

function clearBackendError(field: string) {
    if (!backendFieldErrors.value[field]) {
        return;
    }
    backendFieldErrors.value = Object.fromEntries(
        Object.entries(backendFieldErrors.value).filter(
            ([key]) => key !== field,
        ),
    );
}

const handleInstitutionInput = () => clearBackendError("selectedInstitution");
const handleUsernameInput = () => clearBackendError("username");
const handleEmailInput = () => clearBackendError("email");

const formRef = ref();

const { isRequired, fieldRules } = useZodFormRules();

const institutionRequired = isRequired(
    userAccountCreateSchema.shape.institutionId,
);
const institutionRules = fieldRules(
    userAccountCreateSchema.shape.institutionId,
);

const usernameRequired = isRequired(userAccountCreateSchema.shape.username);
const usernameRules = fieldRules(userAccountCreateSchema.shape.username);

const nameRequired = isRequired(userAccountCreateSchema.shape.name);
const nameRules = fieldRules(userAccountCreateSchema.shape.name);

const surnameRequired = isRequired(userAccountCreateSchema.shape.surname);
const surnameRules = fieldRules(userAccountCreateSchema.shape.surname);

const emailRequired = isRequired(userAccountCreateSchema.shape.email);
const emailRules = fieldRules(userAccountCreateSchema.shape.email);

const timezoneRequired = isRequired(userAccountCreateSchema.shape.timezone);
const timezoneRules = fieldRules(userAccountCreateSchema.shape.timezone);

const passwordRequired = isRequired(userAccountCreateSchema.shape.newPassword);
const passwordRules = fieldRules(userAccountCreateSchema.shape.newPassword);

const confirmPasswordRequired = isRequired(
    userAccountCreateSchema.shape.confirmNewPassword,
);
const confirmPasswordRules = [
    ...fieldRules(userAccountCreateSchema.shape.confirmNewPassword),
    (value: string | undefined) =>
        value === password.value ||
        translate("userAccount.general.validation.passwordsDontMatch"),
];

async function register() {
    const { valid } = await formRef.value.validate();
    if (!valid) {
        return;
    }

    backendFieldErrors.value = {};
    const language = navigator.language?.split("-")[0] || "en";

    const registeredAccount = await submitWithFormErrors({
        run: () =>
            submitRegister({
                institutionId: Number(selectedInstitution.value),
                name: name.value,
                surname: surname.value,
                username: username.value,
                newPassword: password.value,
                confirmNewPassword: confirmPassword.value,
                timezone: timezone.value,
                language,
                email: email.value || undefined,
                userRoles: ["EXAM_SUPPORTER"],
            }),
        applyErrors: applyBackendErrors,
        error: registerError,
        contextLabel: "useraccount",
    });

    if (!registeredAccount) {
        return;
    }

    setTimeout(() => {
        router.push({ name: "/(public)/login/" });
    }, 2500);
}

function handleTabKeyEvent(event: KeyboardEvent, action: string) {
    if (event.key === "Enter" || event.key === " ") {
        if (action === "navigate") {
            router.push({ name: "/(public)/login/" });
        }
    }
}
</script>
