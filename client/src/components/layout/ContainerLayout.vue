<template>

    <v-app-bar>
        <!--menu icon-->
        <template v-slot:prepend>
            <v-img :width=50 src="/img/seb-logo-no-border.png"></v-img>
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
                        <v-btn v-bind="props" color="primary" icon="mdi-account-circle" size="x-large" @click="userMenuOpened()"></v-btn>
                    </template>

                    <v-list>
                        <!-- <v-list-item class="d-flex">
                            <v-list-item-title>{{ $t('navigation.loggedInAs') }}: {{ userAccountStore.userAccount?.name }}</v-list-item-title>
                        </v-list-item> -->

                        <!-- <v-list-item class="d-flex" :to=constants.ACCOUNT_VIEW_ROUTE>
                            <v-list-item-title>{{ $t('navigation.accountSettings') }}</v-list-item-title>
                        </v-list-item> -->

                        <v-divider></v-divider>

                        <!-- <v-list-item>
                            <v-btn-toggle v-model="languageToggle" variant="text" mandatory>
                                <v-btn>EN</v-btn>
                                <v-btn>DE</v-btn>
                            </v-btn-toggle>
                        </v-list-item> -->

                        <!-- <v-list-item>
                            <v-btn-toggle v-model="themeToggle" variant="text" mandatory>
                                <v-btn icon="mdi-white-balance-sunny"></v-btn>
                                <v-btn icon="mdi-weather-night"></v-btn>
                            </v-btn-toggle>
                        </v-list-item> -->

                        <v-divider></v-divider>

                        <v-list-item tabindex="0" class="text-decoration-underline text-blue mx-auto" @click="authStore.logout()">
                            <v-list-item-title class="mx-auto">{{ $t("navigation.signOut") }}</v-list-item-title>
                        </v-list-item>

                        <!-- <v-divider></v-divider>

                        <v-list-item class="d-flex">
                            <v-list-item-title>GUI Version: {{ gitTag }}</v-list-item-title>
                        </v-list-item> -->

                    </v-list>
                </v-menu>
            </div>

        </template>

    </v-app-bar>

    <!---------------main navigation drawer----------------->
    <v-navigation-drawer v-model="drawer" :permanent="true" rail>
        <!-- <v-list>
        </v-list> -->


        <v-list lines="two">
            <v-list-item prepend-icon="mdi-menu"></v-list-item>
            <v-divider></v-divider>

            <v-list-item v-for="{title, route, icon} in mainNavigationLinks"
                :key="title" 
                :to="route" 
                :prepend-icon="icon"
                color="#215caf"
                @click="changeNavigation(title, route)"
                link>
                <v-tooltip activator="parent">
                    {{title}}
                </v-tooltip>
            </v-list-item>
            <v-divider></v-divider>

        </v-list>
    </v-navigation-drawer>
    <!------------------------------------------------------>

    <!---------------detailed navigation drawer------------->
    <!-- <v-navigation-drawer v-model="drawer" :permanent="true" rail>
        <v-list>
            <v-list-item v-for="{title, route, icon} in detailedNavigationLinks[currentNavigationCategory]" 
                :key="title" 
                :to="route" 
                :prepend-icon="icon"
                @click="changeTitle(title)"
                link>
                <v-tooltip activator="parent">
                    {{title}}
                </v-tooltip>
            </v-list-item>
        </v-list>
    </v-navigation-drawer> -->
    <!------------------------------------------------------>

    <!--main content view-->
    <v-main>
        <v-container fluid class="main-content">
            <router-view></router-view>
        </v-container>
    </v-main>

</template>

<script setup lang="ts">
    import { ref, watch, onBeforeMount } from "vue"
    import { useAuthStore, useUserAccountStore, useAppBarStore } from "@/stores/store";
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import { useTheme } from "vuetify";
    import { useI18n } from "vue-i18n";
    import * as constants from "@/utils/constants";
    import router from "@/router/router";


    //--------navigation-------
    const drawer = ref();
    const currentNavigationCategory = ref<string>(constants.HOME_PAGE_ROUTE);

    //main navigation
    const mainNavigationLinks: NavigationItem[] = [
        {title: constants.HOME_PAGE_TITLE, route: constants.HOME_PAGE_ROUTE, icon: "mdi-home"},
        {title: constants.EXAMS_TITLE, route: constants.EXAM_ROUTE, icon: "mdi-school"},
    ];

    //start navigation
    const startNavigationLinks: NavigationItem[] = [
        {title: constants.HOME_PAGE_TITLE, route: constants.HOME_PAGE_ROUTE, icon: "mdi-home"},
    ];

    //exam navigation
    const examNavigationLinks: NavigationItem[] = [
        {title: constants.EXAMS_OVERVIEW_TITLE, route: constants.EXAM_ROUTE, icon: "mdi-text-box-check"},
        {title: constants.EXAMS_LMS_IMPORT_TITLE, route: constants.EXAM_LMS_IMPORT_ROUTE, icon: "mdi-import"},
    ];

    //detailed navigation overview
    const detailedNavigationLinks: DetailedNavigationLinks = {
        [constants.HOME_PAGE_ROUTE]: startNavigationLinks,
        [constants.EXAM_ROUTE]: examNavigationLinks,
    };
    //-------------------------


    //stores
    const authStore = useAuthStore();
    const appBarStore = useAppBarStore();
    const userAccountStore = useUserAccountStore();

    //theme
    const theme = useTheme();
    const localstorageTheme: string | null = localStorage.getItem("theme");
    theme.global.name.value = localstorageTheme ?? theme.global.name.value ?? "light";
    const themeToggle = ref<number>(theme.global.name.value === "dark" ? 1 : 0);


    //i18n
    const { locale } = useI18n();
    const localStorageLocale: string | null = localStorage.getItem("locale");
    locale.value = localStorageLocale ?? "en";
    const languageToggle = ref<number>(locale.value === "en" ? 0 : 1);
    
    //git tag
    //@ts-ignore
    // const gitTag = __GIT_TAG__;

    //watchers
    watch(drawer, () => {
        let route: string | any = router.currentRoute.value.fullPath;
        let title: string | any = router.currentRoute.value.meta.title

        if(route != null){
            route = getMainRoute(route);
            currentNavigationCategory.value = route;
        }

        if(title != null){
            appBarStore.title = getTitle(title);
        }

        
    });

    watch(languageToggle, () => {
        locale.value = languageToggle.value === 0 ? "en" : "de";
        localStorage.setItem("locale", locale.value);
    });

    watch(themeToggle, () => {
        theme.global.name.value = themeToggle.value === 0 ? "light" : "dark";
        localStorage.setItem("theme", theme.global.name.value);
    });


    async function userMenuOpened(){
        // await userAccountViewService.setPersonalUserAccount();
    }

    function changeNavigation(title: string, route: string){
        appBarStore.title = title;
        currentNavigationCategory.value = route;
    }

    function changeTitle(title: string){
        appBarStore.title = title;
    }

    function getMainRoute(route: string): string{
        const routeSplitted: string[] = route.split("/");

        if(routeSplitted.length >= 3){
            return "/" + routeSplitted[1];
        }

        return route;
    }

    function getTitle(title: string): string{
        const titleSplitted: string[] = title.split("|");

        if(titleSplitted.length >= 2){
            return titleSplitted[0].substring(0, titleSplitted[0].length-1);
        }

        return title;
    }

</script>  

<style scoped>
    .app-title{
        text-align: center;
    }

    .app-bar-item-margin{
        margin-right: 10px;
    }

    .switch-container{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        margin-right: 10px;
    }

    .main-content{
        background-color: #e4e4e4;
    }

</style>