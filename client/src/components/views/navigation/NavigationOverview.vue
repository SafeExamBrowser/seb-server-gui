<template>
    <v-row class="navigation-overview-container">
        <v-col>
            navigation overview is working
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



</style>