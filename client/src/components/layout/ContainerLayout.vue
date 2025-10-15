<template>
    <v-app-bar data-testid="layout-app-bar">
        <!--seb logo-->
        <template #prepend>
            <a
                class="text-decoration-none text-black"
                data-testid="layout-appLogo-link"
                :href="getHomePageRoute()"
            >
                <v-img
                    :alt="translate('navigation.screenReader.titleImage')"
                    src="/img/seb-logo-no-border.png"
                    :width="50"
                ></v-img>
            </a>
        </template>

        <!--current site title-->
        <v-app-bar-title class="d-flex align-center justify-center flex-grow-1">
            <div class="title-center">
                <img
                    v-if="institutionLogo"
                    alt="Institution Logo"
                    class="title-logo"
                    :src="institutionLogo"
                />
                <h1
                    class="title-inherit-styling mb-0"
                    data-testid="layout-institutionTitle-text"
                >
                    {{ effectiveTitle }}
                </h1>
            </div>
        </v-app-bar-title>

        <template #append>
            <!--exams overview specfic items-->
            <template v-if="useRoute().name == 'ExamsOverview'">
                <div class="mr-4">
                    <v-menu :close-on-content-click="false">
                        <template #activator="{ props }">
                            <v-btn
                                aria-label="Running Exams Settings"
                                v-bind="props"
                                color="primary"
                                icon="mdi-cog"
                            >
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-switch
                                    v-model="
                                        appBarStore.examOverviewShowPastExams
                                    "
                                    class="mx-auto"
                                    color="primary"
                                    hide-details
                                    label="Show past exams"
                                >
                                </v-switch>
                            </v-list-item>
                            <v-list-item>
                                <v-switch
                                    v-model="
                                        appBarStore.examOverviewShowUpcomingExams
                                    "
                                    class="mx-auto"
                                    color="primary"
                                    hide-details
                                    label="Show upcoming exams"
                                >
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
                    {{ translate("galleryView.generalInfo.page") }}:
                    {{ appBarStore.galleryCurrentPage }} /
                    {{ appBarStore.galleryMaxPages }}
                </v-chip>
                <v-chip class="mr-4" role="none">
                    {{ translate("galleryView.generalInfo.sessions") }}:
                    {{ appBarStore.galleryLiveSessions }} /
                    {{ appBarStore.galleryAmountOfSessions }}
                    <v-tooltip
                        activator="parent"
                        :aria-label="
                            translate('galleryView.generalInfo.sessionsTooltip')
                        "
                        location="bottom"
                        role="none"
                    >
                        {{
                            translate("galleryView.generalInfo.sessionsTooltip")
                        }}
                    </v-tooltip>
                </v-chip>

                <!--change grid size-->
                <div class="mr-4">
                    <v-menu>
                        <template #activator="{ props }">
                            <v-btn
                                v-bind="props"
                                color="primary"
                                rounded="sm"
                                variant="flat"
                            >
                                <v-icon
                                    icon="mdi-chevron-down"
                                    size="x-large"
                                    start
                                ></v-icon>
                                {{ translate("galleryView.gridSize") }}:
                                {{ appBarStore.galleryGridSize.title }}
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                                v-for="(gridSize, index) in gridSizes"
                                :key="index"
                                class="d-flex justify-center align-center"
                                :value="index"
                                @click="changeGridSize(gridSize)"
                            >
                                <v-list-item-title>{{
                                    gridSize.title
                                }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>

                <!--settings-->
                <div>
                    <v-menu :close-on-content-click="false">
                        <template #activator="{ props }">
                            <v-btn
                                :aria-label="
                                    translate(
                                        'galleryView.screenReader.settings',
                                    )
                                "
                                v-bind="props"
                                color="primary"
                                icon="mdi-cog"
                            >
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item>
                                <v-switch
                                    v-model="appBarStore.galleryIsNameEnabled"
                                    class="mx-auto"
                                    color="primary"
                                    hide-details
                                    :label="translate('galleryView.showName')"
                                ></v-switch>
                                <v-switch
                                    v-model="appBarStore.galleryIsIpEnabled"
                                    class="mx-auto"
                                    color="primary"
                                    hide-details
                                    :label="translate('galleryView.showIp')"
                                ></v-switch>
                            </v-list-item>

                            <v-divider></v-divider>

                            <v-list-item>
                                <v-btn
                                    variant="outlined"
                                    @click="
                                        appBarStore.galleryIsNameSortAsc =
                                            !appBarStore.galleryIsNameSortAsc
                                    "
                                >
                                    {{ translate("galleryView.sortByName") }}
                                    <template #append>
                                        <v-icon
                                            :icon="
                                                appBarStore.galleryIsNameSortAsc
                                                    ? 'mdi-chevron-up'
                                                    : 'mdi-chevron-down'
                                            "
                                            size="x-large"
                                        ></v-icon>
                                    </template>
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </template>
            <!----------------------------->

            <!--profile icon menu-->
            <div
                aria-label="Profile"
                class="profile-icon-container d-flex align-center"
            >
                <div
                    class="user-header-container d-flex flex-column align-center mr-2"
                >
                    <span class="user-name">{{
                        userAccountStore.userAccount?.username
                    }}</span>
                    <v-menu
                        v-if="userRoles.length > 1"
                        close-delay="100"
                        open-delay="0"
                        open-on-hover
                        transition="slide-y-transition"
                    >
                        <template #activator="{ props, isActive }">
                            <span
                                v-bind="props"
                                class="user-role-badge text-white bg-primary d-flex align-center justify-center px-3 py-1 role-badge-wrappe"
                            >
                                <span class="mx-auto">{{
                                    translateRole(sortedUserRoles[0])
                                }}</span>
                                <v-icon
                                    class="fade-in-arrow"
                                    :class="{ 'fade-in-visible': isActive }"
                                    size="small"
                                    style="position: absolute; right: 8px"
                                >
                                    mdi-chevron-down
                                </v-icon>
                            </span>
                        </template>

                        <v-list class="py-0 bg-primary roles-list-popup">
                            <v-list-item
                                v-for="role in sortedUserRoles"
                                :key="role"
                                class="text-body-2 px-4"
                            >
                                {{ translateRole(role) }}
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    <span
                        v-if="userRoles.length === 1"
                        :class="[
                            'user-role-badge text-white px-3 py-1',
                            userRoles[0] === 'INSTITUTIONAL_ADMIN'
                                ? 'bg-is-institutional-admin'
                                : 'bg-primary',
                        ]"
                    >
                        {{ translateRole(userRoles[0]) }}
                    </span>
                </div>
                <!--profile icon-->
                <v-menu
                    activator="parent"
                    attach="body"
                    :close-on-content-click="false"
                    content-class="profile-menu-override "
                >
                    <template #activator="{ props }">
                        <div class="d-flex align-center ml-1 mr-6">
                            <v-btn
                                v-bind="props"
                                class="rounded-circle text-primary d-flex align-center justify-center"
                                data-testid="layout-profile-button"
                                elevation="0"
                                style="
                                    background-color: transparent;
                                    border: 0.15rem solid #215caf;
                                    width: 3rem;
                                    height: 3rem;
                                    min-width: 3rem;
                                    padding: 0;
                                "
                                @click="userMenuOpened()"
                            >
                                <span
                                    style="font-weight: 500; font-size: 1.1rem"
                                >
                                    {{
                                        (userAccountStore.userAccount
                                            ?.name?.[0] || "") +
                                        (userAccountStore.userAccount
                                            ?.surname?.[0] || "")
                                    }}
                                </span>
                            </v-btn>
                            <v-icon
                                class="ml-1"
                                color="#777"
                                size="18"
                                style="margin-top: 1px"
                            >
                                mdi-chevron-down
                            </v-icon>
                        </div>
                    </template>

                    <!--profile menu-->
                    <v-list
                        class="profile-list-popup bg-primary text-white px-4 py-3"
                        data-testid="layout-profile-menu"
                    >
                        <div
                            class="d-flex justify-space-between align-center w-100"
                        >
                            <span
                                class="text-caption font-weight-light text-grey-lighten-2"
                            >
                                {{ translate("navigation.loggedInAs") }}
                            </span>

                            <v-btn
                                class="logout-wrap text-caption font-weight-light d-flex align-center"
                                data-testid="layout-logout-button"
                                variant="text"
                                @click="authStore.logout()"
                            >
                                <span class="text-grey-lighten-2 mr-1"
                                    >Log out</span
                                >
                                <v-icon class="logout-icon">mdi-logout</v-icon>
                            </v-btn>
                        </div>

                        <div
                            class="text-h6 font-weight-bold leading-tight mt-0"
                            style="line-height: 1.2"
                        >
                            {{ userAccountStore.userAccount?.name }}<br />
                            {{ userAccountStore.userAccount?.surname }}
                        </div>

                        <div
                            class="text-caption font-weight-light text-grey-lighten-2 mt-12 mb-0"
                        >
                            Personal
                        </div>

                        <div class="custom-white-divider my-0"></div>

                        <v-list-item class="pt-0 pb-1 px-4">
                            <router-link
                                class="link-color text-decoration-none nav-link text-white text-body-2"
                                :to="`${constants.PROFILE_ROUTE}`"
                                >{{
                                    translate("titles.profileSettings")
                                }}</router-link
                            >
                        </v-list-item>

                        <div
                            class="text-caption font-weight-light text-grey-lighten-2 mt-3 mb-0"
                        >
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
    <v-navigation-drawer
        v-model="navigationDrawer"
        class="mt-0"
        data-testid="layout-nav-drawer"
        :permanent="true"
        width="70"
    >
        <v-list class="pt-0" lines="two">
            <v-list-item
                v-if="ability.canView(GUIComponent.NavigationOverview)"
                class="d-flex flex-column justify-center text-center"
                :class="[
                    navigationStore.isNavigationOverviewOpen
                        ? 'navigation-overview-background'
                        : '',
                ]"
                data-testid="layout-navOverview-toggle"
                elevation="0"
                link
                :to="getNavigationOverviewRoute()"
                variant="elevated"
            >
                <template v-if="navigationStore.isNavigationOverviewOpen">
                    <v-icon color="white" icon="mdi-close"></v-icon>
                </template>

                <template v-else>
                    <v-icon color="#797979" icon="mdi-menu"></v-icon>
                </template>
            </v-list-item>
            <v-divider></v-divider>

            <!--------navigation items---------->
            <template
                v-for="{ title, route, icon } in mainNavigationLinks"
                :key="title"
            >
                <v-list-item
                    class="d-flex flex-column justify-center text-center"
                    color="#215caf"
                    :data-testid="`layout-${route.replace('/', '') || 'home'}-button`"
                    link
                    :to="route"
                >
                    <template #default="{ isActive }">
                        <v-icon :color="isActive ? '' : '#797979'" :icon="icon">
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
                'fill-height pa-4 overflow-y-auto',
                isNavOverviewRoute || layoutStore.isBlueBackground
                    ? 'full-page-blue'
                    : 'full-page-default',
            ]"
            :data-testid="`${(useRoute().name || 'unknown').toString().toLowerCase()}-page-container`"
        >
            <router-view />
        </div>

        <!-- Toasts / Alerts -->
        <ToastContainer />
    </v-main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import {
    useAppBarStore,
    useLayoutStore,
    useNavigationStore,
} from "@/stores/store";
import {
    useUserAccountStore as useAuthenticatedUserAccountStore,
    useAuthStore,
    useUserAccountStore,
} from "@/stores/authentication/authenticationStore";
import * as userAccountViewService from "@/services/seb-server/component-services/userAccountViewService";
import { useTheme } from "vuetify";
import { useI18n } from "vue-i18n";
import * as constants from "@/utils/constants";
import router from "@/router/router";
import { translate } from "@/utils/generalUtils";
import { getInstitutions } from "@/services/seb-server/component-services/registerAccountViewService";
import { getInstitutionLogo } from "@/services/seb-server/api-services/institutionService";
import { GUIComponent, useAbilities } from "@/services/ability";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { GridSize, NavigationItem } from "@/models/types";

