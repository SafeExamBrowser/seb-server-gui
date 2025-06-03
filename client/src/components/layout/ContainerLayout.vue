<template>

    <v-app-bar>
        <!--seb logo-->
        <template v-slot:prepend>
            <a :href="getHomePageRoute()" class="text-decoration-none text-black">
                <v-img :width=50 src="/img/seb-logo-no-border.png"
                    :alt="translate('navigation.screenReader.titleImage')"></v-img>
            </a>
        </template>

        <!--current site title-->
        <v-app-bar-title>
            <h1 class="title-inherit-styling">{{ appBarStore.title }}</h1>
        </v-app-bar-title>

        <template v-slot:append>
            <!--profile icon menu-->
            <div class="profile-icon-container d-flex align-center" aria-label="Profile">
                <div class="user-header-container d-flex flex-column align-center mr-2">
                    <span class="user-name">{{ userAccountStore.userAccount?.username }}</span>
                    <v-menu
                        v-if="userRoles.length > 1"
                        open-on-hover
                        offset-y
                        transition="slide-y-transition"
                        open-delay="0"
                        close-delay="100"
                    >
                        <template v-slot:activator="{ props, isActive }">
                            <span
                                v-bind="props"
                                class="user-role-badge text-white bg-primary d-flex align-center justify-center px-3 py-1 role-badge-wrappe"
                            >
                                <span class="mx-auto">Roles</span>
                                <v-icon
                                    size="small"
                                    class="fade-in-arrow"
                                    :class="{ 'fade-in-visible': isActive }"
                                    style="position: absolute; right: 8px;"
                                >
                                    mdi-chevron-down
                                </v-icon>
                            </span>
                        </template>

                        <v-list class="py-0 bg-primary roles-list-popup">
                            <v-list-item
                                v-for="role in userRoles"
                                :key="role"
                                class="text-body-2 px-4 "
                            >
                                {{ translateRole(role) }}
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    <span
                        v-if="userRoles.length === 1"
                        :class="[
                            'user-role-badge text-white px-3 py-1',
                            userRoles[0] === 'INSTITUTIONAL_ADMIN' ? 'bg-is-institutional-admin' : 'bg-primary'
                          ]"
                    >
                        {{ translateRole(userRoles[0]) }}
                    </span>


                </div>
                <!--profile icon-->
                <v-menu
                    attach="body"
                    :close-on-content-click="false"
                    activator="parent"
                    offset-y
                    content-class="profile-menu-override "
                >
                <template v-slot:activator="{ props }">
                        <div class="d-flex align-center ml-1 mr-6">
                            <v-btn
                                v-bind="props"
                                @click="userMenuOpened()"
                                elevation="0"
                                class="rounded-circle text-primary d-flex align-center justify-center"
                                style="
                                background-color: transparent;
                                border: 0.15rem solid #215CAF;
                                width: 3rem;
                                height: 3rem;
                                min-width: 3rem;
                                padding: 0;">
                                <span style="font-weight: 500; font-size: 1.1rem;">
                                    {{
                                        (userAccountStore.userAccount?.name?.[0] || '') +
                                        (userAccountStore.userAccount?.surname?.[0] || '')
                                    }}
                                </span>
                            </v-btn>
                            <v-icon
                                size="18"
                                color="#777"
                                class="ml-1"
                                style="margin-top: 1px;"
                            >
                            mdi-chevron-down
                            </v-icon>
                        </div>
                    </template>

                    <!--profile menu-->
                    <v-list class="profile-list-popup bg-primary text-white px-4 py-3">

                        <div class="d-flex justify-space-between align-center w-100 ">
                            <span class="text-caption font-weight-light text-grey-lighten-2">
                                {{ $t('navigation.loggedInAs') }}
                            </span>

                            <v-btn
                                @click="authStore.logout()"
                                variant="text"
                                class="logout-wrap text-caption font-weight-light d-flex align-center"
                            >
                                <span class="text-grey-lighten-2 mr-1">Log out</span>
                                <v-icon class="logout-icon">mdi-logout</v-icon>
                            </v-btn>

                        </div>


                        <div class="text-h6 font-weight-bold leading-tight mt-0" style="line-height: 1.2;">
                            {{ userAccountStore.userAccount?.name }}<br />
                            {{ userAccountStore.userAccount?.surname }}
                        </div>


                        <div class="text-caption font-weight-light text-grey-lighten-2 mt-12 mb-0">
                            Personal
                        </div>

                        <div class="custom-white-divider my-0"></div>

                        <v-list-item class="pt-0 pb-1 px-4">
                            <router-link class="link-color text-decoration-none nav-link text-white text-body-2" :to="constants.PROFILE_ROUTE">{{ translate("titles.profileSettings") }}</router-link>
                        </v-list-item>


                        <div class="text-caption font-weight-light text-grey-lighten-2 mt-3 mb-0">
                            User Guide
                        </div>

                        <div class="custom-white-divider my-0"></div>

                        <v-list-item class="pt-0 pb-1 px-4">
                            <v-list-item-title class="text-white text-body-2">
                                Documentation
                            </v-list-item-title>
                        </v-list-item>
                        <v-divider class="border-opacity-25" :thickness="1"></v-divider>
                        <v-list-item
                            tabindex="0"
                            class="text-decoration-underline text-blue mx-auto"
                            @click="authStore.logout()"
                        >
                            <v-list-item-title class="mx-auto">{{ $t("navigation.signOut") }}</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
        </template>
    </v-app-bar>

    <!---------------main navigation drawer----------------->
    <v-navigation-drawer v-model="navigationDrawer" :permanent="true" width="70" class="mt-0">
        <v-list lines="two" class="pt-0">
            <v-list-item v-if="canAccessNavigationOverview" link elevation="0" :to="getNavigationOverviewRoute()"
                variant="elevated" class="d-flex flex-column justify-center text-center"
                :class="[navigationStore.isNavigationOverviewOpen ? 'navigation-overview-background' : '']">

                <template v-if="navigationStore.isNavigationOverviewOpen">
                    <v-icon icon="mdi-close" color="white"></v-icon>
                </template>

                <template v-else>
                    <v-icon icon="mdi-menu" color="#797979"></v-icon>
                </template>

            </v-list-item>

            <v-divider></v-divider>

            <!--------navigation items---------->
            <template v-for="{ title, route, icon } in mainNavigationLinks" :key="title">
                <v-list-item link :to="route" color="#215caf" class="d-flex flex-column justify-center text-center">

                    <template v-slot:default="{ isActive }">
                        <v-icon :icon="icon" :color="isActive ? '' : '#797979'">
                        </v-icon>

                        <span class="text-caption">{{ title }}</span>

                    </template>
                </v-list-item>

                <v-divider></v-divider>

            </template>

        </v-list>
    </v-navigation-drawer>

    <!--main content view-->
    <v-main
        :class="[
      isNavOverviewRoute || layoutStore.isBlueBackground
        ? 'blue-background'
        : 'generic-background'
    ]"
    >
        <v-container fluid class="main-content">
            <router-view />
        </v-container>
    </v-main>

