<template>
    <UserAccountForm
        ref="formRef"
        :title="$t('titles.createUserAccount')"
        mode="create"
        :data-test-prefix="userAccountFormConfig.createTestPrefix"
        @create-submit="handleSubmit"
        @cancel="router.push({ name: '/(app)/user-account/' })"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import type { UserAccountCreateRequest } from "@/models/userAccount.ts";
import { useCreateUserAccountMutation } from "@/pages/(app)/user-account/api/useCreateUserAccountMutation.ts";
import UserAccountForm from "@/pages/(app)/user-account/components/UserAccountForm.vue";
import { userAccountFormConfig } from "@/pages/(app)/user-account/userAccountFormConfig.ts";
import { submitWithFormErrors } from "@/services/errors/submitWithFormErrors.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";

definePage({
    meta: {
        titleKey: "titles.createUserAccount",
        pageTestId: "create-user-account-page",
        isPageBlue: true,
    },
});

const router = useRouter();
const formRef = ref<InstanceType<typeof UserAccountForm>>();
const { mutateAsync: create, error: createMutationError } =
    useCreateUserAccountMutation();
const createError = computed(() =>
    toAppErrorOrUndefined(createMutationError.value),
);

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
