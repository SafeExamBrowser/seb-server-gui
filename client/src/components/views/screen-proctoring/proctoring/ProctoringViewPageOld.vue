<template>
    <v-row v-if="!showError">
        <!-----------video player---------->
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pt-4 pl-4 pr-4">
                <v-img
                    eager
                    class="img-styling"
                    ref="videoPlayer"
                    :src="imageLink"
                    :aspect-ratio="16 / 9"
                >
                    <template v-slot:error> no img available </template>
                </v-img>

                <!-----------slider---------->
                <!-- <v-slider class="mt-4" :min="sliderMin" :max="lastScreenshotTime" :step="1000" v-model="sliderTime" thumb-label> -->
                <v-slider
                    class="mt-4"
                    :min="sliderMin"
                    :max="sliderMax"
                    :step="1000"
                    v-model="sliderTime"
                    @update:focused="updateSliderManually()"
                    thumb-label
                >
                    <template v-slot:thumb-label>
                        {{ currentTimeString }}
                    </template>

                    <!-----------control buttons---------->
                    <template v-slot:prepend>
                        <!--backwards-->
                        <v-btn
                            :disabled="isLiveSelected"
                            @click="backwards()"
                            size="small"
                            variant="text"
                            icon="mdi-step-backward"
                            aria-label="backwards"
                        >
                        </v-btn>

                        <!--pause / play-->
                        <v-btn
                            @click="isPlaying ? pause() : play()"
                            size="small"
                            variant="text"
                            :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
                            :aria-label="isPlaying ? 'pause' : 'play'"
                        >
                        </v-btn>

                        <!--forwards-->
                        <v-btn
                            :disabled="isLiveSelected"
                            @click="forwards()"
                            size="small"
                            variant="text"
                            icon="mdi-step-forward"
                            aria-label="forwards"
                        >
                        </v-btn>

                        <!--live button-->
                        <v-btn
                            v-if="isLive"
                            variant="text"
                            @click="goLive()"
                            aria-label="Go Live"
                        >
                            <template v-slot:prepend>
                                <v-badge
                                    dot
                                    inline
                                    :color="isLiveSelected ? 'error' : ''"
                                >
                                </v-badge>
                            </template>
                            LIVE
                        </v-btn>
                    </template>
                    <!-------------------------->

                    <!-----------time---------->
                    <template v-slot:append>
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn
                                    :disabled="isLiveSelected"
                                    variant="text"
                                    icon="mdi-cog"
                                    v-bind="props"
                                    aria-label="Playback Speed Selection"
                                >
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item> Playback Speed </v-list-item>
                                <v-divider></v-divider>
                                <v-list-item
                                    v-for="(
                                        playbackSpeed, index
                                    ) in playbackSpeeds"
                                    :key="index"
                                    :value="index"
                                    @click="
                                        changePlaybackSpeed(playbackSpeed.id)
                                    "
                                >
                                    <template
                                        v-if="
                                            playbackSpeed.id == selectedSpeedId
                                        "
                                        v-slot:append
                                    >
                                        <v-icon icon="mdi-check"></v-icon>
                                    </template>

                                    {{ playbackSpeed.title }}
                                </v-list-item>
                            </v-list>
                        </v-menu>

                        <v-chip v-if="isLive" variant="outlined">
                            {{ liveSessionTime }}
                        </v-chip>
                        <v-chip v-else variant="outlined">
                            {{ currentTimeString }} / {{ endTimeString }}
                        </v-chip>
                        <!-- <v-btn @click="toggle" variant="text" icon="mdi-fullscreen" aria-label="Fullscreen"></v-btn> -->
                    </template>
                    <!-------------------------->
                </v-slider>
                <!-------------------------->
            </v-sheet>
        </v-col>
        <!-------------------------->

        <!-----------info box---------->
        <v-col v-if="isMetadataInfo" cols="4">
            <v-card class="mx-auto">
                <template v-slot:title>
                    <v-btn
                        @click="hideShowMetadataInfo()"
                        variant="text"
                        icon="mdi-information"
                        aria-label="Details"
                        :aria-expanded="isMetadataInfo"
                    >
                    </v-btn>
                    <h2 class="title-inherit-styling title-no-line-break">
                        Details
                    </h2>
                </template>
                <v-card-text>
                    <v-table density="comfortable" class="text-caption">
                        <thead>
                            <tr>
                                <th class="text-left text-no-wrap">
                                    <h3
                                        class="title-inherit-styling text-subtitle-2"
                                    >
                                        SEB Session Info
                                    </h3>
                                </th>
                                <th class="text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(value, key) in sessionInfodata"
                                :key="key"
                            >
                                <th>{{ key }}</th>
                                <td align="right">{{ value }}</td>
                            </tr>
                        </tbody>

                        <thead>
                            <tr>
                                <th class="text-left text-no-wrap">
                                    <h3
                                        class="title-inherit-styling text-subtitle-2"
                                    >
                                        Screenshot Metadata
                                    </h3>
                                </th>
                                <th class="text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(value, key) in screenshotMetadata"
                                :key="key"
                            >
                                <th>{{ key }}:</th>
                                <td align="right">{{ value }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col v-else cols="1" align="center">
            <v-card>
                <v-btn
                    @click="hideShowMetadataInfo()"
                    variant="text"
                    size="x-large"
                    density="default"
                    icon="mdi-information"
                    aria-label="Details"
                    :aria-expanded="isMetadataInfo"
                >
                </v-btn>
            </v-card>
        </v-col>
        <!-------------------------->
    </v-row>

    <AlertMsg
        v-else
        :alertProps="{
            color: 'warning',
            type: 'alert',
            textKey: 'no-data',
        }"
    >
    </AlertMsg>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import {
    computed,
    //    nextTick,
    onBeforeMount,
    onBeforeUnmount,
    //    onMounted,
    ref,
    watch,
} from "vue";
import * as proctoringViewService from "@/services/screen-proctoring/component-services/proctoringViewService";
import * as timeUtils from "@/utils/timeUtils";
import * as groupingUtils from "@/utils/groupingUtils";
import { useAppBarStore } from "@/stores/store";
import * as searchViewService from "@/services/screen-proctoring/component-services/searchViewService";
//import { useFullscreen } from "@vueuse/core";
import * as linkService from "@/services/screen-proctoring/component-services/linkService";
import { SortOrder } from "@/models/screen-proctoring/sortOrderEnum";
import * as apiService from "@/services/apiService";
import { ScreenshotData } from "@/models/screen-proctoring/session";
import {
    ScreenshotsGrouped,
    SearchTimeline,
} from "@/models/screen-proctoring/search";

