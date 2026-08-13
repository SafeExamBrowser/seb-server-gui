<template>
    <template v-if="layoutContext === 'gallery-view'">
        <v-chip class="mr-3" variant="tonal">
            {{ $t("galleryView.generalInfo.page") }}:
            {{ appBarStore.galleryCurrentPage }} /
            {{ appBarStore.galleryMaxPages }}
        </v-chip>

        <v-chip class="mr-3" color="primary" variant="tonal">
            {{ $t("galleryView.generalInfo.sessions") }}:
            {{ appBarStore.galleryLiveSessions }} /
            {{ appBarStore.galleryAmountOfSessions }}
            <v-tooltip
                activator="parent"
                :aria-label="$t('galleryView.generalInfo.sessionsTooltip')"
                location="bottom"
            >
                {{ $t("galleryView.generalInfo.sessionsTooltip") }}
            </v-tooltip>
        </v-chip>

        <div class="mr-3">
            <v-menu>
                <template #activator="{ props }">
                    <v-btn
                        v-bind="props"
                        color="primary"
                        rounded="lg"
                        variant="flat"
                    >
                        <v-icon icon="mdi-apps" start />
                        {{ $t("galleryView.gridSize") }}:
                        {{ appBarStore.galleryGridSize.title }}
                        <v-icon end icon="mdi-chevron-down" />
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                        v-for="gridSize in gridSizes"
                        :key="gridSize.value"
                        :active="
                            gridSize.value === appBarStore.galleryGridSize.value
                        "
                        class="d-flex justify-center align-center"
                        color="primary"
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

        <div class="mr-3">
            <v-menu :close-on-content-click="false">
                <template #activator="{ props }">
                    <v-btn
                        :aria-label="$t('galleryView.screenReader.settings')"
                        v-bind="props"
                        color="primary"
                        icon="mdi-cog-outline"
                        rounded="lg"
                        variant="flat"
                    />
                </template>
                <v-list min-width="236">
                    <v-list-item
                        :title="$t('galleryView.showName')"
                        @click="handleToggleShowName"
                    >
                        <template #append>
                            <v-switch
                                :aria-label="$t('galleryView.showName')"
                                class="ml-4"
                                color="primary"
                                density="compact"
                                hide-details
                                :model-value="appBarStore.galleryIsNameEnabled"
                                @click.stop
                                @update:model-value="handleToggleShowName"
                            />
                        </template>
                    </v-list-item>
                    <v-list-item
                        :title="$t('galleryView.showIp')"
                        @click="handleToggleShowIp"
                    >
                        <template #append>
                            <v-switch
                                :aria-label="$t('galleryView.showIp')"
                                class="ml-4"
                                color="primary"
                                density="compact"
                                hide-details
                                :model-value="appBarStore.galleryIsIpEnabled"
                                @click.stop
                                @update:model-value="handleToggleShowIp"
                            />
                        </template>
                    </v-list-item>
                    <v-list-item
                        :title="$t('galleryView.showMetadata')"
                        @click="handleToggleShowMetadata"
                    >
                        <template #append>
                            <v-switch
                                :aria-label="$t('galleryView.showMetadata')"
                                class="ml-4"
                                color="primary"
                                density="compact"
                                hide-details
                                :model-value="
                                    appBarStore.galleryIsMetadataEnabled
                                "
                                @click.stop
                                @update:model-value="handleToggleShowMetadata"
                            />
                        </template>
                    </v-list-item>

                    <v-divider class="my-1" />

                    <v-list-item>
                        <v-btn
                            block
                            variant="outlined"
                            @click="
                                appBarStore.galleryIsNameSortAsc =
                                    !appBarStore.galleryIsNameSortAsc
                            "
                        >
                            {{ $t("galleryView.sortByName") }}
                            <template #append>
                                <v-icon
                                    :icon="
                                        appBarStore.galleryIsNameSortAsc
                                            ? 'mdi-chevron-up'
                                            : 'mdi-chevron-down'
                                    "
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
import {
    VBtn,
    VChip,
    VDivider,
    VIcon,
    VList,
    VListItem,
    VListItemTitle,
    VMenu,
    VSwitch,
    VTooltip,
} from "vuetify/components";

import type { GridSize } from "@/models/types";
import { useAppBarStore } from "@/stores/store";

defineProps<{
    layoutContext?: string;
}>();

const appBarStore = useAppBarStore();

function handleToggleShowName() {
    appBarStore.galleryIsNameEnabled = !appBarStore.galleryIsNameEnabled;
}

function handleToggleShowIp() {
    appBarStore.galleryIsIpEnabled = !appBarStore.galleryIsIpEnabled;
}

function handleToggleShowMetadata() {
    appBarStore.galleryIsMetadataEnabled =
        !appBarStore.galleryIsMetadataEnabled;
}

const gridSizes: GridSize[] = [
    { title: "2x2", value: 2 },
    { title: "3x3", value: 3 },
    { title: "4x4", value: 4 },
];
</script>
