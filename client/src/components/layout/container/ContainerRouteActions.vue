<template>
    <template v-if="layoutContext === 'gallery-view'">
        <v-chip class="mr-4">
            {{ translate("galleryView.generalInfo.page") }}:
            {{ appBarStore.galleryCurrentPage }} /
            {{ appBarStore.galleryMaxPages }}
        </v-chip>

        <v-chip class="mr-4">
            {{ translate("galleryView.generalInfo.sessions") }}:
            {{ appBarStore.galleryLiveSessions }} /
            {{ appBarStore.galleryAmountOfSessions }}
            <v-tooltip
                activator="parent"
                :aria-label="
                    translate('galleryView.generalInfo.sessionsTooltip')
                "
                location="bottom"
            >
                {{ translate("galleryView.generalInfo.sessionsTooltip") }}
            </v-tooltip>
        </v-chip>

        <div class="mr-4">
            <v-menu>
                <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        color="primary"
                        rounded="sm"
                        variant="flat"
                    >
                        <v-icon icon="mdi-chevron-down" size="x-large" start />
                        {{ translate("galleryView.gridSize") }}:
                        {{ appBarStore.galleryGridSize.title }}
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                        v-for="gridSize in gridSizes"
                        :key="gridSize.value"
                        class="d-flex justify-center align-center"
                        :value="gridSize.value"
                        @click="appBarStore.galleryGridSize = gridSize"
                    >
                        <v-list-item-title>
                            {{ gridSize.title }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>

        <div class="mr-4">
            <v-menu :close-on-content-click="false">
                <template #activator="{ props }">
                    <v-btn
                        :aria-label="
                            translate('galleryView.screenReader.settings')
                        "
                        v-bind="props"
                        color="primary"
                        icon="mdi-cog"
                    />
                </template>
                <v-list>
                    <v-list-item>
                        <v-switch
                            v-model="appBarStore.galleryIsNameEnabled"
                            class="mx-auto"
                            color="primary"
                            hide-details
                            :label="translate('galleryView.showName')"
                        />
                        <v-switch
                            v-model="appBarStore.galleryIsIpEnabled"
                            class="mx-auto"
                            color="primary"
                            hide-details
                            :label="translate('galleryView.showIp')"
                        />
                    </v-list-item>

                    <v-divider />

                    <v-list-item>
                        <v-btn
                            variant="outlined"
                            @click="
                                appBarStore.galleryIsNameSortAsc =
                                    !appBarStore.galleryIsNameSortAsc
                            "
                        >
                            {{ translate("galleryView.sortByName") }}
                            <template #append>
                                <v-icon
                                    :icon="
                                        appBarStore.galleryIsNameSortAsc
                                            ? 'mdi-chevron-up'
                                            : 'mdi-chevron-down'
                                    "
                                    size="x-large"
                                />
                            </template>
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </template>
</template>

<script setup lang="ts">
import { useAppBarStore } from "@/stores/store";
import { translate } from "@/utils/generalUtils";
import type { GridSize } from "@/models/types";

defineProps<{
    layoutContext?: string;
}>();

const appBarStore = useAppBarStore();

const gridSizes: GridSize[] = [
    { title: "2x2", value: 2 },
    { title: "3x3", value: 3 },
    { title: "4x4", value: 4 },
];
</script>