//slider
const sliderTime = ref<number>(0);
const sliderMin = ref<number>(0);
const sliderMax = ref<number>(0);

//screenshots
const isPlaying = ref<boolean>(false);
const currentScreenshot = ref<ScreenshotData>();
const firstScreenshotTime = ref<number>();

const imageLink = ref<string>("");
const showError = ref<boolean>(false);
const searchTimeline = ref<SearchTimeline | null>();

//live
const isLive = ref<boolean>(false);
const isLiveSelected = ref<boolean>(false);
const isLiveButtonDisabled = ref<boolean>(false);
const liveTimestamp = ref<number>(Date.now());
const liveSessionTime = ref<string>();

//screenshot list
const allScreenshotTimestampsNotLive = ref<number[]>([]);
const screenshotTimestamps = ref<number[]>([]);
const screenshotTimestampsFloored = ref<number[]>([]);
const timestampsIndex = ref<number>(0);
const backwardsFirstTime = ref<boolean>(true);
const forwardsFirstTime = ref<boolean>(true);

//time constants
const LIVE_INTERVAL: number = 1 * 1000;
const REFRESH_INTERVAL: number = 1 * 1000;

//playback speed
const SLOW_PLAYBACK_SPEED: number = 1 * 2000;
const DEFAULT_PLAYBACK_SPEED: number = 1 * 1000;
const FAST_PLAYBACK_SPEED: number = 1 * 500;
const PLAYBACK_SPEED = ref<number>(DEFAULT_PLAYBACK_SPEED);
const selectedSpeedId = ref<number>(1);
const playbackSpeeds: { title: string; id: number }[] = [
    { title: "0.5", id: 0 },
    { title: "Normal", id: 1 },
    { title: "2.0", id: 2 },
];

