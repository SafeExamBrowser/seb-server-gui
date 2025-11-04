<template>
    <v-main data-testid="register-page-container">
        <v-container class="fill-height d-flex align-center justify-center">
            <v-row class="w-100" justify="center">
                <v-col cols="12" lg="8" md="6" sm="6">
                    <v-card class="pa-8">
                        <div class="d-flex ml-15 mr-15 justify-center">
                            <img
                                alt="SEB Logo"
                                class="logo-img"
                                src="/img/seb-logo-no-border.png"
                            />
                        </div>
                        <div class="d-flex ml-15 mr-15 mt-5 justify-center">
                            <div class="text-h6">
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

                        <v-card-text>
                            <v-form ref="formRef" @keyup.enter="register()">
                                <v-row dense>
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
                                            :items="institutions"
                                            :label="
                                                translate(
                                                    'userAccount.registerPage.labels.institutionLabel',
                                                )
                                            "
                                            prepend-inner-icon="mdi-domain"
                                            required
                                            :rules="[requiredRule]"
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
                                            required
                                            :rules="[requiredRule]"
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
                                            required
                                            :rules="[requiredRule]"
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
                                            required
                                            :rules="[requiredRule]"
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
                                            :rules="[emailRule]"
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
                                            required
                                            :return-object="false"
                                            :rules="[requiredRule]"
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
                                            required
                                            :rules="[
                                                requiredRule,
                                                passwordRule,
                                            ]"
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
                                            required
                                            :rules="[
                                                requiredRule,
                                                confirmPasswordRule,
                                            ]"
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
                                        <router-link
                                            :to="constants.DEFAULT_ROUTE"
                                            >{{
                                                translate(
                                                    "userAccount.registerPage.buttons.login",
                                                )
                                            }}</router-link
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
import { ref } from "vue";
import { navigateTo } from "@/router/navigation";
import { onMounted } from "vue";
import * as constants from "@/utils/constants";
import * as registerAccountViewService from "@/services/seb-server/component-services/registerAccountViewService";

import moment from "moment-timezone";
import { translate } from "@/utils/generalUtils";
import { useI18n } from "vue-i18n";
import { Institution } from "@/models/seb-server/institution";

// form fields
const selectedInstitution = ref<string>("");
const name = ref<string>("");
const surname = ref<string>("");
const username = ref<string>("");
const email = ref<string>();
const timezone = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");

// error handling
const registerError = ref(false);
const registerSuccess = ref(false);
const i18n = useI18n();

// password icon logic
const passwordVisible = ref<boolean>(false);
const confirmPasswordVisible = ref<boolean>(false);

// institution setters
const institutions = ref<Institution[]>([]);
const institutionSelectDisabled = ref<boolean>(false);

// load timezones
const timezoneOptions = moment.tz.names();

// fetch Institutions
onMounted(async () => {
    const result: Institution[] | null =
        await registerAccountViewService.getInstitutions();
    if (result && result.length > 0) {
        institutions.value = result;

        if (result.length === 1) {
            selectedInstitution.value = result[0].modelId;
            institutionSelectDisabled.value = true;
        }
    }
});

// validation rules
const requiredRule = (v: string) =>
    !!v || translate("userAccount.general.validation.required", i18n);
const passwordRule = (v: string) =>
    (v && v.length >= 8) ||
    translate("userAccount.general.validation.passwordTooShort", i18n);
const formRef = ref();
const confirmPasswordRule = (v: string) =>
    v === password.value ||
    translate("userAccount.general.validation.passwordsDontMatch", i18n);
const emailRule = (v: string) =>
    !v ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
    translate("userAccount.general.validation.invalidEmail", i18n);

// register
async function register() {
    registerError.value = false;
    registerSuccess.value = false;

    const { valid } = await formRef.value.validate();
    if (!valid) {
        return;
    }

    try {
        const result = await registerAccountViewService.registerUserAccount(
            selectedInstitution.value,
            name.value,
            surname.value,
            username.value,
            password.value,
            confirmPassword.value,
            timezone.value,
            email.value,
        );

        if (result) {
            registerSuccess.value = true;

            setTimeout(() => {
                navigateTo(constants.DEFAULT_ROUTE);
            }, 2500);
        } else {
            registerError.value = true;
        }
    } catch (error) {
        console.error(error);
        // todo error handle
        registerError.value = true;
    }
}
function handleTabKeyEvent(event: KeyboardEvent, action: string) {
    if (event.key === "Enter" || event.key === " ") {
        if (action === "navigate") {
            navigateTo(constants.DEFAULT_ROUTE);
        }
    }
}
</script>

<style scoped>
.logo-img {
    width: 100%;
    max-width: 150px;
    height: auto;
    margin-bottom: 1rem;
}

.v-card-text {
    padding-top: 3rem;
}

.v-messages {
    min-height: 20px; /* Reserve space for validation messages */
}
</style>