// i18n
const { locale } = useI18n();
const localStorageLocale: string | null = localStorage.getItem("locale");
const languageToggle = ref<number>(locale.value === "en" ? 0 : 1);
const layoutStore = useLayoutStore();
const authenticatedUserAccountStore = useAuthenticatedUserAccountStore();
const isNavOverviewRoute = computed(() => {
    return (
        router.currentRoute.value.path === constants.NAVIGATION_OVERVIEW_ROUTE
    );
});

locale.value = localStorageLocale ?? "en";

// main navigation
const navigationDrawer = ref();
const mainNavigationLinks: NavigationItem[] = [
    {
        title: translate("titles.home"),
        route: constants.HOME_PAGE_ROUTE,
        icon: "mdi-home",
    },
    {
        title: translate("titles.exams"),
        route: constants.EXAM_ROUTE,
        icon: "mdi-file-document",
    },
    {
        title: translate("titles.monitoring"),
        route: constants.MONITORING_ROUTE,
        icon: "mdi-eye",
    },
    // {title: "Screen Proctoring", route: spConstants.RUNNING_EXAMS_ROUTE, icon: "mdi-video"},
];
const institutions = ref<Institution[]>([]);
const institutionName = ref<string>();
const ability = useAbilities();

// gallery view
const gridSizes: GridSize[] = [
    { title: "2x2", value: 2 },
    { title: "3x3", value: 3 },
    { title: "4x4", value: 4 },
];

