<template>
    <v-row data-testid="homePageMain-page-container">
        <!-- First Column -->
        <v-col
            class="d-flex flex-column align-center ga-8"
            cols="3"
            data-testid="homePageMain-leftCol-container"
        >
            <v-sheet
                v-for="card in actionCards"
                :key="card.testIdPrefix"
                class="w-100 pa-4 d-flex flex-column justify-space-between"
                :data-testid="`homePageMain-${card.testIdPrefix}-card`"
                elevation="4"
                max-width="95%"
                min-height="12rem"
                rounded="sm"
            >
                <div
                    class="primary-text-color text-h5 font-weight-black mb-16"
                    :data-testid="`homePageMain-${card.testIdPrefix}-title-text`"
                >
                    {{ translate(card.titleKey) }}
                </div>
                <div class="d-flex justify-end mt-auto">
                    <v-btn
                        class="px-5 text-none"
                        color="primary"
                        :data-testid="`homePageMain-${card.testIdPrefix}-startNow-button`"
                        rounded="sm"
                        size="large"
                        :to="card.route"
                        variant="flat"
                    >
                        {{ translate("homePage.startNow") }}
                    </v-btn>
                </div>
            </v-sheet>
        </v-col>

        <!-- Right Column -->
        <v-col cols="9" data-testid="homePageMain-rightCol-container">
            <v-sheet data-testid="homePageMain-rightCol-sheet"> </v-sheet>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";
import type { RouteLocationAsRelative } from "vue-router";

type ActionCard = {
    testIdPrefix: string;
    titleKey: string;
    route: RouteLocationAsRelative;
};

const actionCards: ActionCard[] = [
    {
        testIdPrefix: "create-templates",
        titleKey: "homePage.createTemplates",
        route: { name: "/(app)/quiz-import/" },
    },
    {
        testIdPrefix: "prepare-exam",
        titleKey: "homePage.prepareExam",
        route: { name: "/(app)/quiz-import/" },
    },
    {
        testIdPrefix: "monitor-exam",
        titleKey: "homePage.monitorExams",
        route: { name: "/(app)/quiz-import/" },
    },
];
</script>
