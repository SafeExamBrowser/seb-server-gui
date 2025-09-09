<template>
    <v-row
        class="navigation-overview-container"
        data-testid="navigationOverview-page-container"
    >
        <v-container class="ml-16 mr-0" fluid>
            <v-col>
                <v-sheet class="rounded-lg pa-4" color="primary" elevation="0">
                    <v-app-bar-title class="mb-16">
                        <h1
                            class="title-inherit-styling text-h4"
                            data-testid="navigationOverview-title-text"
                        >
                            {{ appBarStore.title }}
                        </h1>
                    </v-app-bar-title>

                    <v-row class="mt-4 mb-16 mr-0">
                        <!-- Settings -->
                        <v-col cols="3">
                            <h4 class="text-subtitle-1 font-weight-bold mb-3">
                                {{ translate("titles.settings").toUpperCase() }}
                            </h4>

                            <v-divider class="section-divider" />

                            <v-list-item class="px-0 nav-hover">
                                <router-link
                                    class="link-color nav-link"
                                    data-testid="navigationOverview-assessmentToolConnections-link"
                                    :to="
                                        constants.ASSESSMENT_TOOL_CONNECTIONS_ROUTE
                                    "
                                >
                                    {{
                                        translate(
                                            "navigation.routeNames.assessmentToolConnections",
                                        )
                                    }}
                                </router-link>
                            </v-list-item>

                            <v-divider class="section-divider" />

                            <v-list-item class="px-0 nav-hover">
                                <router-link
                                    class="link-color nav-link"
                                    data-testid="navigationOverview-connectionConfigurations-link"
                                    :to="
                                        constants.CONNECTION_CONFIGURATIONS_ROUTE
                                    "
                                >
                                    {{
                                        translate(
                                            "navigation.routeNames.connectionConfiguration",
                                        )
                                    }}
                                </router-link>
                            </v-list-item>

                            <v-divider class="section-divider" />

                            <v-list-item class="px-0 nav-hover">
                                <router-link
                                    class="link-color nav-link"
                                    data-testid="navigationOverview-certificates-link"
                                    :to="constants.CERTIFICATES_ROUTE"
                                >
                                    {{
                                        translate(
                                            "navigation.routeNames.certificates",
                                        )
                                    }}
                                </router-link>
                            </v-list-item>

                            <v-divider class="section-divider" />

                            <v-list-item class="px-0 nav-hover">
                                <router-link
                                    class="link-color nav-link"
                                    data-testid="navigationOverview-userAccounts-link"
                                    :to="constants.USER_ACCOUNTS_ROUTE"
                                >
                                    {{
                                        translate(
                                            "navigation.routeNames.userAccounts",
                                        )
                                    }}
                                </router-link>
                            </v-list-item>

                            <v-divider class="section-divider" />
                        </v-col>

                        <!-- Preparation -->
                        <v-col cols="3">
                            <h4 class="text-subtitle-1 font-weight-bold mb-3">
                                {{
                                    translate(
                                        "titles.preparation",
                                    ).toUpperCase()
                                }}
                            </h4>

                            <v-divider class="section-divider" />

                            <v-list-item class="px-0 nav-hover">
                                <router-link
                                    class="link-color nav-link"
                                    data-testid="navigationOverview-createTemplate-link"
                                    :to="constants.CREATE_TEMPLATE_ROUTE"
                                >
                                    {{ translate("titles.createTemplate") }}
                                </router-link>
                            </v-list-item>

                            <v-divider class="section-divider" />

                            <v-list-item class="px-0 nav-hover">
                                <router-link
                                    class="link-color nav-link"
                                    data-testid="navigationOverview-quizImport-link"
                                    :to="constants.QUIZ_IMPORT_ROUTE"
                                >
                                    {{ translate("titles.quizImport") }}
                                </router-link>
                            </v-list-item>

                            <v-divider class="section-divider" />

                            <v-list-item class="px-0 nav-hover">
                                <span class="link-color nav-link">
                                    {{ translate("titles.addExamWithURL") }}
                                </span>
                            </v-list-item>

                            <v-divider class="section-divider" />
                        </v-col>

                        <!-- Monitoring / Screen Proctoring -->
                        <v-col cols="3">
                            <h4 class="text-subtitle-1 font-weight-bold mb-3">
                                {{
                                    generalUtils.stringToBoolean(
                                        authStore.getStorageItem(
                                            StorageItemEnum.IS_SP_AVAILABLE,
                                        ),
                                    )
                                        ? `${translate("titles.monitoring").toUpperCase()} / ${translate("titles.screenProctoring").toUpperCase()}`
                                        : translate(
                                              "titles.monitoring",
                                          ).toUpperCase()
                                }}
                            </h4>

                            <v-divider class="section-divider" />

                            <v-list-item class="px-0 nav-hover">
                                <router-link
                                    class="link-color nav-link"
                                    data-testid="navigationOverview-runningExams-link"
                                    :to="constants.MONITORING_ROUTE"
                                >
                                    {{
                                        translate(
                                            "navigation.routeNames.runningExams",
                                        )
                                    }}
                                </router-link>
                            </v-list-item>

                            <v-divider
                                :class="[
                                    'section-divider',
                                    generalUtils.stringToBoolean(
                                        authStore.getStorageItem(
                                            StorageItemEnum.IS_SP_AVAILABLE,
                                        ),
                                    )
                                        ? 'thick-divider'
                                        : '',
                                ]"
                            />

                            <template
                                v-if="
                                    generalUtils.stringToBoolean(
                                        authStore.getStorageItem(
                                            StorageItemEnum.IS_SP_AVAILABLE,
                                        ),
                                    )
                                "
                            >
                                <v-list-item class="px-0 nav-hover">
                                    <router-link
                                        class="link-color nav-link"
                                        data-testid="navigationOverview-screenProctoring-link"
                                        :to="spConstants.RUNNING_EXAMS_ROUTE"
                                    >
                                        {{
                                            translate("titles.screenProctoring")
                                        }}
                                    </router-link>
                                </v-list-item>

                                <v-divider class="section-divider" />

                                <v-list-item class="px-0 nav-hover">
                                    <router-link
                                        class="link-color nav-link"
                                        data-testid="navigationOverview-spSearch-link"
                                        :to="spConstants.SEARCH_ROUTE"
                                    >
                                        {{ translate("titles.spSearch") }}
                                    </router-link>
                                </v-list-item>

                                <v-divider class="section-divider" />

                                <v-list-item class="px-0 nav-hover">
                                    <router-link
                                        class="link-color nav-link"
                                        data-testid="navigationOverview-spApplications-link"
                                        :to="spConstants.APPLICATIONS_ROUTE"
                                    >
                                        {{ translate("titles.spApplications") }}
                                    </router-link>
                                </v-list-item>

                                <v-divider class="section-divider mb-16" />
                            </template>
                        </v-col>

                        <!-- Follow Up -->
                        <v-col cols="3">
                            <h4 class="text-subtitle-1 font-weight-bold mb-3">
                                {{ translate("titles.followUp").toUpperCase() }}
                            </h4>

                            <v-divider class="section-divider" />

                            <v-list-item class="px-0 nav-hover">
                                <span class="link-color nav-link">
                                    {{
                                        translate(
                                            "navigation.routeNames.finishedExams",
                                        )
                                    }}
                                </span>
                            </v-list-item>
                            <v-divider class="section-divider" />

                            <v-list-item class="px-0 nav-hover">
                                <span class="link-color nav-link">
                                    {{ translate("titles.archiveExams") }}
                                </span>
                            </v-list-item>

                            <v-divider class="section-divider" />
                        </v-col>
                    </v-row>
                </v-sheet>
            </v-col>
        </v-container>
    </v-row>
