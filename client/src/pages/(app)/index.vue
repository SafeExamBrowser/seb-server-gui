<template>
    <div></div>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useUserAccountStore } from "@/stores/authentication/userAccountStore.ts";
import { getLandingRoute } from "@/router/getLandingRoute.ts";

// The former home page is now a role-based landing redirect. The auth guard
// has already hydrated the user account (and its roles) before this mounts.
const router = useRouter();
const userAccountStore = useUserAccountStore();

onBeforeMount(() => {
    const userRoles = userAccountStore.userAccount?.userRoles ?? [];
    void router.replace(getLandingRoute(userRoles));
});
</script>
