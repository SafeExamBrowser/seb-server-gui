<template>
    <v-main data-testid="login-page-container">
        <LoadingFallbackComponent :loading="loading">
            {{ login(jwt) }}
        </LoadingFallbackComponent>
    </v-main>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useAutoLogin } from "@/pages/(public)/composables/useAutoLogin";

const route = useRoute();
const jwt = route.params.jwt;

const { loading, login } = useAutoLogin();
</script>