// stores
const authStore = useAuthStore();
const appBarStore = useAppBarStore();
const userAccountStore = useUserAccountStore();
const navigationStore = useNavigationStore();

const effectiveTitle = computed(() => {
    return institutionName.value?.length
        ? institutionName.value
        : appBarStore.title || "...";
});

const userAccount = computed(() => userAccountStore.userAccount);
const userRoles = computed(() => userAccount.value?.userRoles || []);

// theme
const theme = useTheme();

const localstorageTheme = localStorage.getItem("theme");

// initialize the theme
const initialTheme = localstorageTheme ?? "light";
theme.change(initialTheme);

// initialize the toggle based on initial theme
const themeToggle = ref<number>(initialTheme === "dark" ? 1 : 0);

const institutionLogo = ref<string | null>(null);

onMounted(async () => {
    const user = authenticatedUserAccountStore.userAccount;
    const userInstitutionId = String(user?.institutionId);

    const result: Institution[] | null = await getInstitutions();
    institutions.value = result ?? [];

    const matchedInstitution = institutions.value.find(
        (inst) => inst.modelId === userInstitutionId,
    );
    if (matchedInstitution) {
        institutionName.value = matchedInstitution.name;

        const logoBase64: string = await getInstitutionLogo(
            matchedInstitution.name,
        );
        if (logoBase64) {
            institutionLogo.value = `data:image/png;base64,${logoBase64}`;
        }
    }
});

