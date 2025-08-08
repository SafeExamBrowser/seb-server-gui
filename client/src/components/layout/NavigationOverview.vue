<template>
    <v-row class="navigation-overview-container">
        <v-container class="ml-16 mr-0" fluid>
            <v-col>
                <v-sheet elevation="0" color="primary" class="rounded-lg pa-4">
                    <v-app-bar-title class="mb-16">
                        <h1 class="title-inherit-styling text-h4">{{ appBarStore.title }}</h1>
                    </v-app-bar-title>

                    <v-row class="mt-4 mb-16 mr-0">

                        <!---------------Settings List----------------->
                        <v-col cols="3">
                            <h4 class="text-subtitle-1 font-weight-bold mb-3">
                                {{ translate("titles.settings").toUpperCase() }}
                            </h4>

                            <v-divider class="section-divider"/>

                            <v-list-item class="px-0 nav-hover">
                                <span class="link-color nav-link">
                                    {{ translate("navigation.routeNames.assessmentToolConnections") }}
                                </span>
                            </v-list-item>

                            <v-divider class="section-divider"/>

                            <v-list-item class="px-0 nav-hover">
                                <span class="link-color nav-link">
                                    {{ translate("navigation.routeNames.connectionConfiguration") }}
                                </span>
                            </v-list-item>

                            <v-divider class="section-divider"/>

                            <v-list-item class="px-0 nav-hover">
                                <span class="link-color nav-link">{{
                                        translate("navigation.routeNames.certificates")
                                    }}
                                </span>
                            </v-list-item>

                            <v-divider class="section-divider"/>

                            <v-list-item class="px-0 nav-hover">
                                <router-link class="link-color nav-link" :to="constants.USER_ACCOUNTS_ROUTE">
                                    {{ translate("navigation.routeNames.userAccounts") }}
                                </router-link>
                            </v-list-item>

                            <v-divider class="section-divider"/>
                        </v-col>


                        <!---------------Preparation List----------------->
                        <v-col cols="3">
                            <h4 class="text-subtitle-1 font-weight-bold mb-3">
                                {{ translate("titles.preparation").toUpperCase() }}
                            </h4>

                            <v-divider class="section-divider"/>


                            <v-list-item class="px-0 nav-hover">
                                <span class="link-color nav-link">{{
                                        translate("titles.createTemplate")
                                    }}
                                </span>
                            </v-list-item>

                            <v-divider class="section-divider"/>

                            <v-list-item class="px-0 nav-hover">
                                <router-link class="link-color nav-link" :to="constants.EXAM_ROUTE">
                                    {{ translate("titles.quizImport") }}
                                </router-link>
                            </v-list-item>

                            <v-divider class="section-divider"/>


                            <v-list-item class="px-0 nav-hover">
                                <span class="link-color nav-link">{{
                                        translate("titles.addExamWithURL")
                                    }}
                                </span>
                            </v-list-item>

                            <v-divider class="section-divider"/>
                        </v-col>


                        <!---------------Monitoring / Screen Proctoring List----------------->

                        <v-col cols="3">
                            <h4 class="text-subtitle-1 font-weight-bold mb-3">
                                {{
                                    generalUtils.stringToBoolean(authStore.getStorageItem(StorageItemEnum.IS_SP_AVAILABLE))
                                        ? `${translate("titles.monitoring").toUpperCase()} / ${translate("titles.screenProctoring").toUpperCase()}`
                                        : translate("titles.monitoring").toUpperCase()
                                }}
                            </h4>

                            <v-divider class="section-divider"/>

                            <!-- Monitoring List Items -->
                            <v-list-item class="px-0 nav-hover">
                                <router-link class="link-color nav-link" :to="constants.MONITORING_ROUTE">
                                    {{ translate("navigation.routeNames.runningExams") }}
                                </router-link>
                            </v-list-item>



                            <v-divider
                                :class="[
                                  'section-divider',
                                  generalUtils.stringToBoolean(authStore.getStorageItem(StorageItemEnum.IS_SP_AVAILABLE)) ? 'thick-divider' : ''
                                ]"
                            />

                            <!-- Screen Proctoring Items -->
                            <template
                                v-if="generalUtils.stringToBoolean(authStore.getStorageItem(StorageItemEnum.IS_SP_AVAILABLE))">
                                <v-list-item class="px-0 nav-hover">
                                    <router-link class="link-color nav-link" :to="spConstants.RUNNING_EXAMS_ROUTE">
                                        {{ translate("titles.screenProctoring") }}
                                    </router-link>
                                </v-list-item>

                                <v-divider class="section-divider"/>

                                <v-list-item class="px-0 nav-hover">
                                    <router-link class="link-color nav-link" :to="spConstants.SEARCH_ROUTE">
                                        {{ translate("titles.spSearch") }}
                                    </router-link>
                                </v-list-item>

                                <v-divider class="section-divider"/>

                                <v-list-item class="px-0 nav-hover">
                                    <router-link class="link-color nav-link" :to="spConstants.APPLICATIONS_ROUTE">
                                        {{ translate("titles.spApplications") }}
                                    </router-link>
                                </v-list-item>

                                <v-divider class="section-divider mb-16"/>
                            </template>
                        </v-col>

                        <!-- Follow Up -->
                        <v-col cols="3">
                            <h4 class="text-subtitle-1 font-weight-bold mb-3">
                                {{ translate("titles.followUp").toUpperCase() }}
                            </h4>

                            <v-divider class="section-divider"/>

                            <v-list-item class="px-0 nav-hover">
                                <span class="link-color nav-link">{{
                                        translate("navigation.routeNames.finishedExams")
                                    }}
                                </span>
                            </v-list-item>
                            <v-divider class="section-divider"/>


                            <v-list-item class="px-0 nav-hover">
                                <span class="link-color nav-link">
                                    {{ translate("titles.archiveExams") }}
                                </span>
                            </v-list-item>

                            <v-divider class="section-divider"/>
                        </v-col>

                    </v-row>
                </v-sheet>
            </v-col>
        </v-container>
    </v-row>
</template>

<script setup lang="ts">
import {useAppBarStore, useNavigationStore} from "@/stores/store";
import * as constants from "@/utils/constants";
import * as spConstants from "@/utils/sp-constants";
import {translate} from "@/utils/generalUtils";
import * as generalUtils from "@/utils/generalUtils";
import {useAuthStore} from "@/stores/authentication/authenticationStore";
import {StorageItemEnum} from "@/models/StorageItemEnum";

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
        rgba(255, 255, 255, 0.90) 30%,
        rgba(255, 255, 255, 0.86) 40%,
        rgba(255, 255, 255, 0.80) 60%,
        rgba(255, 255, 255, 0.70) 68%,
        rgba(255, 255, 255, 0.60) 75%,
        rgba(255, 255, 255, 0.45) 82%,
        rgba(33, 92, 175, 0.20) 88%,
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
