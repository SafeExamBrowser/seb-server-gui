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
                                v-if="registerError"
                                data-testid="register-error-alert"
                            >
                                <AlertMsg
                                    :alert-props="{
                                        title: '',
                                        color: 'error',
                                        type: 'alert',
                                        textKey: 'register-error',
                                    }"
                                >
                                </AlertMsg>
                            </div>
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
                                        />
                                    </v-col>

                                    <v-col cols="12">
                                        <v-text-field
                                            v-model="username"
                                            data-testid="register-username-input"
                                            density="compact"
                                            :label="
                                                translate(
                                                    'userAccount.registerPage.labels.usernameLabel',
                                                )
                                            "
                                            prepend-inner-icon="mdi-account-outline"
                                            :required="usernameRequired"
                                            :rules="usernameRules"
                                            variant="outlined"
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
import type { z } from "zod";
import { useRules } from "vuetify/labs/rules";
import { translate } from "@/utils/generalUtils";
import { useInstitutions } from "@/composables/useInstitutions";
import { useRegisterUserAccountMutation } from "@/pages/(app)/user-account/api/useRegisterUserAccountMutation.ts";
import { useZodFormRules } from "@/composables/useZodFormRules.ts";
import { userAccountCreateSchema } from "@/models/userAccount.ts";
import { RouterLink, useRouter } from "vue-router";
import AlertMsg from "@/components/widgets/AlertMsg.vue";

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

const registerError = computed(() => !!registerSubmitError.value);
const registerSuccess = computed(() => !!registered.value);

const formRef = ref();

const rules = useRules();
const { isRequired, lengthRules, formatRules } = useZodFormRules();

const withRequiredRule = (schema: z.ZodType) =>
    isRequired(schema) ? [rules.required()] : [];

const institutionRequired = isRequired(
    userAccountCreateSchema.shape.institutionId,
);
const institutionRules = withRequiredRule(
    userAccountCreateSchema.shape.institutionId,
);

const usernameRequired = isRequired(userAccountCreateSchema.shape.username);
const usernameRules = [
    ...withRequiredRule(userAccountCreateSchema.shape.username),
    ...lengthRules(userAccountCreateSchema.shape.username),
];

const nameRequired = isRequired(userAccountCreateSchema.shape.name);
const nameRules = [
    ...withRequiredRule(userAccountCreateSchema.shape.name),
    ...lengthRules(userAccountCreateSchema.shape.name),
];

const surnameRequired = isRequired(userAccountCreateSchema.shape.surname);
const surnameRules = [
    ...withRequiredRule(userAccountCreateSchema.shape.surname),
    ...lengthRules(userAccountCreateSchema.shape.surname),
];

const emailRequired = isRequired(userAccountCreateSchema.shape.email);
const emailRules = [
    ...withRequiredRule(userAccountCreateSchema.shape.email),
    ...lengthRules(userAccountCreateSchema.shape.email),
    ...formatRules(userAccountCreateSchema.shape.email),
];

const timezoneRequired = isRequired(userAccountCreateSchema.shape.timezone);
const timezoneRules = [
    ...withRequiredRule(userAccountCreateSchema.shape.timezone),
    ...lengthRules(userAccountCreateSchema.shape.timezone),
];

const passwordRequired = isRequired(userAccountCreateSchema.shape.newPassword);
const passwordRules = [
    ...withRequiredRule(userAccountCreateSchema.shape.newPassword),
    ...lengthRules(userAccountCreateSchema.shape.newPassword),
];

const confirmPasswordRequired = isRequired(
    userAccountCreateSchema.shape.confirmNewPassword,
);
const confirmPasswordRules = [
    ...withRequiredRule(userAccountCreateSchema.shape.confirmNewPassword),
    ...lengthRules(userAccountCreateSchema.shape.confirmNewPassword),
    (value: string | undefined) =>
        value === password.value ||
        translate("userAccount.general.validation.passwordsDontMatch"),
];

async function register() {
    const { valid } = await formRef.value.validate();
    if (!valid) {
        return;
    }

    const language = navigator.language?.split("-")[0] || "en";

    try {
        await submitRegister({
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
        });
        setTimeout(() => {
            router.push({ name: "/(public)/login/" });
        }, 2500);
    } catch {
        return;
    }
}

function handleTabKeyEvent(event: KeyboardEvent, action: string) {
    if (event.key === "Enter" || event.key === " ") {
        if (action === "navigate") {
            router.push({ name: "/(public)/login/" });
        }
    }
}
</script>
