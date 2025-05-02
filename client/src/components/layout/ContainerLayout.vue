<template>

    <v-app-bar>
        <!--seb logo-->
        <template v-slot:prepend >
            <a :href="getHomePageRoute()" class="text-decoration-none text-black">
                <v-img :width=50 src="/img/seb-logo-no-border.png" :alt="translate('navigation.screenReader.titleImage')"></v-img>
            </a>
        </template>

        <!--current site title-->
        <v-app-bar-title>
            <h1 class="title-inherit-styling">{{ appBarStore.title }}</h1>
        </v-app-bar-title>

        <template v-slot:append>

            <!--profile icon menu-->
            <div class="profile-icon-container" aria-label="Profile">
                <v-menu :close-on-content-click="false">

                    <template v-slot:activator="{ props }">
                        <v-btn 
                            :aria-label="translate('navigation.screenReader.profile')"
                            v-bind="props" 
                            color="primary" 
                            icon="mdi-account-circle" 
                            size="x-large" 
                            @click="userMenuOpened()">
                        </v-btn>
                    </template>

                    <v-list>
                        <v-list-item class="d-flex">
                            <v-list-item-title>{{ $t('navigation.loggedInAs') }} {{ userAccountStore.userAccount?.name }}</v-list-item-title>
                        </v-list-item>

                        <!-- <v-list-item class="d-flex" :to=constants.ACCOUNT_VIEW_ROUTE>
                            <v-list-item-title>{{ $t('navigation.accountSettings') }}</v-list-item-title>
                        </v-list-item> -->

                        <v-divider class="border-opacity-25" :thickness="1"></v-divider>

                        <v-list-item tabindex="0" class="text-decoration-underline text-blue mx-auto" @click="authStore.logout()">
                            <v-list-item-title class="mx-auto">{{ $t("navigation.signOut") }}</v-list-item-title>
                        </v-list-item>

                    </v-list>
                </v-menu>
            </div>

        </template>

    </v-app-bar>

    <!---------------main navigation drawer----------------->
    <v-navigation-drawer v-model="navigationDrawer" :permanent="true" width="70">
        <v-list lines="two">
            <!--------navigation overview---------->
            <v-list-item 
                link
                elevation="0"
                :to="getNavigationOverviewRoute()"
                variant="elevated"
                class="d-flex flex-column justify-center text-center"
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
                <v-list-item 
                    link
                    :to="route"
                    color="#215caf"
                    class="d-flex flex-column justify-center text-center">

                    <template v-slot:default="{isActive}">
                        <v-icon 
                            :icon="icon" 
                            :color="isActive ? '' : '#797979'">
                        </v-icon>

                        <span class="text-caption">{{ title }}</span>

                    </template>
                </v-list-item>

                <v-divider></v-divider>

            </template>

        </v-list>
    </v-navigation-drawer>
    <!------------------------------------------------------>

    <!--main content view-->
    <v-main :class="[router.currentRoute.value.path == constants.NAVIGATION_OVERVIEW_ROUTE ? 'navigation-overview-background' : 'generic-background']">
        <v-container fluid class="main-content">
            <router-view></router-view>
        </v-container>
    </v-main>

</template>

<script setup lang="ts">
    import { ref, watch, onBeforeMount } from "vue"
    import { useAuthStore, useUserAccountStore, useAppBarStore, useNavigationStore } from "@/stores/store";
    import * as userAccountViewService from "@/services/seb-server/component-services/userAccountViewService";
    import { useTheme } from "vuetify";
    import { useI18n } from "vue-i18n";
    import * as constants from "@/utils/constants";
    import router from "@/router/router";
    import {translate} from "@/utils/generalUtils";
    import * as spConstants from "@/utils/sp-constants";


    //i18n
    const { locale } = useI18n();
    const localStorageLocale: string | null = localStorage.getItem("locale");
    locale.value = localStorageLocale ?? "en";
    const languageToggle = ref<number>(locale.value === "en" ? 0 : 1);


    //main navigation
    const navigationDrawer = ref();
    const mainNavigationLinks: NavigationItem[] = [
        {title: translate('titles.home'), route: constants.HOME_PAGE_ROUTE, icon: "mdi-home"},
        {title: translate('titles.exams'), route: constants.EXAM_ROUTE, icon: "mdi-file-document"},
        {title: translate('titles.monitoring'), route: constants.MONITORING_ROUTE, icon: "mdi-eye"},
        {title: 'Screen Proctoring', route: spConstants.RUNNING_EXAMS_ROUTE, icon: "mdi-video"},
    ];

    //stores
    const authStore = useAuthStore();
    const appBarStore = useAppBarStore();
    const userAccountStore = useUserAccountStore();
    const navigationStore = useNavigationStore();

    //theme
    const theme = useTheme();
    const localstorageTheme: string | null = localStorage.getItem("theme");
    theme.global.name.value = localstorageTheme ?? theme.global.name.value ?? "light";
    const themeToggle = ref<number>(theme.global.name.value === "dark" ? 1 : 0);


    watch(languageToggle, () => {
        locale.value = languageToggle.value === 0 ? "en" : "de";
        localStorage.setItem("locale", locale.value);
    });

    watch(themeToggle, () => {
        theme.global.name.value = themeToggle.value === 0 ? "light" : "dark";
        localStorage.setItem("theme", theme.global.name.value);
    });


    async function userMenuOpened(){
        await userAccountViewService.setPersonalUserAccount();
    }

    function getNavigationOverviewRoute(): string{
        if(navigationStore.isNavigationOverviewOpen && router.options.history.state.back != null){
            return router.options.history.state.back.toString();
        }

        if(!navigationStore.isNavigationOverviewOpen){
            return constants.NAVIGATION_OVERVIEW_ROUTE;
        }

        return constants.HOME_PAGE_ROUTE;
    }

    function getHomePageRoute(){
        if(import.meta.env.VITE_SUB_PATH == null){
            return constants.HOME_PAGE_ROUTE;
        }

        return import.meta.env.VITE_SUB_PATH + constants.HOME_PAGE_ROUTE;
    }

</script>  

<style scoped>

    .main-content{
        /* background-color: #e4e4e4; */
    }

    .v-list{
        padding: 0;
    }

    .navigation-overview-background{
        background-color: #215caf;
    }

    .generic-background{
        background-color: #f6f6f6;
    }

</style>