//intervals
let intervalScreenshots: ReturnType<typeof setInterval> | null = null;
let intervalLiveImage: ReturnType<typeof setInterval> | null = null;
let intervalRefresh: ReturnType<typeof setInterval> | null = null;

//store
const appBarStore = useAppBarStore();

//router params
let sessionId: string = "";
const sessionIdRouteParam: string = useRoute().params.sessionId?.toString();
const searchTimestampOnLoad = ref<boolean>(false);
const searchTimestamp: string | undefined =
    useRoute().query.searchTimestamp?.toString();

//fullscreen
const videoPlayer = ref(null);
//const { isFullscreen, enter, exit, toggle } = useFullscreen(videoPlayer);

//metadata
const isMetadataInfo = ref<boolean>(true);
const totalAmountOfScreenshots = ref<number>();

// props
const props = defineProps<{
    sessionIdProp?: string;
}>();

function setSessionId() {
    // rendered by component
    if (sessionIdRouteParam == null && props.sessionIdProp != null) {
        console.log("rendered by component");

        sessionId = props.sessionIdProp;
        return;
    }

    console.log("rendered by route");
    // rendered by route
    sessionId = sessionIdRouteParam;
}

//=============lifecycle and watchers==================
onBeforeMount(async () => {
    await initialize();

    setStartingSliderTime();
    await setTimestampsList(SortOrder.asc);

    if (currentScreenshot.value?.active) {
        goLive();
    } else {
        totalAmountOfScreenshots.value = await calcTotalNrOfScreenshots();
    }

    appBarStore.title = "Proctoring: " + currentScreenshot.value?.clientName;
});

onBeforeUnmount(() => {
    stopIntervalScreenshots();
    stopIntervalLiveImage();
    stopIntervalRefresh();
});

watch(sliderTime, async () => {
    console.info(
        "******** silderTime: " +
            sliderTime.value +
            " min: " +
            sliderMin.value +
            " max: " +
            sliderMax.value,
    );

    if (sliderTime.value == null) {
        return;
    }

    if (sliderTime.value != sliderMax.value && !intervalScreenshots) {
        pause();
        isLiveButtonDisabled.value = false;
    }

    if (isLiveSelected.value) {
        return;
    }

    const sliderTimeForIndex: number = Math.floor(sliderTime.value / 1000);
    if (screenshotTimestampsFloored.value.includes(sliderTimeForIndex)) {
        timestampsIndex.value =
            screenshotTimestampsFloored.value.indexOf(sliderTimeForIndex);
        assignScreenshotDataByTimestamp(sliderTime.value.toString());
        return;
    }

    const screenshotTimestampsShortend: number[] =
        screenshotTimestamps.value.map((timestamp) =>
            Math.floor(timestamp / 10000),
        );
    const sliderTimeForIndexShortend: number = Math.floor(
        sliderTime.value / 10000,
    );

    if (screenshotTimestampsShortend.includes(sliderTimeForIndexShortend)) {
        timestampsIndex.value = screenshotTimestampsShortend.indexOf(
            sliderTimeForIndexShortend,
        );
    } else {
        await setTimestampsList(SortOrder.asc);
    }

    assignScreenshotDataByTimestamp(sliderTime.value.toString());
});

