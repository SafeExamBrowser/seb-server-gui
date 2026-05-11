<template>
    <!-- Breadcrumb -->
    <v-row dense>
        <v-col cols="12" md="10">
            <BreadCrumb :items="breadCrumbItems" />
        </v-col>
    </v-row>
    <v-window
        v-model="currentWindow"
        show-arrows
        @update:model-value="windowChange()"
    >
        <v-window-item v-for="(w, index) in maxPages" :key="index">
            <template v-if="!noScreenshotData">
                <v-row
                    v-for="i in appBarStore.galleryGridSize.value"
                    :key="i"
                    align-strech
                    no-gutters
                >
                    <v-col
                        v-for="n in appBarStore.galleryGridSize.value"
                        :key="n"
                    >
                        <GalleryImage
                            :group-uuid="groupUuid"
                            :index="
                                galleryUtils.calcIndex(
                                    i,
                                    n,
                                    appBarStore.galleryGridSize.value,
                                )
                            "
                            :screenshot="
                                group?.screenshots[
                                    galleryUtils.calcIndex(
                                        i,
                                        n,
                                        appBarStore.galleryGridSize.value,
                                    )
                                ]
                            "
                            :timestamp="timestamp"
                        >
                        </GalleryImage>
                    </v-col>
                </v-row>
            </template>
            <AlertMsg
                v-else
                :alert-props="{
                    title: '',
                    textKey: alertMsgKey,
                    color: 'warning',
                    type: 'alert',
                }"
            >
            </AlertMsg>
        </v-window-item>
    </v-window>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAppBarStore } from "@/stores/store";
import { storeToRefs } from "pinia";
import GalleryImage from "@/pages/(app)/gallery_[uuid]_[examId]/components/GalleryImage.vue";
import { SortOrder } from "@/models/screen-proctoring/sortOrderEnum";
import { MetaData, ScreenshotData } from "@/models/screen-proctoring/session";
import { GroupUuid } from "@/models/screen-proctoring/group";
import { translate } from "@/utils/generalUtils";
import { getGroupByUuid } from "@/services/screen-proctoring/groupService";
import * as galleryUtils from "@/pages/(app)/gallery_[uuid]_[examId]/utils/galleryUtils.ts";
import BreadCrumb from "@/components/widgets/breadCrumb/BreadCrumb.vue";
import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";

import { getScreenshotDataByTimestamp } from "@/services/screen-proctoring/screenshotDataService.ts";

definePage({
    meta: {
        titleKey: "titles.galleryView",
        pageTestId: "gallery-view-page",
        layoutContext: "gallery-view",
    },
});

// reactive variables
const group = ref<GroupUuid | null>();
const timestamp = ref(Date.now());
const maxPages = ref<number>(1);
const currentWindow = ref<number>(0);
const sortOrder = ref<SortOrder>(SortOrder.asc);

// error handling
const noScreenshotData = ref<boolean>(false);
const alertMsgKey = ref<string>("no-live-data");

// time constants
const GROUP_INTERVAL: number = 2 * 1000;
const SCREENSHOT_INTERVAL: number = 1 * 1000;

// store
const appBarStore = useAppBarStore();
const appBarStoreRef = storeToRefs(appBarStore);
const route = useRoute();
const groupUuid = route.params.uuid;
const examId = route.params.examId;

const breadCrumbItems = computed<BreadCrumbItem[]>(() => {
    const items: BreadCrumbItem[] = [
        {
            label: translate("titles.monitoring"),
            link: { name: "/(app)/monitoring/" },
        },
    ];

    if (examId !== "") {
        items.push({
            label: translate("titles.overview"),
            link: {
                name: "/(app)/monitoring/[examId]/",
                params: { examId },
            },
        });
    }

    items.push({ label: translate("titles.galleryView") });
    return items;
});

let intervalGroup: ReturnType<typeof setInterval> | null = null;
let intervalImageUrl: ReturnType<typeof setInterval> | null = null;

//= ============lifecycle and watchers==================
onBeforeMount(async () => {
    group.value = await getGroupByUuid(
        groupUuid,
        galleryUtils.buildGroupQueryParams(
            currentWindow.value,
            appBarStore.galleryGridSize.value,
            sortOrder.value,
        ),
    );

    if (group.value) {
        updateInfoData();
        // appBarStore.galleryDescription = group.value.description;
    }

    assignData();
    startIntervalGroup();
    startIntervalImageUrl();
});

onBeforeUnmount(() => {
    stopIntervalGroup();
    stopIntervalImageUrl();
});

