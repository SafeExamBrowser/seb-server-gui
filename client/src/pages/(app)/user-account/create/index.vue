<template>
    <UserAccountForm
        ref="formRef"
        :title="$t('titles.createUserAccount')"
        mode="create"
        data-test-prefix="createUserAccount"
        @create-submit="handleSubmit"
        @cancel="router.push({ name: '/(app)/user-account/' })"
    />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserAccountForm from "@/pages/(app)/user-account/components/UserAccountForm.vue";
import { useCreateUserAccount } from "@/pages/(app)/user-account/api/useCreateUserAccount.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import type { UserAccountCreateRequest } from "@/models/userAccount.ts";

definePage({
    meta: {
        titleKey: "titles.createUserAccount",
        pageTestId: "create-user-account-page",
        isPageBlue: true,
    },
});

const router = useRouter();
const formRef = ref<InstanceType<typeof UserAccountForm>>();
const { create, error: createError } = useCreateUserAccount();

const handleSubmit = async (payload: UserAccountCreateRequest) => {
    const created = await submitWithFormErrors({
        run: () => create(payload),
        applyErrors: (err) => formRef.value?.applyBackendErrors(err),
        error: createError,
        contextLabel: "useraccount",
    });
    if (!created) return;
    await router.push({
        name: "/(app)/user-account/",
        query: { search: created.surname },
    });
};
</script>