</template>

<script setup lang="ts">
    import {ref, watch, onBeforeMount} from "vue"
    import {useAppBarStore, useLayoutStore, useNavigationStore} from "@/stores/store";
    import {useAuthStore, useUserAccountStore} from "@/stores/authentication/authenticationStore";
    import * as userAccountViewService from "@/services/seb-server/component-services/userAccountViewService";
    import {useTheme} from "vuetify";
    import {useI18n} from "vue-i18n";
    import * as constants from "@/utils/constants";
    import router from "@/router/router";
    import {translate} from "@/utils/generalUtils";
    import {UserRoleEnum} from "@/models/userRoleEnum";


    //i18n
    const {locale} = useI18n();
    const localStorageLocale: string | null = localStorage.getItem("locale");
    locale.value = localStorageLocale ?? "en";
    const languageToggle = ref<number>(locale.value === "en" ? 0 : 1);
    const layoutStore = useLayoutStore();
    const isNavOverviewRoute = computed(() => {
        return router.currentRoute.value.path === constants.NAVIGATION_OVERVIEW_ROUTE;
    });

    locale.value = localStorageLocale ?? "en";

    //main navigation
    const navigationDrawer = ref();
    const mainNavigationLinks: NavigationItem[] = [
        {title: translate('titles.home'), route: constants.HOME_PAGE_ROUTE, icon: "mdi-home"},
        {title: translate('titles.exams'), route: constants.EXAM_ROUTE, icon: "mdi-file-document"},
        {title: translate('titles.monitoring'), route: constants.MONITORING_ROUTE, icon: "mdi-eye"},
        // {title: 'Screen Proctoring', route: spConstants.RUNNING_EXAMS_ROUTE, icon: "mdi-video"},
    ];

    //stores
    const authStore = useAuthStore();
    const appBarStore = useAppBarStore();
    const userAccountStore = useUserAccountStore();
    const navigationStore = useNavigationStore();
    const ALLOWED_ROLES: string[] = [UserRoleEnum.INSTITUTIONAL_ADMIN, UserRoleEnum.SEB_SERVER_ADMIN];


    const userAccount = computed(() => userAccountStore.userAccount);
    const userRoles = computed(() => userAccount.value?.userRoles || []);
    const hasMultipleRoles = computed(() => userRoles.value.length > 1);
    const userRoleDisplay = computed(() =>
        userRoles.value.length === 1 ? userRoles.value[0] : 'Roles:'
    );
    //theme
    const theme = useTheme();
    const localstorageTheme: string | null = localStorage.getItem("theme");
    theme.global.name.value = localstorageTheme ?? theme.global.name.value ?? "light";
    const themeToggle = ref<number>(theme.global.name.value === "dark" ? 1 : 0);

    const canAccessNavigationOverview = computed(() => {
        const roles = userAccountStore.userAccount?.userRoles ?? [];
        return roles.some(role => ALLOWED_ROLES.includes(role));
    });

    watch(languageToggle, () => {
        locale.value = languageToggle.value === 0 ? "en" : "de";
        localStorage.setItem("locale", locale.value);
    });

    watch(themeToggle, () => {
        theme.global.name.value = themeToggle.value === 0 ? "light" : "dark";
        localStorage.setItem("theme", theme.global.name.value);
    });

    const ROLE_PRIORITY = [
        "EXAM_ADMIN",
        "EXAM_SUPPORTER",
        "SEB_SERVER_ADMIN",
        "INSTITUTIONAL_ADMIN"
    ];

    const highestPriorityRole = computed(() => {
        const roles = userAccountStore.userAccount?.userRoles ?? [];
        return ROLE_PRIORITY.find(role => roles.includes(role)) ?? '';
    });

    function translateRole(role: string): string {
        switch (role) {
            case 'EXAM_ADMIN': return 'Exam Admin';
            case 'EXAM_SUPPORTER': return 'Exam Supporter';
            case 'SEB_SERVER_ADMIN': return 'SEB Server Admin';
            case 'INSTITUTIONAL_ADMIN': return 'Institutional Admin';
            default: return role;
        }
    }

    //1. here
    async function userMenuOpened() {
        await userAccountViewService.setPersonalUserAccount();
    }

    function getNavigationOverviewRoute(): string {
        if (navigationStore.isNavigationOverviewOpen && router.options.history.state.back != null) {
            return router.options.history.state.back.toString();
        }

        if (!navigationStore.isNavigationOverviewOpen) {
            return constants.NAVIGATION_OVERVIEW_ROUTE;
        }
        return constants.HOME_PAGE_ROUTE;
    }

    function getHomePageRoute() {
        if (import.meta.env.VITE_SUB_PATH == null) {
            return constants.HOME_PAGE_ROUTE;
        }
        return import.meta.env.VITE_SUB_PATH + constants.HOME_PAGE_ROUTE;
    }
