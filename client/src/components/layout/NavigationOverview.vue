<template>
    <v-row class="navigation-overview-container">
        <v-col>
            <v-sheet 
                elevation="0"
                color="primary"
                class="rounded-lg pa-4">

                <v-row>
                    <v-col>
                        <div 
                            class="text-h6"
                            role="button"
                            tabindex="0">
                            <router-link class="link-color" :to="constants.HOME_PAGE_ROUTE">{{ translate("titles.home") }}</router-link>
                        </div>
                    </v-col>

                    <v-col>
                        <div 
                            class="text-h6"
                            role="button"
                            tabindex="0">
                            <router-link class="link-color" :to="constants.EXAM_ROUTE">{{ translate("titles.examsOverview") }}</router-link>
                        </div>
                    </v-col>

                    <v-col>
                        <div 
                            class="text-h6"
                            role="button"
                            tabindex="0">
                            <router-link class="link-color" :to="constants.MONITORING_ROUTE">{{ translate("titles.monitoring") }}</router-link>
                        </div>
                    </v-col>

                    <v-col v-if="generalUtils.stringToBoolean(authStore.getStorageItem(StorageItemEnum.IS_SP_AVAILABLE))">
                        <div 
                            class="text-h6"
                            role="button"
                            tabindex="0">
                            <router-link class="link-color" :to="spConstants.RUNNING_EXAMS_ROUTE">{{ translate("titles.screenProctoring") }}</router-link>
                        </div>

                        <div 
                            class="text-h7 mt-2"
                            role="button"
                            tabindex="0">
                            <router-link class="link-color" :to="spConstants.SEARCH_ROUTE">{{ translate("titles.spSearch") }}</router-link>
                        </div>

                        <div 
                            class="text-h7 mt-2"
                            role="button"
                            tabindex="0">
                            <router-link class="link-color" :to="spConstants.APPLICATIONS_ROUTE">{{ translate("titles.spApplications") }}</router-link>
                        </div>

                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>
</template>


<script setup lang="ts">
    import { useAppBarStore, useNavigationStore } from "@/stores/store";
    import * as constants from "@/utils/constants";
    import * as spConstants from "@/utils/sp-constants";
    import {translate} from "@/utils/generalUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import { useAuthStore } from '@/stores/authentication/authenticationStore';
    import { StorageItemEnum } from "@/models/StorageItemEnum";


    //stores
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

    .navigation-overview-container{
        color: white;
    }

    .link-color {
        color: white;
    }


</style>