</template>

<script setup lang="ts">
import { useAppBarStore, useNavigationStore } from "@/stores/store";
import * as constants from "@/utils/constants";
import * as spConstants from "@/utils/sp-constants";
import { translate } from "@/utils/generalUtils";
import * as generalUtils from "@/utils/generalUtils";
import { useAuthStore } from "@/stores/authentication/authenticationStore";
import { StorageItemEnum } from "@/models/StorageItemEnum";

const appBarStore = useAppBarStore();
const navigationStore = useNavigationStore();
const authStore = useAuthStore();

onBeforeMount(() => {
    appBarStore.title = translate("titles.navigationOverview");
});

onMounted(() => {
    navigationStore.isNavigationOverviewOpen = true;
});

onUnmounted(() => {
    navigationStore.isNavigationOverviewOpen = false;
});
</script>

<style scoped>
.navigation-overview-container {
    color: white;
}

.link-color {
    color: white;
    text-decoration: none;
}

.border-top {
    border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.nav-hover {
    transition: background 0.4s ease;
    border-radius: 4px;
    background: transparent;
    padding-left: 8px;
    width: 85% !important;
}

.nav-hover:hover {
    background: linear-gradient(
        to right,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0.98) 10%,
        rgba(255, 255, 255, 0.96) 20%,
        rgba(255, 255, 255, 0.93) 25%,
        rgba(255, 255, 255, 0.9) 30%,
        rgba(255, 255, 255, 0.86) 40%,
        rgba(255, 255, 255, 0.8) 60%,
        rgba(255, 255, 255, 0.7) 68%,
        rgba(255, 255, 255, 0.6) 75%,
        rgba(255, 255, 255, 0.45) 82%,
        rgba(33, 92, 175, 0.2) 88%,
        rgba(33, 92, 175, 0.12) 92%,
        rgba(33, 92, 175, 0.08) 96%,
        rgba(33, 92, 175, 0.04) 98%,
        rgba(33, 92, 175, 0.01) 99%,
        rgba(33, 92, 175, 0) 100%
    );
}

.nav-link {
    transition: color 0.4s ease;
    margin-left: 10px;
}

.nav-hover:hover .nav-link {
    color: #215caf;
}

.section-divider {
    background-color: white !important;
    height: 1px !important;
    opacity: 1 !important;
    width: 85% !important;
}

.thick-divider {
    border-top-width: 2px !important;
}
</style>
