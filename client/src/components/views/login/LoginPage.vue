<template>
    <v-main data-testid="login-page-container">
        <v-container class="fill-height d-flex align-center justify-center">
            <v-card class="pa-10">
                <div class="d-flex ml-15 mr-15 justify-center">
                    <img
                        :alt="translate('screenReader.logo')"
                        class="w-100 h-auto"
                        src="/img/seb-logo-no-border.png"
                        style="max-width: 150px"
                    />
                </div>
                <div class="d-flex ml-15 mr-15 mt-5 justify-center">
                    <div class="text-h6" data-testid="login-title">
                        {{ translate("loginPage.title") }}
                    </div>
                </div>

                <div class="mt-10">
                    <div v-if="errorI18nKey" data-testid="login-error-alert">
                        <AlertMsg
                            :alert-props="{
                                title: '',
                                color: 'error',
                                type: 'alert',
                                textKey: errorI18nKey,
                            }"
                        />
                    </div>
                </div>

                <v-card-title class="mt-10">
                    {{ translate("loginPage.signIn") }}
                </v-card-title>
                <v-card-subtitle>
                    <span class="text-subtitle">
                        {{ translate("loginPage.description") }}
                    </span>
                </v-card-subtitle>

                <v-card-text>
                    <v-form @submit.prevent="handleSubmit">
                        <v-text-field
                            v-model="username"
                            data-testid="login-username-input"
                            density="compact"
                            :placeholder="
                                translate('loginPage.usernamePlaceholder')
                            "
                            prepend-inner-icon="mdi-account-outline"
                            variant="outlined"
                        >
                        </v-text-field>

                        <v-text-field
                            v-model="password"
                            data-testid="login-password-input"
                            density="compact"
                            :placeholder="
                                translate('loginPage.passwordPlaceholder')
                            "
                            prepend-inner-icon="mdi-lock-outline"
                            :type="passwordVisible ? 'text' : 'password'"
                            variant="outlined"
                        >
                            <template #append-inner>
                                <v-btn
                                    data-testid="login-password-toggle"
                                    density="compact"
                                    :icon="
                                        passwordVisible
                                            ? 'mdi-eye-off'
                                            : 'mdi-eye'
                                    "
                                    variant="text"
                                    @click="passwordVisible = !passwordVisible"
                                >
                                </v-btn>
                            </template>
                        </v-text-field>

                        <v-btn
                            block
                            color="primary"
                            data-testid="login-signin-btn"
                            rounded="sm"
                            type="submit"
                        >
                            {{ translate("loginPage.signIn") }}
                        </v-btn>
                    </v-form>

                    <div class="text-center mt-7">
                        <span>
                            {{ translate("loginPage.noAccount") }}
                        </span>
                        <router-link
                            :to="constants.REGISTER_ROUTE"
                            class="text-primary"
                            data-testid="login-register-link"
                            role="button"
                            tabindex="0"
                        >
                            {{ translate("loginPage.register") }}
                        </router-link>
                    </div>
                </v-card-text>
            </v-card>
        </v-container>
    </v-main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTheme } from "vuetify";
import * as constants from "@/utils/constants";
import { translate } from "@/utils/generalUtils";
import { useLogin } from "./composables/useLogin";

const username = ref("");
const password = ref("");
const passwordVisible = ref<boolean>(false);

const { errorI18nKey, login } = useLogin();

// theme
const theme = useTheme();
const initialTheme = localStorage.getItem("theme") ?? "light";
theme.change(initialTheme);

const handleSubmit = () => {
    login(username.value, password.value);
};
</script>