// watch(userRoles, (roles) => {
//     ability.update(defineRulesForRoles(roles).rules)
//     console.log("user roles: ", userRoles.value)
// }, { immediate: true })

watch(languageToggle, () => {
    locale.value = languageToggle.value === 0 ? "en" : "de";
    localStorage.setItem("locale", locale.value);
});

watch(themeToggle, () => {
    const next = themeToggle.value === 0 ? "light" : "dark";
    theme.change(next);
    localStorage.setItem("theme", next);
});

function translateRole(role: string): string {
    switch (role) {
        case "EXAM_ADMIN":
            return "Exam Admin";
        case "EXAM_SUPPORTER":
            return "Exam Supervisor";
        case "SEB_SERVER_ADMIN":
            return "SEB Server Admin";
        case "INSTITUTIONAL_ADMIN":
            return "Institutional Admin";
        case "TEACHER":
            return "Teacher";

        default:
            return role;
    }
}

const rolePriority = [
    "SEB_SERVER_ADMIN",
    "INSTITUTIONAL_ADMIN",
    "EXAM_ADMIN",
    "EXAM_SUPPORTER",
    "TEACHER",
];

const sortedUserRoles = computed(() => {
    return [...userRoles.value].sort((a, b) => {
        const indexA = rolePriority.indexOf(a);
        const indexB = rolePriority.indexOf(b);
        return indexA - indexB;
    });
});

async function userMenuOpened() {
    await userAccountViewService.setPersonalUserAccount();
}

function getNavigationOverviewRoute(): string {
    if (
        navigationStore.isNavigationOverviewOpen &&
        router.options.history.state.back != null
    ) {
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

// gallery view
function changeGridSize(gridSize: GridSize) {
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
    margin-top: 0.5rem !important;
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
    background-color: #a30774 !important;
}

.blue-background {
    background-color: #215caf;
}

.bg-is-institutional-admin {
    background-color: #a30774 !important;
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
    background-color: #a30774 !important;
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
    margin-top: 0.5rem !important;
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

.v-app-bar-title h1 {
    white-space: nowrap;
}

.full-page-blue {
    background-color: #215caf;
}

.full-page-default {
    background-color: #f6f6f6;
}

.v-app-bar-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    white-space: nowrap;
}

.title-logo {
    display: inline-block;
    max-height: 55px;
    height: 55px;
    width: auto;
    flex: 0 0 auto;
}

.title-center {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    white-space: nowrap;
}

.title-center .v-img {
    flex: 0 0 auto;
}

.floating-alert {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    max-width: 350px;
    z-index: 9999;
}
</style>
