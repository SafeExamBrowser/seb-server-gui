<template>
    <v-dialog
        v-model="open"
        data-testid="changePassword-dialog"
        max-width="600"
    >
        <v-card class="pa-4">
            <v-card-title class="text-title-large font-weight-bold mb-2 mt-2">
                {{ $t("userAccount.changePassword.title") }}
            </v-card-title>
            <v-card-subtitle v-if="username" class="pb-4">
                {{
                    $t("userAccount.changePassword.info", {
                        username: username,
                    })
                }}
            </v-card-subtitle>
            <v-divider class="mb-4" />
            <v-card-text class="pt-0">
                <FormBuilder ref="formRef" :fields="formFields" />
            </v-card-text>
            <v-card-actions class="justify-end mt-2">
                <v-btn variant="text" @click="handleCancel">
                    {{ $t("general.cancelButton") }}
                </v-btn>
                <v-btn
                    color="primary"
                    variant="flat"
                    :loading="loading"
                    @click="handleSubmit"
                >
                    {{ $t("general.saveButton") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import FormBuilder from "@/components/widgets/formBuilder/FormBuilder.vue";
import { useChangePasswordFormFields } from "@/pages/(app)/user-account/composables/useChangePasswordFormFields.ts";
import type { BackendFieldAliasMap } from "@/services/errors/types.ts";
import {
    buildBackendFieldErrorMap,
    hasOnlyHandledFieldErrors,
    type ApplyBackendErrorsResult,
} from "@/services/errors/formErrorMapping.ts";

const CHANGE_PASSWORD_FIELD_ALIASES = {
    password: "adminPassword",
} satisfies BackendFieldAliasMap;

defineProps<{
    username?: string;
    loading?: boolean;
}>();

const open = defineModel<boolean>({ required: true });

const emit = defineEmits<{
    submit: [
        payload: {
            adminPassword: string;
            newPassword: string;
            confirmNewPassword: string;
        },
    ];
}>();

const formRef = ref<InstanceType<typeof FormBuilder>>();
const { formFields, adminPassword, newPassword, confirmNewPassword, reset } =
    useChangePasswordFormFields();

function applyBackendErrors(error: unknown): ApplyBackendErrorsResult {
    const allowedFields = formFields.value.map((field) => field.name);
    const result = buildBackendFieldErrorMap(error, {
        aliases: CHANGE_PASSWORD_FIELD_ALIASES,
        allowedFields,
    });
    formRef.value?.setBackendErrors(result.fieldErrors);
    return {
        fullyHandled: hasOnlyHandledFieldErrors(result),
        appError: result.appError,
        unhandledMessages: result.unhandledMessages,
    };
}

defineExpose({ applyBackendErrors });

watch(open, (isOpen) => {
    if (!isOpen) {
        reset();
    }
});

const handleCancel = () => {
    open.value = false;
};

const handleSubmit = async () => {
    const result = await formRef.value?.validate();
    if (!result?.valid) return;
    if (
        !adminPassword.value ||
        !newPassword.value ||
        !confirmNewPassword.value
    ) {
        return;
    }
    emit("submit", {
        adminPassword: adminPassword.value,
        newPassword: newPassword.value,
        confirmNewPassword: confirmNewPassword.value,
    });
};
</script>
