<template>
    <div
        class="d-flex align-center ga-4 pt-3 px-6"
        data-testid="layout-app-bar"
        :style="{ height: '72px' }"
    >
        <v-card
            class="flex-grow-1 d-flex align-center px-4 ga-3"
            elevation="1"
            :style="{
                height: '56px',
                borderRadius: '14px',
            }"
        >
            <RouterLink
                class="d-flex align-center text-decoration-none"
                data-testid="layout-appLogo-link"
                :to="homeRoute"
            >
                <v-img
                    :alt="$t('navigation.screenReader.titleImage')"
                    height="40"
                    src="/img/seb-logo-no-border.png"
                    width="40"
                />
            </RouterLink>

            <v-divider
                class="align-self-center"
                :style="{ height: '24px', flexGrow: 0 }"
                vertical
            />

            <img
                v-if="institutionLogo"
                alt="Institution Logo"
                :src="institutionLogo"
                :style="{
                    height: '32px',
                    maxWidth: '120px',
                    width: 'auto',
                    objectFit: 'contain',
                }"
            />

            <div class="d-flex flex-column" style="line-height: 1.1">
                <span
                    class="text-medium-emphasis text-uppercase font-weight-bold"
                    :style="{
                        fontSize: '10px',
                        letterSpacing: '1px',
                    }"
                >
                    Institution
                </span>
                <span
                    class="font-weight-black"
                    data-testid="layout-institutionTitle-text"
                    :style="{ fontSize: '14px' }"
                >
                    {{ institutionName || "SEB Server" }}
                </span>
            </div>

            <v-divider
                class="align-self-center mx-2"
                :style="{ height: '24px', flexGrow: 0 }"
                vertical
            />

            <div class="d-flex align-center ga-1 text-body-2">
                <template v-for="(item, index) in breadcrumbItems" :key="index">
                    <v-icon
                        v-if="index > 0"
                        class="text-medium-emphasis"
                        icon="mdi-chevron-right"
                        size="16"
                    />
                    <span
                        :class="
                            index === breadcrumbItems.length - 1
                                ? 'font-weight-bold'
                                : 'font-weight-medium text-medium-emphasis'
                        "
                    >
                        {{ item }}
                    </span>
                </template>
            </div>

            <v-spacer />
        </v-card>

        <v-card
            class="d-flex align-center pe-2 ps-3 ga-2"
            elevation="1"
            :style="{
                height: '56px',
                borderRadius: '14px',
            }"
        >
            <slot name="identity-actions" />

            <v-btn
                v-if="showNotifications"
                class="position-relative"
                color="surface"
                data-testid="layout-notifications-button"
                height="36"
                icon
                variant="flat"
                width="36"
                @click="$emit('notificationsClick')"
            >
                <v-icon icon="mdi-bell-outline" size="18" />
                <span
                    v-if="hasNotifications"
                    class="position-absolute"
                    :style="{
                        top: '6px',
                        right: '7px',
                        width: '7px',
                        height: '7px',
                        borderRadius: '999px',
                        background: 'rgb(var(--v-theme-warning, 224, 138, 43))',
                        border: '2px solid rgb(var(--v-theme-surface))',
                    }"
                />
            </v-btn>

            <v-divider
                class="align-self-center"
                :style="{ height: '24px', flexGrow: 0 }"
                vertical
            />

            <BaseProfileMenu
                :user-account="userAccount"
                @logout="$emit('logout')"
            />
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink, useRoute } from "vue-router";
import type { RouteLocationAsRelative } from "vue-router";
import type { UserAccount } from "@/models/userAccount";
import BaseProfileMenu from "@/components/layout/base/BaseProfileMenu.vue";

const props = withDefaults(
    defineProps<{
        homeRoute: RouteLocationAsRelative;
        institutionName: string;
        institutionLogo: string | null;
        userAccount: UserAccount | null | undefined;
        breadcrumb?: string[];
        showNotifications?: boolean;
        hasNotifications?: boolean;
    }>(),
    {
        breadcrumb: undefined,
        showNotifications: true,
        hasNotifications: false,
    },
);

defineEmits<{
    logout: [];
    notificationsClick: [];
}>();

const { t, te } = useI18n();
const route = useRoute();

const breadcrumbItems = computed<string[]>(() => {
    if (props.breadcrumb && props.breadcrumb.length > 0) {
        return props.breadcrumb;
    }

    const titleKey = route.meta.titleKey;
    if (titleKey && te(titleKey)) {
        return [t(titleKey)];
    }

    return [t("titles.home")];
});
</script>