watch(liveTimestamp, async () => {
    if (isLive.value && isLiveSelected.value) {
        throttledSetImageLink(Date.now().toString());
        assignScreenshotData();
        return;
    }

    if (isLive.value) {
        assignScreenshotDataByTimestamp(sliderTime.value?.toString());
        return;
    }
});

watch(currentScreenshot, () => {
    if (currentScreenshot.value) {
        liveSessionTime.value = timeUtils.toTimeString(
            currentScreenshot.value?.endTime -
                currentScreenshot.value?.startTime,
        );
        isLive.value = currentScreenshot.value.active;
    }
});

watch(isLive, async () => {
    if (!isLive.value) {
        isLiveSelected.value = false;
        stopIntervalLiveImage();
        totalAmountOfScreenshots.value = await calcTotalNrOfScreenshots();
        return;
    }
});

async function initialize() {
    // get session id from either prop or url
    setSessionId();

    await assignScreenshotData();
    if (currentScreenshot.value == null) {
        showError.value = true;
        return;
    }

    setSliderMax(currentScreenshot.value.endTime);
    searchTimeline.value = await searchViewService.searchTimeline(sessionId);

    await assignScreenshotDataByTimestamp(
        currentScreenshot.value?.startTime.toString(),
    );

    if (currentScreenshot.value == null) return;

    setSliderMin(currentScreenshot.value.timestamp);
    firstScreenshotTime.value = currentScreenshot.value.timestamp;
    throttledSetImageLink(Date.now().toString());
}
//==============================

//=============screenshot list logic==================
async function setTimestampsList(sortOrder: SortOrder) {
    if (sliderTime.value == null) return;

    const timestampsResponse: number[] | null =
        await proctoringViewService.getScreenshotTimestamps(
            sessionId,
            sliderTime.value.toString(),
            sortOrder,
        );
    if (timestampsResponse != null) {
        screenshotTimestamps.value = timestampsResponse;
        screenshotTimestampsFloored.value = timestampsResponse.map(
            (timestamp) => Math.floor(timestamp / 1000),
        );
    }

    timestampsIndex.value = 0;
}

const throttledSetImageLink = apiService.throttle((timestamp: string) => {
    setImageLink(timestamp);
}, 100);

function setImageLink(timestamp: string) {
    imageLink.value = linkService.getSpecificImageLink(
        currentScreenshot.value,
        timestamp,
    );
}

//=============screenshot logic==================
async function assignScreenshotData() {
    const screenshotDataResponse: ScreenshotData | null =
        await proctoringViewService.getScreenshotDataBySessionId(sessionId);
    if (screenshotDataResponse)
        currentScreenshot.value = screenshotDataResponse;
}

async function assignScreenshotDataByTimestamp(timestamp: string | undefined) {
    if (timestamp == null) return;

    const screenshotDataResponse: ScreenshotData | null =
        await proctoringViewService.getScreenshotDataByTimestamp(
            sessionId,
            timestamp,
        );

    if (screenshotDataResponse) {
        currentScreenshot.value = screenshotDataResponse;
        throttledSetImageLink(timestamp);
    }
}

function setSliderMin(timestamp: number) {
    sliderMin.value = timestamp;
}

function setSliderMax(timestamp: number) {
    sliderMax.value = timestamp;
}

const currentTimeString = computed<string>(() => {
    if (sliderTime.value != null && sliderMin.value != null) {
        const currentTime: number = sliderTime.value - sliderMin.value;
        return timeUtils.toTimeString(currentTime);
    }

    return "";
});

const endTimeString = computed<string>(() => {
    if (currentScreenshot.value != null && sliderMin.value != null) {
        return timeUtils.toTimeString(
            currentScreenshot.value.endTime - sliderMin.value,
        );
    }

    return "";
});

const sessionInfodata = computed<object>(() => {
    return proctoringViewService.getSessionInfodata(
        currentScreenshot.value || null,
    );
});
//==============================