</script>

<style scoped>
    .main-content {
        /* background-color: #e4e4e4; */
    }

    .user-name {
        font-size: 0.9rem;
    }

    .user-role-badge {
        font-size: 0.9rem;
        border-radius: 4px;
        font-weight: 500;
        line-height: 1;
        min-width: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        cursor: pointer;
    }

    .navigation-overview-background {
        background-color: #215caf;
    }

    .generic-background {
        background-color: #f6f6f6;
    }

    .blue-background {
        background-color: #215caf;
    }

    .fade-in-arrow {
        opacity: 0;
        transition: opacity 0.2s ease;
        margin-left: auto;
    }

    .fade-in-visible {
        opacity: 1;
    }

    .roles-list-popup {
        margin-top: 0.6rem !important;
        border-radius: 0 !important;
    }

    .profile-list-popup {
        margin-top: 0.47rem !important;
        border-radius: 0 !important;
        width: 20vw;
        min-width: 16rem;
        max-width: 90vw;
        left: 1vw !important;
        right: 0 !important;
    }

    .leading-tight {
        line-height: 1.2;
    }

    .logout-btn {
        padding: 0;
        min-width: unset;
        margin-right: 0.25rem;
        text-transform: none;
        color: #b0bec5;
    }

    .logout-icon {
        font-size: 1.3rem;
        font-weight: 300;
        line-height: 1;
        vertical-align: middle;
        color: #b0bec5;
    }

    @media (min-width: 960px) {
        .logout-icon {
            font-size: 1.5rem;
        }
    }

    .custom-white-divider {
        height: 1px;
        width: 100%;
        background-color: white;
        opacity: 1;
    }

    .bg-is-institutional-admin {
        background-color: #A30774 !important; /* Vuetify default red */
    }


    .fade-in-arrow {
        opacity: 0;
        transition: opacity 0.2s ease;
        margin-left: auto;
    }

    .fade-in-visible {
        opacity: 1;
    }

    .roles-list-popup {
        margin-top: 0.6rem !important;
        border-radius: 0 !important;
    }

    .profile-list-popup {
        margin-top: 0.47rem !important;
        border-radius: 0 !important;
        width: 20vw;
        min-width: 16rem;
        max-width: 90vw;
        left: 1vw !important;
        right: 0 !important;
    }

    .leading-tight {
        line-height: 1.2;
    }

    .logout-btn {
        padding: 0;
        min-width: unset;
        margin-right: 0.25rem;
        text-transform: none;
        color: #b0bec5;
    }

    .logout-icon {
        font-size: 1.3rem;
        font-weight: 300;
        line-height: 1;
        vertical-align: middle;
        color: #b0bec5;
    }

    @media (min-width: 960px) {
        .logout-icon {
            font-size: 1.5rem;
        }
    }

    .custom-white-divider {
        height: 1px;
        width: 100%;
        background-color: white;
        opacity: 1;
    }

    .bg-is-institutional-admin {
        background-color: #A30774 !important; /* Vuetify default red */
    }

</style>