watch(appBarStoreRef.galleryGridSize, async () => {
    group.value = await getGroupByUuid(
        groupUuid,
        galleryUtils.buildGroupQueryParams(
            currentWindow.value,
            appBarStore.galleryGridSize.value,
            sortOrder.value,
        ),
    );
    assignData();
    currentWindow.value = 0;
});

watch(currentWindow, () => {
    appBarStore.galleryCurrentPage = currentWindow.value;
    appBarStore.galleryCurrentPage += 1;
});

watch(appBarStoreRef.galleryMaxPages, () => {
    if (appBarStore.galleryCurrentPage > appBarStore.galleryMaxPages) {
        currentWindow.value -= 1;
    }
});

watch(appBarStoreRef.galleryIsNameSortAsc, async () => {
    if (appBarStoreRef.galleryIsNameSortAsc.value) {
        sortOrder.value = SortOrder.asc;
    } else {
        sortOrder.value = SortOrder.desc;
    }

    group.value = await getGroupByUuid(
        groupUuid,
        galleryUtils.buildGroupQueryParams(
            currentWindow.value,
            appBarStore.galleryGridSize.value,
            sortOrder.value,
        ),
    );
    assignData();
    currentWindow.value = 0;
});

function assignData() {
    // TODO @andrei: look into this. Background:
    // - GroupUuid type doesn't have a message property, yet we check against it here
    // - Either the type is defined incorrectly or this code never worked at all
    // if (typeof group.value.message === "string") {
    //     noScreenshotData.value = true;
    //     stopIntervalGroup();
    //     alertMsgKey.value = "no-group";
    //     return;
    // }

    calcAmountOfWindows();
    noScreenshotData.value = false;

    if (
        group.value?.screenshots == null ||
        group.value?.screenshots.length === 0
    ) {
        noScreenshotData.value = true;
        updateInfoData();
        return;
    }

    // filter out null values
    group.value.screenshots = group.value?.screenshots.flatMap((f) =>
        f ? [f] : [],
    );

    updateInfoData();

    if (group.value.screenshots.length === 0) {
        noScreenshotData.value = true;
    }
}
//= =============================

//= ====general======
function updateInfoData() {
    if (group.value) {
        appBarStore.galleryLiveSessions = group.value.numberOfLiveSessions;
        appBarStore.galleryAmountOfSessions = group.value.numberOfSessions;

        appBarStore.galleryMaxPages = maxPages.value;
    }
}

//= =============================

//= ====window functions======
async function windowChange() {
    group.value = await getGroupByUuid(
        groupUuid,
        galleryUtils.buildGroupQueryParams(
            currentWindow.value,
            appBarStore.galleryGridSize.value,
            sortOrder.value,
        ),
    );
    assignData();
}

function calcAmountOfWindows() {
    if (
        group.value?.numberOfSessions == null ||
        group.value?.numberOfSessions === 0
    ) {
        maxPages.value = 1;
        return;
    }

    const maxPagesCalc: number = Math.ceil(
        group.value.numberOfLiveSessions /
            Math.pow(appBarStore.galleryGridSize.value, 2),
    );
    maxPages.value = maxPagesCalc > 0 ? maxPagesCalc : 1;
}
//= =============================

//= ============interval==================
function startIntervalGroup() {
    intervalGroup = setInterval(async () => {
        group.value = await getGroupByUuid(
            groupUuid,
            galleryUtils.buildGroupQueryParams(
                currentWindow.value,
                appBarStore.galleryGridSize.value,
                sortOrder.value,
            ),
        );
        assignData();
    }, GROUP_INTERVAL);
}

function stopIntervalGroup() {
    if (intervalGroup) {
        clearInterval(intervalGroup);
    }
}

function startIntervalImageUrl() {
    intervalImageUrl = setInterval(async () => {
        // update image url
        timestamp.value = Date.now();

        // update metadata
        if (
            appBarStore.galleryIsMetadataEnabled &&
            group?.value?.screenshots != null
        ) {
            for (let i = 0; i < group.value?.screenshots.length; i++) {
                const screenshot: ScreenshotData | null =
                    await getScreenshotDataByTimestamp(
                        group.value.screenshots[i].uuid,
                        timestamp.value.toString(),
                    );
                const metaData: MetaData | undefined = screenshot?.metaData;
                group.value.screenshots[i].metaData =
                    metaData == null ? {} : metaData;
            }
        }
    }, SCREENSHOT_INTERVAL);
}

function stopIntervalImageUrl() {
    if (intervalImageUrl) {
        clearInterval(intervalImageUrl);
    }
}
//= =============================
</script>

<style scoped></style>
