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
import HomePageInfo from "./components/HomePageInfo.vue";
import HomePageMain from "./components/HomePageMain.vue";

definePage({
    meta: {
        titleKey: "titles.home",
        pageTestId: "home-page",
    },
});
</script>
