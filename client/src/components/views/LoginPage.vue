<template>
    <v-main data-testid="login-page-container">
        <v-container class="fill-height d-flex align-center justify-center">
            <v-card class="pa-10">
                <div class="d-flex ml-15 mr-15 justify-center">
                    <img
                        :alt="translate('screenReader.logo')"
                        class="logo-img"
                        src="/img/seb-logo-no-border.png"
                    />
                </div>
                <div class="d-flex ml-15 mr-15 mt-5 justify-center">
                    <div class="text-h6" data-testid="login-title">
                        {{ translate("loginPage.title") }}
                    </div>
                </div>

                <div class="mt-10">
                    <div v-if="loginError" data-testid="login-error-alert">
                        <AlertMsg
                            :alert-props="{
                                title: '',
                                color: 'error',
                                type: 'alert',
                                textKey: 'login-error',
                            }"
                        />
                    </div>

                    <div
                        v-if="loadingStore.isTimeout"
                        data-testid="timeout-error-alert"
                    >
                        <AlertMsg
                            :alert-props="{
                                title: '',
                                color: 'error',
                                type: 'alert',
                                textKey: 'timeout-error',
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
                    <v-form @keyup.enter="signIn()">
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
                            @click="signIn()"
                        >
                            {{ translate("loginPage.signIn") }}
                        </v-btn>
                    </v-form>

                    <div class="text-center mt-7">
                        <span>
                            {{ translate("loginPage.noAccount") }}
                        </span>
                        <span
                            class="text-decoration-underline text-blue"
                            data-testid="login-register-link"
                            role="button"
                            tabindex="0"
                            @keydown="handleTabKeyEvent($event, 'navigate')"
                        >
                            <router-link :to="constants.REGISTER_ROUTE">
                                {{ translate("loginPage.register") }}
                            </router-link>
                        </span>
                    </div>
                </v-card-text>
            </v-card>
        </v-container>
    </v-main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import * as authenticationService from "@/services/authenticationService";
import { useLoadingStore } from "@/stores/store";
import { useTheme } from "vuetify";
import * as constants from "@/utils/constants";
import { translate } from "@/utils/generalUtils";
import { useAuthStore } from "@/stores/authentication/authenticationStore";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { useRouter } from "vue-router";

const username = ref("");
const password = ref("");
const loginError = ref(false);

const passwordVisible = ref<boolean>(false);

// stores
const authStore = useAuthStore();
const loadingStore = useLoadingStore();

// theme
const theme = useTheme();
const initialTheme = localStorage.getItem("theme") ?? "light";
theme.change(initialTheme);

// ToDo dark mode??
// const isDark = computed<boolean>(() => theme.global.current.value.dark);

const router = useRouter();

async function signIn() {
    loginError.value = false;
    loadingStore.isTimeout = false;

    try {
        // if seb server fails --> shows error msg
        const tokenObject = await authenticationService.login(
            username.value,
            password.value,
            false,
        );

        try {
            // if sp failes --> only logs error
            const spTokenObject = await authenticationService.login(
                username.value,
                password.value,
                true,
            );
            authStore.loginSP(
                spTokenObject.access_token,
                spTokenObject.refresh_token,
            );
        } catch (error) {
            console.error("SP login failed:", error);
            authStore.setStorageItem(StorageItemEnum.IS_SP_AVAILABLE, "false");
        } finally {
            authStore.login(
                tokenObject.access_token,
                tokenObject.refresh_token,
            );
        }
    } catch {
        loginError.value = true;
    }
}

function handleTabKeyEvent(event: KeyboardEvent, action: string) {
    if (event.key === "Enter" || event.key === " ") {
        if (action === "navigate") {
            router.push(constants.REGISTER_ROUTE);
        }
    }
}
</script>

<style scoped>
.invert {
    filter: invert(1);
}

.logo-img {
    max-width: 150px;
    width: 100%;
    height: auto;
}
</style>