//=========live=================
function goLive() {
    if (isLiveSelected.value) {
        isLiveSelected.value = false;
        return;
    }
    stopIntervalScreenshots();

    if (!searchTimestampOnLoad.value) {
        isLiveSelected.value = true;
        isPlaying.value = true;
        isLiveButtonDisabled.value = true;

        sliderTime.value = sliderMax.value;
    }

    searchTimestampOnLoad.value = false;

    startIntervalLiveImage();
    startIntervalRefresh();
}

function startIntervalLiveImage() {
    intervalLiveImage = setInterval(() => {
        liveTimestamp.value = Date.now();
        setSliderMax(liveTimestamp.value);
    }, LIVE_INTERVAL);
}

function stopIntervalLiveImage() {
    if (intervalLiveImage) {
        clearInterval(intervalLiveImage);
    }
}
//==============================

//=========interval=============
function startIntervalRefresh() {
    if (currentScreenshot.value?.active) {
        intervalRefresh = setInterval(() => {
            if (currentScreenshot.value != null && !isLive.value) {
                setSliderMax(currentScreenshot.value?.endTime);
            }

            if (sliderTime.value != null && isLiveSelected.value) {
                sliderTime.value = sliderMax.value;
            }
        }, REFRESH_INTERVAL);
    }
}

function startIntervalScreenshots() {
    backwardsFirstTime.value = true;

    intervalScreenshots = setInterval(async () => {
        if (
            currentScreenshot.value != null &&
            sliderTime.value != null &&
            timeUtils.toSeconds(sliderTime.value) ==
                timeUtils.toSeconds(currentScreenshot.value?.endTime) &&
            !isLive.value
        ) {
            stopIntervalScreenshots();
            isPlaying.value = false;
            return;
        }

        if (sliderTime.value != null) {
            sliderTime.value += DEFAULT_PLAYBACK_SPEED;
        }
        // setImageLink(screenshotTimestamps.value[timestampsIndex.value].toString());
        timestampsIndex.value += 1;
    }, PLAYBACK_SPEED.value);
}

function stopIntervalScreenshots() {
    if (intervalScreenshots) {
        clearInterval(intervalScreenshots);
    }
}

function stopIntervalRefresh() {
    if (intervalRefresh) {
        clearInterval(intervalRefresh);
    }
}
//==============================

//======video intercation=======
function updateSliderManually() {
    if (isLive.value) {
        pause();
    }
}

function changePlaybackSpeed(id: number) {
    stopIntervalScreenshots();
    selectedSpeedId.value = id;

    if (id == 0) PLAYBACK_SPEED.value = SLOW_PLAYBACK_SPEED;
    if (id == 1) PLAYBACK_SPEED.value = DEFAULT_PLAYBACK_SPEED;
    if (id == 2) PLAYBACK_SPEED.value = FAST_PLAYBACK_SPEED;

    if (isPlaying.value) {
        startIntervalScreenshots();
    }
}

function setStartingSliderTime() {
    if (searchTimestamp) {
        searchTimestampOnLoad.value = true;
        sliderTime.value = parseInt(searchTimestamp);
    } else {
        sliderTime.value = sliderMin.value;
    }
}

async function backwards() {
    pause();
    forwardsFirstTime.value = true;

    if (
        currentScreenshot.value == null ||
        sliderTime.value == null ||
        sliderTime.value == currentScreenshot.value.startTime
    ) {
        return;
    }

    if (backwardsFirstTime.value) {
        await setTimestampsList(SortOrder.desc);
        timestampsIndex.value = 1;

        throttledSetImageLink(
            screenshotTimestamps.value[timestampsIndex.value].toString(),
        );
        sliderTime.value -= DEFAULT_PLAYBACK_SPEED;

        backwardsFirstTime.value = false;
        return;
    }

    timestampsIndex.value += 1;
    throttledSetImageLink(
        screenshotTimestamps.value[timestampsIndex.value].toString(),
    );
    sliderTime.value -= DEFAULT_PLAYBACK_SPEED;
}

