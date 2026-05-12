<template>
    <div
        class="d-flex align-stretch flex-shrink-0 ga-4 pt-2 pb-2 px-6"
        data-testid="layout-app-bar"
    >
        <v-card
            class="flex-grow-1 rounded-lg d-flex align-center overflow-hidden px-4 py-2 ga-3"
            elevation="1"
        >
            <RouterLink
                class="d-flex align-center text-decoration-none"
                data-testid="layout-appLogo-link"
                :to="homeRoute"
            >
                <v-avatar density="comfortable" rounded="0" size="large">
                    <v-img
                        :alt="$t('navigation.screenReader.titleImage')"
                        src="/img/seb-logo-no-border.png"
                    />
                </v-avatar>
            </RouterLink>

            <v-divider class="align-self-stretch flex-grow-0 my-2" vertical />

            <img
                v-if="institutionLogo"
                class="flex-shrink-0 w-auto h-auto"
                :alt="$t('navigation.screenReader.institutionLogo')"
                :src="institutionLogo"
                :style="{
                    maxHeight: '44px',
                    maxWidth: '220px',
                    objectFit: 'contain',
                }"
            />

            <div class="d-flex flex-column">
                <span
                    class="text-caption text-medium-emphasis font-weight-bold"
                >
                    {{ $t("navigation.institution") }}
                </span>
                <span
                    class="text-body-2 font-weight-black"
                    data-testid="layout-institutionTitle-text"
                >
                    {{
                        institutionName ||
                        $t("navigation.fallbackInstitutionName")
                    }}
                </span>
            </div>

            <v-spacer />

            <slot name="bar-actions" />
        </v-card>

        <v-card
            class="d-flex align-center rounded-lg pe-2 ps-3 py-2 ga-2"
            elevation="1"
        >
            <ContainerProfileMenu
                :user-account="userAccount"
                @logout="$emit('logout')"
            />
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { RouteLocationAsRelative } from "vue-router";
import type { UserAccount } from "@/models/userAccount";
import ContainerProfileMenu from "./ContainerProfileMenu.vue";

defineProps<{
    homeRoute: RouteLocationAsRelative;
    institutionName: string;
    institutionLogo?: string;
    userAccount?: UserAccount;
}>();

defineEmits<{
    logout: [];
}>();
</script>
