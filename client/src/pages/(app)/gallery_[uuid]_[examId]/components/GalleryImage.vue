<template>
    <!-----------gallery image---------->
    <v-hover v-slot="{ isHovering, props: hoverProps }">
        <v-img
            v-if="screenshot"
            v-bind="hoverProps"
            :aspect-ratio="16 / 9"
            class="rounded-lg"
            :style="tileStyle"
            eager
            :src="getLatestImageLink(screenshot, timestamp.toString())"
            tabindex="0"
            @dblclick="openDialog()"
            @focus="setTabFocus()"
            @keydown="registerKeyPress($event)"
            @mousedown="registerKeyPress($event)"
        >
            <span
                class="position-absolute d-inline-flex align-center ga-1 px-2 py-1 rounded-pill text-white text-body-small font-weight-black text-uppercase"
                :style="liveBadgeStyle"
            >
                <v-avatar color="success" size="6" :style="pulseStyle" />
                {{ $t("galleryView.live") }}
            </span>

            <div
                v-if="isHovering || galleryStore.focusedImageIndexes[index]"
                class="d-flex flex-column justify-end h-100"
                :style="overlayStyle"
            >
                <div
                    v-if="appBarStore.galleryIsMetadataEnabled"
                    class="d-flex flex-column ga-1 rounded-lg pa-2 mx-2 overflow-y-auto"
                    :style="metaPanelStyle"
                >
                    <div
                        v-for="(
                            value, key
                        ) in galleryUtils.getScreenshotMetadata(
                            screenshot.metaData,
                        )"
                        :key="key"
                        class="d-flex justify-space-between ga-2 text-body-small"
                    >
                        <span class="font-weight-medium" :style="metaKeyStyle">
                            {{ key }}
                        </span>
                        <span
                            class="text-white font-weight-bold text-truncate text-right"
                        >
                            {{ value }}
                        </span>
                    </div>
                </div>

                <div class="d-flex align-center ga-2 pa-2">
                    <div
                        class="flex-grow-1 text-white text-body-medium font-weight-bold text-truncate"
                    >
                        <template v-if="appBarStore.galleryIsNameEnabled">{{
                            screenshot.clientName
                        }}</template>
                        <template
                            v-if="
                                appBarStore.galleryIsNameEnabled &&
                                appBarStore.galleryIsIpEnabled
                            "
                        >
                            /
                        </template>
                        <template v-if="appBarStore.galleryIsIpEnabled">{{
                            screenshot.clientIp
                        }}</template>
                    </div>
                    <v-btn
                        :aria-label="
                            i18n.t('galleryView.screenReader.expandImage')
                        "
                        color="white"
                        icon="mdi-arrow-expand"
                        rounded="sm"
                        size="small"
                        variant="outlined"
                        @click="openDialog()"
                    >
                    </v-btn>
                    <v-btn
                        :aria-label="
                            i18n.t(
                                'galleryView.screenReader.openProcotringView',
                            )
                        "
                        color="primary"
                        icon="mdi-video"
                        rounded="sm"
                        size="small"
                        variant="flat"
                        @click="navigateToProctoringView(screenshot, examId)"
                    >
                    </v-btn>
                </div>
            </div>
        </v-img>
        <v-img
            v-else
            :aspect-ratio="16 / 9"
            :style="{ visibility: 'hidden' }"
            eager
            :src="getLatestImageLink(screenshot, timestamp.toString())"
        >
        </v-img>
    </v-hover>
    <!-------------------------->

    <!-----------expanded image---------->
    <v-dialog v-model="dialog" max-width="1100">
        <v-card class="overflow-hidden" rounded="lg" :style="lightboxCardStyle">
            <template v-if="screenshot">
                <v-img
                    :aspect-ratio="16 / 9"
                    eager
                    :src="expandedScreenshotLink"
                    :style="{ backgroundColor: '#14181f' }"
                >
                    <span
                        class="position-absolute d-inline-flex align-center ga-1 px-2 py-1 rounded-pill text-white text-body-small font-weight-black text-uppercase"
                        :style="liveBadgeStyle"
                    >
                        <v-avatar
                            color="success"
                            size="6"
                            :style="pulseStyle"
                        />
                        {{ $t("galleryView.live") }}
                    </span>
                </v-img>

                <div :style="lightboxMetaSectionStyle">
                    <div
                        class="d-flex align-center ga-2 px-4 py-3 text-white text-body-medium font-weight-bold"
                        :style="{ cursor: 'pointer' }"
                        @click="handleToggleMeta"
                    >
                        <v-icon
                            :icon="
                                metaOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'
                            "
                            size="small"
                        />
                        {{ $t("galleryView.metadata") }}
                        <v-spacer />
                        <v-btn
                            :aria-label="
                                i18n.t('galleryView.screenReader.collapseImage')
                            "
                            color="white"
                            icon="mdi-arrow-collapse"
                            rounded="sm"
                            size="small"
                            variant="outlined"
                            @click.stop="closeDialog()"
                        >
                        </v-btn>
                    </div>
                    <div
                        v-if="metaOpen"
                        class="px-4 pb-4"
                        :style="lightboxMetaBodyStyle"
                    >
                        <div
                            v-for="(
                                value, key
                            ) in galleryUtils.getScreenshotMetadata(
                                screenshot.metaData,
                            )"
                            :key="key"
                            class="d-flex justify-space-between ga-2 py-1 text-body-small"
                            :style="lightboxMetaRowStyle"
                        >
                            <span
                                class="font-weight-medium"
                                :style="metaKeyStyle"
                            >
                                {{ key }}
                            </span>
                            <span class="text-white font-weight-bold">
                                {{ value }}
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    class="d-flex align-center ga-3 px-4 py-2"
                    :style="lightboxFootStyle"
                >
                    <div
                        class="flex-grow-1 text-white text-body-medium font-weight-bold text-truncate"
                    >
                        {{ screenshot.clientName }} /
                        {{ screenshot.clientIp }}
                    </div>
                    <v-btn
                        :aria-label="
                            i18n.t(
                                'galleryView.screenReader.openProcotringView',
                            )
                        "
                        color="primary"
                        icon="mdi-video"
                        rounded="sm"
                        size="small"
                        variant="flat"
                        @click="navigateToProctoringView(screenshot, groupUuid)"
                    >
                    </v-btn>
                </div>
            </template>
        </v-card>
    </v-dialog>
    <!-------------------------->
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
    VAvatar,
    VBtn,
    VCard,
    VDialog,
    VHover,
    VIcon,
    VImg,
    VSpacer,
} from "vuetify/components";

