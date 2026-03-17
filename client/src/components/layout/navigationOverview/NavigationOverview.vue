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
                        <v-col cols="3">
                            <NavigationSection
                                :title="translate('titles.settings')"
                                :items="settingsItems"
                            />
                        </v-col>

                        <v-col cols="3">
                            <NavigationSection
                                :title="translate('titles.preparation')"
                                :items="preparationItems"
                            />
                        </v-col>

                        <v-col cols="3">
                            <NavigationSection
                                :title="`${translate('titles.monitoring')} / ${translate('titles.screenProctoring')}`"
                                :items="monitoringItems"
                            />
                        </v-col>

                        <v-col cols="3">
                            <NavigationSection
                                :title="translate('titles.followUp')"
                                :items="followUpItems"
                            />
                        </v-col>
                    </v-row>
                </v-sheet>
            </v-col>
        </v-container>
    </v-row>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, onUnmounted } from "vue";
import { useAppBarStore, useNavigationStore } from "@/stores/store";
import { translate } from "@/utils/generalUtils";
import { useAbilities } from "@/services/ability";
import NavigationSection from "@/components/widgets/navigationWidgets/NavigationSection.vue";
import {
    buildFollowUpNavigationItems,
    buildMonitoringNavigationItems,
    buildPreparationNavigationItems,
    buildSettingsNavigationItems,
} from "@/components/widgets/navigationWidgets/navigationSections";

const appBarStore = useAppBarStore();
const navigationStore = useNavigationStore();
const ability = useAbilities();

onBeforeMount(() => {
    appBarStore.title = translate("titles.navigationOverview");
});

onMounted(() => {
    navigationStore.isNavigationOverviewOpen = true;
});

onUnmounted(() => {
    navigationStore.isNavigationOverviewOpen = false;
});

const settingsItems = computed(() =>
    buildSettingsNavigationItems(ability, "navigationOverview"),
);

const preparationItems = computed(() =>
    buildPreparationNavigationItems("navigationOverview"),
);

const monitoringItems = computed(() =>
    buildMonitoringNavigationItems("navigationOverview"),
);

const followUpItems = computed(() =>
    buildFollowUpNavigationItems("navigationOverview"),
);
</script>

<style scoped>
.navigation-overview-container {
    color: white;
}
</style>
