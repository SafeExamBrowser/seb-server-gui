<template>

    <v-app-bar app>
        <!--seb logo-->
        <template v-slot:prepend>
            <a :href="getHomePageRoute()" class="text-decoration-none text-black">
                <v-img :width=50 src="/img/seb-logo-no-border.png"
                    :alt="translate('navigation.screenReader.titleImage')"></v-img>
            </a>
        </template>

        <!--current site title-->
        <v-app-bar-title>
            <h1 class="title-inherit-styling">{{appBarStore.title}}</h1>
        </v-app-bar-title>

        <template v-slot:append>

            <!--exams overview specfic items-->
            <template v-if="useRoute().name == 'ExamsOverview'">
                <div class="mr-4">
                    <v-menu :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                            <v-btn
                                aria-label="Running Exams Settings"
                                icon="mdi-cog"
                                v-bind="props"
                                color="primary">
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-switch
                                    hide-details
                                    class="mx-auto"
                                    label="Show past exams"
                                    color="primary"
                                    v-model="appBarStore.examOverviewShowPastExams">
                                </v-switch>
                            </v-list-item>
                            <v-list-item>
                                <v-switch
                                    hide-details
                                    class="mx-auto"
                                    label="Show upcoming exams"
                                    color="primary"
                                    v-model="appBarStore.examOverviewShowUpcomingExams">
                                </v-switch>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </template>
            <!-------–--------------------->

            <!--gallery view specfic items-->
            <template v-if="useRoute().name == 'GalleryViewPage'">

                <!--session infos-->
                <v-chip class="mr-4" role="none">
                    {{ translate("galleryView.generalInfo.page") }}: {{ appBarStore.galleryCurrentPage }} / {{ appBarStore.galleryMaxPages }}
                </v-chip>
                <v-chip class="mr-4" role="none">
                    {{ translate("galleryView.generalInfo.sessions") }}: {{ appBarStore.galleryLiveSessions }} / {{ appBarStore.galleryAmountOfSessions }}
                    <v-tooltip
                        role="none"
                        activator="parent"
                        location="bottom"
                        :aria-label="translate('galleryView.generalInfo.sessionsTooltip')">
                        {{ translate("galleryView.generalInfo.sessionsTooltip") }}
                    </v-tooltip>
                </v-chip>

                <!--change grid size-->
                <div class="mr-4">
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" rounded="sm" color="primary" variant="flat">
                                <v-icon start icon="mdi-chevron-down" size="x-large"></v-icon>
                                {{ translate("galleryView.gridSize") }}: {{ appBarStore.galleryGridSize.title }}
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item class="d-flex justify-center align-center" v-for="(gridSize, index) in gridSizes" :key="index" :value="index" @click="changeGridSize(gridSize)">
                                <v-list-item-title>{{ gridSize.title }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>

                <!--settings-->
                <div>
                    <v-menu :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                            <v-btn
                                :aria-label="translate('galleryView.screenReader.settings')"
                                icon="mdi-cog"
                                v-bind="props"
                                color="primary">
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-switch class="mx-auto" :label="translate('galleryView.showName')" color="primary" v-model="appBarStore.galleryIsNameEnabled" hide-details></v-switch>
                                <v-switch class="mx-auto" :label="translate('galleryView.showIp')" color="primary" v-model="appBarStore.galleryIsIpEnabled" hide-details></v-switch>
                            </v-list-item>

                            <v-divider></v-divider>

                            <v-list-item>
                                <v-btn
                                    variant="outlined"
                                    @click="appBarStore.galleryIsNameSortAsc = !appBarStore.galleryIsNameSortAsc">
                                    {{ translate("galleryView.sortByName") }}
                                    <template v-slot:append>
                                        <v-icon size="x-large" :icon="appBarStore.galleryIsNameSortAsc ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
                                    </template>
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>

            </template>
            <!----------------------------->

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
                                {{ translate('navigation.loggedInAs') }}
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
                            <router-link class="link-color text-decoration-none nav-link text-white text-body-2" :to="`${constants.PROFILE_ROUTE}`">{{ translate("titles.profileSettings") }}</router-link>
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
                    </v-list>
                </v-menu>
            </div>
        </template>
    </v-app-bar>

    <!---------------main navigation drawer----------------->
    <v-navigation-drawer app v-model="navigationDrawer" :permanent="true" width="70" class="mt-0">
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
    <v-main class="d-flex flex-column fill-height">
        <div
            :class="[
      isNavOverviewRoute || layoutStore.isBlueBackground
        ? 'full-page-blue'
        : 'full-page-default'
    ]"
            style="min-height: 100%; width: 100%;"
        >
            <v-container fluid class="flex-grow-1">
                <router-view />
            </v-container>
        </div>
    </v-main>

</template>

<script setup lang="ts">
    import {ref, watch} from "vue"
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
    const languageToggle = ref<number>(locale.value === "en" ? 0 : 1);
    const layoutStore = useLayoutStore();
    const isNavOverviewRoute = computed(() => {
        return router.currentRoute.value.path === constants.NAVIGATION_OVERVIEW_ROUTE;
    });

    locale.value = localStorageLocale ?? "en";

    //main navigation
    const navigationDrawer = ref();
    const mainNavigationLinks: NavigationItem[] = [
        {title: translate("titles.home"), route: constants.HOME_PAGE_ROUTE, icon: "mdi-home"},
        {title: translate("titles.exams"), route: constants.EXAM_ROUTE, icon: "mdi-file-document"},
        {title: translate("titles.monitoring"), route: constants.MONITORING_ROUTE, icon: "mdi-eye"},
        // {title: "Screen Proctoring", route: spConstants.RUNNING_EXAMS_ROUTE, icon: "mdi-video"},
    ];

    //gallery view
    const gridSizes: GridSize[] = [
        {title: "2x2", value: 2},
        {title: "3x3", value: 3},
        {title: "4x4", value: 4}
    ];


    //stores
    const authStore = useAuthStore();
    const appBarStore = useAppBarStore();
    const userAccountStore = useUserAccountStore();
    const navigationStore = useNavigationStore();
    const ALLOWED_ROLES: string[] = [UserRoleEnum.INSTITUTIONAL_ADMIN, UserRoleEnum.SEB_SERVER_ADMIN];


    const userAccount = computed(() => userAccountStore.userAccount);
    const userRoles = computed(() => userAccount.value?.userRoles || []);

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

    function translateRole(role: string): string {
        switch (role) {
            case "EXAM_ADMIN": return "Exam Admin";
            case "EXAM_SUPPORTER": return "Exam Supporter";
            case "SEB_SERVER_ADMIN": return "SEB Server Admin";
            case "INSTITUTIONAL_ADMIN": return "Institutional Admin";
            case "TEACHER": return "Teacher";

            default: return role;
        }
    }

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

    //gallery view
    function changeGridSize(gridSize: GridSize){
        appBarStore.galleryGridSize = gridSize;
    }

</script>

<style scoped>
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
        margin-top: 0.62rem !important;
        border-radius: 0 !important;
    }

    .profile-list-popup {
        margin-top: 0.50rem !important;
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
        margin-top: 0.62rem !important;
        border-radius: 0 !important;
    }

    .profile-list-popup {
        margin-top: 0.50rem !important;
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

     .full-page-blue {
         background-color: #215caf;
         min-height: 100%;
         width: 100%;
     }

    .full-page-default {
        background-color: #f6f6f6;
        min-height: 100%;
        width: 100%;
    }
</style>
