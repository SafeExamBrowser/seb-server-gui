<template>
    <div></div>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { useCurrentUserQuery } from "@/composables/useCurrentUser.ts";
import { getLandingRoute } from "@/router/getLandingRoute.ts";

// The former home page is now a role-based landing redirect. The auth guard
// has already hydrated the current user (and its roles) before this mounts.
const router = useRouter();
const { data: currentUser } = useCurrentUserQuery();

onBeforeMount(() => {
    const userRoles = currentUser.value?.userRoles ?? [];
    void router.replace(getLandingRoute(userRoles));
});
</script>