import { ScreenshotData } from "@/models/screen-proctoring/session";
import { navigateToProctoringView } from "@/pages/(app)/gallery_[uuid]_[examId]/utils/galleryNavigation.ts";
import * as galleryUtils from "@/pages/(app)/gallery_[uuid]_[examId]/utils/galleryUtils.ts";
import { useAppBarStore, useGalleryStore } from "@/stores/store";
import { getLatestImageLink } from "@/utils/linkBuilder.ts";

// props
const props = defineProps<{
    screenshot: ScreenshotData | undefined;
    timestamp: number;
    groupUuid: string;
    index: number;
}>();

// store
const appBarStore = useAppBarStore();
const galleryStore = useGalleryStore();

// examId
const route = useRoute();
const examId = computed(() => {
    const params = route.params as Record<
        string,
        string | string[] | undefined
    >;
    const value = params.examId;

    return typeof value === "string" ? value : "";
});

// i18n
const i18n = useI18n();

// dialog - expanded image
const dialog = ref(false);
const metaOpen = ref(true);

// accessibility
const lastKeyPressed = ref<string | null>("Tab");

const overlayStyle = {
    background:
        "linear-gradient(180deg, rgba(0, 0, 0, 0) 55%, rgba(0, 0, 0, 0.78) 100%)",
};
const metaPanelStyle = {
    backgroundColor: "rgba(20, 22, 28, 0.92)",
    maxHeight: "45%",
};
const metaKeyStyle = { color: "rgba(255, 255, 255, 0.55)" };
const liveBadgeStyle = {
    top: "8px",
    left: "8px",
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    letterSpacing: "0.3px",
    zIndex: 1,
};
const lightboxCardStyle = { backgroundColor: "#12151b" };
const lightboxMetaSectionStyle = {
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
};
const lightboxMetaBodyStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px 24px",
};
const lightboxMetaRowStyle = {
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
};
const lightboxFootStyle = { backgroundColor: "#1c2027" };

const tileStyle = computed(() => ({
    backgroundColor: "#14181f",
    outline: galleryStore.focusedImageIndexes[props.index]
        ? "2px solid rgb(var(--v-theme-primary))"
        : "2px solid transparent",
    transition: "outline-color 120ms",
}));

const pulseStyle = computed(() => ({
    opacity: Math.floor(props.timestamp / 1000) % 2 === 0 ? 1 : 0.35,
    transition: "opacity 0.7s ease-in-out",
}));

onBeforeMount(() => {
    galleryStore.focusedImageIndexes[props.index] = false;
});

function openDialog() {
    metaOpen.value = true;
    dialog.value = true;
}

function closeDialog() {
    dialog.value = false;
}

function handleToggleMeta() {
    metaOpen.value = !metaOpen.value;
}

const expandedScreenshotLink = computed<string>(() => {
    return getLatestImageLink(props.screenshot, props.timestamp.toString());
});

function setTabFocus() {
    if (lastKeyPressed.value !== "Tab" || lastKeyPressed.value == null) {
        return;
    }

    galleryStore.focusedImageIndexes[props.index] = true;

    for (let i = 0; i < galleryStore.focusedImageIndexes.length; i++) {
        if (i !== props.index) {
            galleryStore.focusedImageIndexes[i] = false;
        }
    }

    lastKeyPressed.value = null;
}

function registerKeyPress(event: KeyboardEvent) {
    lastKeyPressed.value = event.key;
}
</script>
