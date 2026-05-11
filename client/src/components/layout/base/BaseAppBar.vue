<template>
    <div
        class="d-flex align-center flex-shrink-0 ga-4 pt-3 pb-2 px-6"
        data-testid="layout-app-bar"
    >
        <v-card
            class="flex-grow-1 d-flex align-center overflow-hidden px-4 py-1 ga-3"
            elevation="1"
            :style="{ borderRadius: '14px' }"
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

            <v-avatar
                v-if="institutionLogo"
                class="flex-shrink-0"
                density="comfortable"
                rounded="0"
                size="large"
            >
                <v-img alt="Institution Logo" :src="institutionLogo" />
            </v-avatar>

            <div class="d-flex flex-column">
                <span
                    class="text-caption text-medium-emphasis font-weight-bold"
                >
                    Institution
                </span>
                <span
                    class="text-body-2 font-weight-black"
                    data-testid="layout-institutionTitle-text"
                >
                    {{ institutionName || "SEB Server" }}
                </span>
            </div>

            <v-divider
                class="align-self-stretch flex-grow-0 mx-2 my-2"
                vertical
            />

            <div class="d-flex align-center ga-1 text-body-2">
                <template v-for="(item, index) in breadcrumbItems" :key="index">
                    <v-icon
                        v-if="index > 0"
                        class="text-medium-emphasis"
                        icon="mdi-chevron-right"
                        size="x-small"
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
            class="d-flex align-center pe-2 ps-3 py-1 ga-2"
            elevation="1"
            :style="{ borderRadius: '14px' }"
        >
            <slot name="identity-actions" />

            <v-badge
                v-if="showNotifications"
                bordered
                color="warning"
                dot
                :model-value="hasNotifications"
            >
                <v-btn
                    color="surface"
                    data-testid="layout-notifications-button"
                    density="comfortable"
                    icon
                    variant="flat"
                    @click="$emit('notificationsClick')"
                >
                    <v-icon icon="mdi-bell-outline" size="small" />
                </v-btn>
            </v-badge>

            <v-divider class="align-self-stretch flex-grow-0 my-2" vertical />

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
