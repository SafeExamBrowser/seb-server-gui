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
                            <router-link class="link-color" :to="constants.HOME_PAGE_ROUTE">{{ constants.HOME_PAGE_TITLE }}</router-link>
                        </div>
                    </v-col>

                    <v-col>
                        <div 
                            class="text-h6"
                            role="button"
                            tabindex="0">
                            <router-link class="link-color" :to="constants.EXAM_ROUTE">{{ constants.EXAMS_OVERVIEW_TITLE }}</router-link>
                        </div>
                    </v-col>

                    <v-col>
                        <div 
                            class="text-h6"
                            role="button"
                            tabindex="0">
                            <router-link class="link-color" :to="constants.MONITORING_ROUTE">{{ constants.MONITORING_TITLE }}</router-link>
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

    //stores
    const appBarStore = useAppBarStore();
    const navigationStore = useNavigationStore();

    onBeforeMount(() => {
        appBarStore.title = constants.NAVIGATION_OVERVIEW_TITLE;
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