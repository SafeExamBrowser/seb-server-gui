<template>
    <v-main data-testid="register-page-container">
        <v-container class="fill-height d-flex align-center justify-center">
            <v-row class="w-100 justify-center">
                <v-col cols="12" lg="8" md="6" sm="6">
                    <v-card class="pa-8">
                        <div class="d-flex ml-15 mr-15 justify-center">
                            <v-img
                                alt="SEB Logo"
                                class="mb-4"
                                :max-width="150"
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

                        <div v-if="registerSuccess" class="mt-10">
                            <div data-testid="register-success-alert">
                                <AlertMsg
                                    :alert-props="{
                                        title: '',
                                        color: 'success',
                                        type: 'alert',
                                        textKey: 'register-success',
                                    }"
                                />
                            </div>
                        </div>

                        <v-card-title class="mt-10">
                            {{ translate("titles.register") }}
                        </v-card-title>
                        <v-card-subtitle>
                            {{
                                translate(
                                    "userAccount.registerPage.info.accountRegistrationInfo",
                                )
                            }}
                        </v-card-subtitle>

                        <v-card-text class="pt-12">
                            <LoadingFallbackComponent
                                :loading="loading"
                                :errors="errors"
                            >
                                <template v-if="!registerSuccess">
                                    <FormBuilder
                                        ref="formRef"
                                        :fields="formFields"
                                        data-testid="register-form"
                                        @submit="handleRegister"
                                    />

                                    <v-btn
                                        block
                                        class="mt-4"
                                        color="primary"
                                        data-testid="register-submit-btn"
                                        :loading="registerLoading"
                                        rounded="sm"
                                        @click="handleRegister"
                                    >
                                        {{
                                            translate(
                                                "userAccount.registerPage.buttons.register",
                                            )
                                        }}
                                    </v-btn>
                                </template>

                                <div class="text-center mt-7">
                                    <span>{{
                                        translate(
                                            "userAccount.registerPage.info.alreadyHaveAccount",
                                        )
                                    }}</span>
                                    <RouterLink
                                        data-testid="register-login-link"
                                        :to="{ name: '/(public)/login/' }"
                                    >
                                        {{
                                            translate(
                                                "userAccount.registerPage.buttons.login",
                                            )
                                        }}
                                    </RouterLink>
                                </div>
                            </LoadingFallbackComponent>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

import AlertMsg from "@/components/widgets/AlertMsg.vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useRegisterUserAccountMutation } from "@/pages/(app)/user-account/api/useRegisterUserAccountMutation.ts";
import { applyBackendFieldErrors } from "@/services/errors/formErrorMapping.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import type { BackendFieldAliasMap } from "@/services/errors/types.ts";
import { translate } from "@/utils/generalUtils";

import { useRegisterFormFields } from "./composables/useRegisterFormFields.ts";

definePage({
    meta: {
        pageTestId: "register-page",
    },
});

const REGISTER_FIELD_ALIASES = {
    timeZone: "timezone",
    newPassword: "password",
    confirmNewPassword: "confirmPassword",
} satisfies BackendFieldAliasMap;

const router = useRouter();
const formRef = ref<InstanceType<typeof FormBuilder>>();

const {
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
} = useRegisterFormFields();

const {
    mutateAsync: register,
    data: registered,
    isPending: registerLoading,
    error: registerMutationError,
} = useRegisterUserAccountMutation();
const registerError = computed(() =>
    toAppErrorOrUndefined(registerMutationError.value),
);
const registerSuccess = computed(() => !!registered.value);

const requireValidatedField = <T,>(value: T | undefined): T => {
    if (value === undefined || value === "") {
        throw new Error("validated register field is missing");
    }
    return value;
};

const applyBackendErrors = (error: unknown) =>
    applyBackendFieldErrors(error, {
        aliases: REGISTER_FIELD_ALIASES,
        forms: [
            {
                form: formRef.value,
                fields: formFields.value.map((field) => field.name),
            },
        ],
    });

const handleRegister = async () => {
    if (registerLoading.value || registerSuccess.value) {
        return;
    }

    const result = await formRef.value?.validate();
    if (!result?.valid) {
        return;
    }

    const language = navigator.language?.split("-")[0] || "en";

    const registeredAccount = await submitWithFormErrors({
        run: () =>
            register({
                institutionId: Number(
                    requireValidatedField(institutionId.value),
                ),
                username: requireValidatedField(username.value),
                name: requireValidatedField(name.value),
                surname: requireValidatedField(surname.value),
                email: email.value || undefined,
                timezone: requireValidatedField(timezone.value),
                language,
                newPassword: requireValidatedField(password.value),
                confirmNewPassword: requireValidatedField(
                    confirmPassword.value,
                ),
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
};
</script>
