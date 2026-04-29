<template>
    <v-row data-testid="homepageContainer-page-container" class="w-100">
        <v-col cols="12" data-testid="homepageContainer-root-col">
            <!-- Infos -->
            <v-row data-testid="homepageContainer-info-section">
                <v-col cols="12" data-testid="homepageContainer-info-col">
                    <HomePageInfo
                        data-testid="homepageContainer-homePageInfo-component"
                    />
                </v-col>
            </v-row>

            <!-- Main -->
            <v-row
                align="stretch"
                class="mt-5"
                data-testid="homepageContainer-main-section"
            >
                <HomePageMain
                    data-testid="homepageContainer-homePageMain-component"
                />
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
definePage({
    meta: {
        titleKey: "titles.home",
        pageTestId: "home-page",
    },
});

import { useAppBarStore } from "@/stores/store.ts";
import { translate } from "@/utils/generalUtils.ts";
import { onBeforeMount } from "vue";
import HomePageInfo from "@/pages/(app)/home/components/HomePageInfo.vue";
import HomePageMain from "@/pages/(app)/home/components/HomePageMain.vue";

// stores
const appBarStore = useAppBarStore();

onBeforeMount(() => {
    appBarStore.title = translate("titles.home");
});
</script>

<style scoped>
.bigger-btn {
    font-size: 0.9rem;
    min-height: 40px;
    padding: 0.5rem 1.25rem;
}
</style>