async function forwards() {
    pause();
    backwardsFirstTime.value = true;

    if (
        currentScreenshot.value == null ||
        sliderTime.value == null ||
        sliderTime.value == currentScreenshot.value.startTime
    ) {
        return;
    }

    if (forwardsFirstTime.value) {
        await setTimestampsList(SortOrder.asc);
        timestampsIndex.value = 1;

        throttledSetImageLink(
            screenshotTimestamps.value[timestampsIndex.value].toString(),
        );
        sliderTime.value += DEFAULT_PLAYBACK_SPEED;

        forwardsFirstTime.value = false;
        return;
    }

    timestampsIndex.value += 1;
    throttledSetImageLink(
        screenshotTimestamps.value[timestampsIndex.value].toString(),
    );
    sliderTime.value += DEFAULT_PLAYBACK_SPEED;
}

function pause() {
    isLiveSelected.value = false;
    isPlaying.value = false;
    stopIntervalScreenshots();
}

function play() {
    isPlaying.value = true;
    startIntervalScreenshots();
}
//==============================

//=============metadata==================
const screenshotMetadata = computed<object>(() => {
    if (currentScreenshot.value) {
        return proctoringViewService.getScreenshotMetadata(
            sliderTime.value || 0,
            currentScreenshot.value.metaData,
            additionalMetadataInfo.value,
            screenshotDisplay.value,
        );
    }

    return proctoringViewService.getScreenshotMetadata(
        sliderTime.value || 0,
        null,
        additionalMetadataInfo.value,
        screenshotDisplay.value,
    );
});

const additionalMetadataInfo = computed<string>(() => {
    let result: string = "";

    searchTimeline.value?.timelineGroupDataList.forEach((timelineGroupData) => {
        const screenshotsGrouped: ScreenshotsGrouped[] | null =
            groupingUtils.groupScreenshotsByMetadata(
                timelineGroupData.timelineScreenshotDataList,
                false,
            );

        if (screenshotsGrouped != null) {
            for (let i = 0; i < screenshotsGrouped.length; i++) {
                const index: number = screenshotsGrouped[
                    i
                ].timelineScreenshotDataList.findIndex(
                    (group) =>
                        timeUtils.toTimeString(group.timestamp) ==
                        timeUtils.toTimeString(sliderTime.value),
                );

                if (index !== -1) {
                    result = `(${index + 1}/${screenshotsGrouped[i].timelineScreenshotDataList?.length})`;
                    break;
                }
            }
        }
    });

    return result;
});

const screenshotDisplay = computed<string>(() => {
    if (
        currentScreenshot.value == null ||
        firstScreenshotTime.value == null ||
        sliderTime.value == null ||
        sliderMax.value == null
    ) {
        return "";
    }

    if (isLive.value) {
        return "-";
    }

    var currentScreenshotIndex: number =
        allScreenshotTimestampsNotLive.value.indexOf(
            currentScreenshot.value.timestamp,
        );

    if (currentScreenshotIndex == -1) {
        currentScreenshotIndex = 0;
    }

    currentScreenshotIndex += 1;

    return currentScreenshotIndex + " / " + totalAmountOfScreenshots.value;
});

function hideShowMetadataInfo() {
    isMetadataInfo.value = !isMetadataInfo.value;
}

async function calcTotalNrOfScreenshots(): Promise<number> {
    if (!firstScreenshotTime.value) return 0;

    const screenshotTimestamps: number[] | null =
        await proctoringViewService.getScreenshotTimestamps(
            sessionId,
            firstScreenshotTime.value.toString(),
            SortOrder.asc,
        );
    if (screenshotTimestamps == null) return 0;

    allScreenshotTimestampsNotLive.value = screenshotTimestamps;

    return allScreenshotTimestampsNotLive.value.length;
}
//==============================
</script>

<style scoped>
.img-styling {
    background-color: black;
    transition: transform 0.3s ease-in-out;
}
</style>
