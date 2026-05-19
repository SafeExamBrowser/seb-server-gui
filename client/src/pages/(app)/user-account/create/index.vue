<template>
    <UserAccountForm
        ref="formRef"
        :title="$t('titles.createUserAccount')"
        mode="create"
        data-test-prefix="createUserAccount"
        @submit="handleSubmit"
        @cancel="router.push({ name: '/(app)/user-account/' })"
    />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserAccountForm, {
    type UserAccountFormPayload,
} from "@/pages/(app)/user-account/components/UserAccountForm.vue";
import { useMutation } from "@/composables/useMutation.ts";
import { createUserAccount } from "@/services/seb-server/userAccountService.ts";
import { notify } from "@/services/notifications/notify.ts";

definePage({
    meta: {
        titleKey: "titles.createUserAccount",
        pageTestId: "create-user-account-page",
        isPageBlue: true,
    },
});

const router = useRouter();
const formRef = ref<InstanceType<typeof UserAccountForm>>();
const {
    mutateData: create,
    data: created,
    error: createError,
} = useMutation(createUserAccount);

const handleSubmit = async (payload: UserAccountFormPayload) => {
    if (!payload.password || !payload.confirmPassword) {
        return;
    }
    await create({
        institutionId: payload.institutionId,
        name: payload.name,
        surname: payload.surname,
        username: payload.username,
        email: payload.email,
        language: "en",
        timezone: payload.timezone,
        userRoles: payload.userRoles,
        newPassword: payload.password,
        confirmNewPassword: payload.confirmPassword,
    });
    if (created.value) {
        await router.push({ name: "/(app)/user-account/" });
        return;
    }
    if (createError.value) {
        const result = formRef.value?.applyBackendErrors(createError.value);
        if (!result?.fullyHandled) {
            notify.serverError(result?.appError ?? createError.value, {
                contextLabel: "useraccount",
                onlyMessages: result?.unhandledMessages,
            });
        }
    }
};
</script>
