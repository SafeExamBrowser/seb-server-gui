<template>
    <v-navigation-drawer v-model="drawer" :permanent="true">

        <v-sheet class="pa-4">
            <a :href=constants.START_PAGE_ROUTE class="text-decoration-none text-black">
                <v-img max-height="100" src="/img/seb-logo-no-border.png" alt="Seb Server Homepage"></v-img>
                <div class="app-title text-h6 text-title">{{ $t("navigation.title") }}</div>
            </a>
        </v-sheet>

        <v-list>
            <v-list-item v-for="[title, link] in navigationLinks" :key="title" :to="link" link>
                <v-list-item-title>{{ title }}</v-list-item-title>
            </v-list-item>
        </v-list>

    </v-navigation-drawer>

    <v-app-bar>
        <!--menu icon-->
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" aria-label="Navigation Bar" :aria-expanded="drawer">
        </v-app-bar-nav-icon>

        <!--current site title-->
        <v-app-bar-title>Start Page</v-app-bar-title>

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

    <!--main content view-->
    <v-main>
        <v-container fluid>
            <router-view></router-view>
        </v-container>
    </v-main>

</template>

<script setup lang="ts">
    import { ref, watch } from "vue"
    import { useAuthStore, useUserAccountStore } from "@/stores/app";
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import { useTheme } from "vuetify";
    import { useI18n } from "vue-i18n";
    import * as constants from "@/utils/constants";

    //navigation
    const drawer = ref();
    const navigationLinks = [
        ["Start Page", constants.START_PAGE_ROUTE],
    ];

    //stores
    const authStore = useAuthStore();
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
</style>