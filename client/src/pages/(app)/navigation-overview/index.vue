<template>
    <v-row data-testid="navigationOverview-page-container">
        <v-container class="ml-16 mr-0" fluid>
            <v-col>
                <v-sheet
                    class="rounded-lg pa-4"
                    color="transparent"
                    elevation="0"
                >
                    <v-app-bar-title class="mb-12">
                        <div
                            class="text-headline-large font-weight-bold mt-3"
                            data-testid="navigationOverview-title-text"
                        >
                            {{ translate("titles.navigationOverview") }}
                        </div>
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
import { computed } from "vue";
import { translate } from "@/utils/generalUtils";
import { useAbilities } from "@/services/ability";
import NavigationSection from "@/components/widgets/navigationWidgets/NavigationSection.vue";
import {
    buildFollowUpNavigationItems,
    buildMonitoringNavigationItems,
    buildPreparationNavigationItems,
    buildSettingsNavigationItems,
} from "@/components/widgets/navigationWidgets/navigationSections";

definePage({
    meta: {
        titleKey: "titles.navigationOverview",
        pageTestId: "navigation-overview-page",
        isPageBlue: true,
        layoutContext: "navigation-overview",
    },
});

const ability = useAbilities();
const settingsItems = computed(() =>
    buildSettingsNavigationItems(ability, "navigationOverview"),
);

const preparationItems = computed(() =>
    buildPreparationNavigationItems(ability, "navigationOverview"),
);

const monitoringItems = computed(() =>
    buildMonitoringNavigationItems(ability, "navigationOverview"),
);

const followUpItems = computed(() =>
    buildFollowUpNavigationItems(ability, "navigationOverview"),
);
</script>

<style scoped></style>
