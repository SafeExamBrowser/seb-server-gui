<template>
    <UserAccountForm
        :title="$t('titles.createUserAccount')"
        mode="create"
        data-test-prefix="createUserAccount"
        @submit="handleSubmit"
        @cancel="router.push({ name: '/(app)/user-account/' })"
    />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import UserAccountForm, {
    type UserAccountFormPayload,
} from "@/pages/(app)/user-account/components/UserAccountForm.vue";
import { useMutation } from "@/composables/useMutation.ts";
import { createUserAccount } from "@/services/seb-server/userAccountService.ts";

definePage({
    meta: {
        titleKey: "titles.createUserAccount",
        pageTestId: "create-user-account-page",
        isPageBlue: true,
    },
});

const router = useRouter();
const { mutateData: create, data: created } = useMutation(createUserAccount);

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
    }
};
</script>
