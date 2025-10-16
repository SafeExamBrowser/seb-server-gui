<template>
    <v-row v-if="!showError" align="stretch" class="d-flex" no-gutters>
        <!-----------video player---------->
        <v-col
            class="video-col"
            :class="{ open: isMetadataInfo, closed: !isMetadataInfo }"
            :cols="isMetadataInfo ? 8 : 11"
        >
            <v-sheet class="rounded-lg pt-4 pl-4 pr-4" elevation="4">
                <div
                    id="player-wrapper"
                    ref="videoPlayer"
                    class="player-wrapper"
                    @mouseleave="onMouseLeave"
                    @mousemove="onMouseMove"
                >
                    <v-img
                        :aspect-ratio="16 / 9"
                        class="img-styling"
                        :src="imageLink"
                    >
                        <template #error> no img available </template>
                    </v-img>

                    <!-----------controls---------->
                    <div
                        class="controls"
                        :class="{ 'controls-hidden': !controlsVisible }"
                    >
                        <!-----------slider---------->
                        <v-slider
                            v-model="sliderTime"
                            class="mt-4"
                            :color="isFullscreen ? 'white' : undefined"
                            :max="sliderMax"
                            :min="sliderMin"
                            :step="1000"
                            :thumb-color="isFullscreen ? 'white' : undefined"
                            thumb-label
                            :track-color="isFullscreen ? '#bbb' : undefined"
                        >
                            <template #thumb-label>
                                {{ currentTimeString }}
                            </template>

                            <!-----------control buttons---------->
                            <template #prepend>
                                <!--backwards-->
                                <v-btn
                                    aria-label="backwards"
                                    :disabled="isLiveSelected"
                                    icon="mdi-step-backward"
                                    size="small"
                                    variant="text"
                                    @click="backwards()"
                                >
                                </v-btn>

                                <!--pause / play-->
                                <v-btn
                                    :aria-label="isPlaying ? 'pause' : 'play'"
                                    :icon="isPlaying ? 'mdi-pause' : 'mdi-play'"
                                    size="small"
                                    variant="text"
                                    @click="isPlaying ? pause() : play()"
                                >
                                </v-btn>

                                <!--forwards-->
                                <v-btn
                                    aria-label="forwards"
                                    :disabled="isLiveSelected"
                                    icon="mdi-step-forward"
                                    size="small"
                                    variant="text"
                                    @click="forwards()"
                                >
                                </v-btn>

                                <!--live button-->
                                <v-btn
                                    v-if="isLive"
                                    aria-label="Go Live"
                                    variant="text"
                                    @click="goLive()"
                                >
                                    <template #prepend>
                                        <v-badge
                                            :color="
                                                isLiveSelected ? 'error' : ''
                                            "
                                            dot
                                            inline
                                        >
                                        </v-badge>
                                    </template>
                                    LIVE
                                </v-btn>
                            </template>
                            <!-------------------------->

                            <!-----------time---------->
                            <template #append>
                                <v-menu attach="#player-wrapper">
                                    <template
                                        #activator="{ props: activatorProps }"
                                    >
                                        <v-btn
                                            v-bind="activatorProps"
                                            aria-label="Playback Speed Selection"
                                            :disabled="isLiveSelected"
                                            icon="mdi-cog"
                                            variant="text"
                                        >
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item>
                                            Playback Speed
                                        </v-list-item>
                                        <v-divider></v-divider>
                                        <v-list-item
                                            v-for="(
                                                playbackSpeed, index
                                            ) in playbackSpeeds"
                                            :key="index"
                                            :value="index"
                                            @click="
                                                changePlaybackSpeed(
                                                    playbackSpeed.id,
                                                )
                                            "
                                        >
                                            <template
                                                v-if="
                                                    playbackSpeed.id ==
                                                    selectedSpeedId
                                                "
                                                #append
                                            >
                                                <v-icon
                                                    icon="mdi-check"
                                                ></v-icon>
                                            </template>

                                            {{ playbackSpeed.title }}
                                        </v-list-item>
                                    </v-list>
                                </v-menu>

                                <v-chip v-if="isLive" variant="outlined">
                                    {{ liveSessionTime }}
                                </v-chip>
                                <v-chip v-else variant="outlined">
                                    {{ currentTimeString }} /
                                    {{ endTimeString }}
                                </v-chip>
                                <v-btn
                                    aria-label="Fullscreen"
                                    icon="mdi-fullscreen"
                                    variant="text"
                                    @click="toggle"
                                ></v-btn>
                            </template>
                            <!-------------------------->
                        </v-slider>
                        <!-------------------------->
                    </div>
                </div>
            </v-sheet>
        </v-col>
        <!-------------------------->

        <!-----------info box---------->

        <v-col
            class="metadata-col"
            :class="{ open: isMetadataInfo, closed: !isMetadataInfo }"
            cols="3"
        >
            <v-card
                class="metadata-card d-flex flex-column"
                style="height: 100%; width: 100%"
            >
                <template #title> </template>
                <v-card-text>
                    <v-table class="text-caption" density="comfortable">
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
        <v-col
            class="toggle-col d-flex align-center justify-center"
            :class="{ open: isMetadataInfo, closed: !isMetadataInfo }"
            cols="1"
            @click="hideShowMetadataInfo()"
        >
            <v-card
                class="toggle-card d-flex flex-column align-center justify-center"
                elevation="4"
                style="width: 100%; height: 100%"
            >
                <v-icon icon="mdi-information" />
                <v-icon
                    :icon="
                        isMetadataInfo
                            ? 'mdi-chevron-double-right'
                            : 'mdi-chevron-double-left'
                    "
                />
            </v-card>
        </v-col>
        <!-------------------------->
    </v-row>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import {
    computed,
    nextTick,
    onBeforeMount,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from "vue";
import * as proctoringViewService from "@/services/screen-proctoring/component-services/proctoringViewService";
import * as timeUtils from "@/utils/timeUtils";
import * as groupingUtils from "@/utils/groupingUtils";
import { useAppBarStore } from "@/stores/store";
import * as searchViewService from "@/services/screen-proctoring/component-services/searchViewService";
import { useFullscreen } from "@vueuse/core";
import * as linkService from "@/services/screen-proctoring/component-services/linkService";
import { SortOrder } from "@/models/screen-proctoring/sortOrderEnum";
import * as apiService from "@/services/apiService";
import { ScreenshotData } from "@/models/screen-proctoring/session";
import {
    ScreenshotsGrouped,
    SearchTimeline,
} from "@/models/screen-proctoring/search";

// slider
const sliderTime = ref<number>();
const sliderMin = ref<number>();
const sliderMax = ref<number>();

// screenshots
const isPlaying = ref<boolean>(false);
const currentScreenshotData = ref<ScreenshotData>();
const firstScreenshotTime = ref<number>();

const imageLink = ref<string>("");
const showError = ref<boolean>(false);
const searchTimeline = ref<SearchTimeline | null>();

// live
const isLive = ref<boolean>(false);
const isLiveSelected = ref<boolean>(false);
const isLiveButtonDisabled = ref<boolean>(false);
const liveTimestamp = ref<number>(Date.now());
const liveSessionTime = ref<string>();

// screenshot list
const allScreenshotTimestampsNotLive = ref<number[]>([]);
const screenshotTimestamps = ref<number[]>([]);
const screenshotTimestampsFloored = ref<number[]>([]);
const timestampsIndex = ref<number>(0);
const backwardsFirstTime = ref<boolean>(true);
const forwardsFirstTime = ref<boolean>(true);

// time constants
const LIVE_INTERVAL: number = 1 * 1000;
const REFRESH_INTERVAL: number = 1 * 1000;

// playback speed
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

// intervals
let intervalScreenshots: any | null = null;
let intervalLiveImage: any | null = null;
let intervalRefresh: any | null = null;

// store
const appBarStore = useAppBarStore();

// router params
let sessionId: string = "";
const sessionIdRouteParam: string = useRoute().params.sessionId?.toString();
const searchTimestampOnLoad = ref<boolean>(false);
const searchTimestamp: string | undefined =
    useRoute().query.searchTimestamp?.toString();

// fullscreen
const videoPlayer = ref<HTMLDivElement | null>(null);
const { isFullscreen, toggle } = useFullscreen(videoPlayer);

// metadata
const isMetadataInfo = ref<boolean>(true);
const totalAmountOfScreenshots = ref<number>();

// New state for control visibility
const controlsVisible = ref(true);
let hideControlsTimeout: ReturnType<typeof setTimeout> | null = null;

// props
const props = defineProps<{
    sessionIdProp?: string;
}>();

const videoHeight = ref(0);

//= ============lifecycle and watchers==================
onBeforeMount(async () => {
    await initialize();

    // todo: those functions calls could be moved to the "initialize" function
    setStartingSliderTime();
    await setTimestampsList(SortOrder.asc);

    if (currentScreenshotData.value?.active) {
        goLive();
    } else {
        totalAmountOfScreenshots.value = await calcTotalNrOfScreenshots();
    }

    appBarStore.title =
        "Proctoring: " + currentScreenshotData.value?.clientName;
});

onMounted(() => {
    if (isMetadataInfo.value) {
        nextTick(() => {
            if (videoPlayer.value) {
                videoHeight.value = videoPlayer.value.clientHeight;
            }
        });
    }
});

onBeforeUnmount(() => {
    stopIntervalScreenshots();
    stopIntervalLiveImage();
    stopIntervalRefresh();
});

function onMouseMove() {
    if (!isFullscreen.value) return;
    controlsVisible.value = true;
    if (hideControlsTimeout) clearTimeout(hideControlsTimeout);
    hideControlsTimeout = setTimeout(() => {
        controlsVisible.value = false;
    }, 2000);
}

function onMouseLeave() {
    if (!isFullscreen.value) return;
    controlsVisible.value = false;
    if (hideControlsTimeout) clearTimeout(hideControlsTimeout);
}

watch(isFullscreen, (fullscreen) => {
    if (fullscreen) {
        controlsVisible.value = true;
        if (hideControlsTimeout) clearTimeout(hideControlsTimeout);
        hideControlsTimeout = setTimeout(() => {
            controlsVisible.value = false;
        }, 3000);
    } else {
        controlsVisible.value = true;
        if (hideControlsTimeout) clearTimeout(hideControlsTimeout);
    }
});

watch(sliderTime, async () => {
    if (sliderTime.value == null) {
        return;
    }

    if (sliderTime.value !== sliderMax.value && !intervalScreenshots) {
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
    }
});

watch(currentScreenshotData, () => {
    if (currentScreenshotData.value) {
        liveSessionTime.value = timeUtils.toTimeString(
            currentScreenshotData.value?.endTime -
                currentScreenshotData.value?.startTime,
        );
        isLive.value = currentScreenshotData.value.active;
    }
});

watch(isLive, async () => {
    if (!isLive.value) {
        isLiveSelected.value = false;
        stopIntervalLiveImage();
        totalAmountOfScreenshots.value = await calcTotalNrOfScreenshots();
    }
});

watch(isMetadataInfo, (newVal) => {
    if (newVal) {
        nextTick(() => {
            if (videoPlayer.value) {
                videoHeight.value = videoPlayer.value.clientHeight;
            }
        });
    }
});

// initalize data
// todo: improve structure of this function
async function initialize() {
    // get session id from either prop or url
    setSessionId();

    await assignScreenshotData();
    if (currentScreenshotData.value == null) {
        showError.value = true;
        return;
    }

    setSliderMax(currentScreenshotData.value.endTime);
    searchTimeline.value = await searchViewService.searchTimeline(sessionId);

    await assignScreenshotDataByTimestamp(
        currentScreenshotData.value?.startTime.toString(),
    );

    if (currentScreenshotData.value == null) return;

    setSliderMin(currentScreenshotData.value.timestamp);
    firstScreenshotTime.value = currentScreenshotData.value.timestamp;
    throttledSetImageLink(Date.now().toString());
}

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

//= =============================

//= ============screenshot list logic==================
// get timestamp list for recording
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

// throttle function to mitigate amount of api calls
const throttledSetImageLink = apiService.throttle((timestamp: string) => {
    setImageLink(timestamp);
}, 100);

function setImageLink(timestamp: string) {
    imageLink.value = linkService.getSpecificImageLink(
        currentScreenshotData.value,
        timestamp,
    );
}

//= ============screenshot logic==================
async function assignScreenshotData() {
    const screenshotDataResponse: ScreenshotData | null =
        await proctoringViewService.getScreenshotDataBySessionId(sessionId);
    if (screenshotDataResponse)
        currentScreenshotData.value = screenshotDataResponse;
}

async function assignScreenshotDataByTimestamp(timestamp: string | undefined) {
    if (timestamp == null) return;

    const screenshotDataResponse: ScreenshotData | null =
        await proctoringViewService.getScreenshotDataByTimestamp(
            sessionId,
            timestamp,
        );

    if (screenshotDataResponse) {
        currentScreenshotData.value = screenshotDataResponse;
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
    if (currentScreenshotData.value != null && sliderMin.value != null) {
        return timeUtils.toTimeString(
            currentScreenshotData.value.endTime - sliderMin.value,
        );
    }

    return "";
});

const sessionInfodata = computed<object>(() => {
    return proctoringViewService.getSessionInfodata(
        currentScreenshotData.value || null,
    );
});
//= =============================

//= ========live=================
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

//= =============================

//= ========interval=============
function startIntervalRefresh() {
    if (currentScreenshotData.value?.active) {
        intervalRefresh = setInterval(() => {
            if (currentScreenshotData.value != null && !isLive.value) {
                setSliderMax(currentScreenshotData.value?.endTime);
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
            currentScreenshotData.value != null &&
            sliderTime.value != null &&
            timeUtils.toSeconds(sliderTime.value) ===
                timeUtils.toSeconds(currentScreenshotData.value?.endTime) &&
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

//= =============================

function changePlaybackSpeed(id: number) {
    stopIntervalScreenshots();
    selectedSpeedId.value = id;

    if (id === 0) PLAYBACK_SPEED.value = SLOW_PLAYBACK_SPEED;
    if (id === 1) PLAYBACK_SPEED.value = DEFAULT_PLAYBACK_SPEED;
    if (id === 2) PLAYBACK_SPEED.value = FAST_PLAYBACK_SPEED;

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
        currentScreenshotData.value == null ||
        sliderTime.value == null ||
        sliderTime.value === currentScreenshotData.value.startTime
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
        currentScreenshotData.value == null ||
        sliderTime.value == null ||
        sliderTime.value === currentScreenshotData.value.startTime
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

//= =============================

//= ============metadata==================
// additional grouping sorting functions for metadata
// todo: could be removed as information gain is quite small
const screenshotMetadata = computed<object>(() => {
    if (currentScreenshotData.value) {
        return proctoringViewService.getScreenshotMetadata(
            sliderTime.value || 0,
            currentScreenshotData.value.metaData,
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
                        timeUtils.toTimeString(group.timestamp) ===
                        timeUtils.toTimeString(sliderTime.value!),
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
        currentScreenshotData.value == null ||
        firstScreenshotTime.value == null ||
        sliderTime.value == null ||
        sliderMax.value == null
    ) {
        return "";
    }

    if (isLive.value) {
        return "-";
    }

    let currentScreenshotIndex: number =
        allScreenshotTimestampsNotLive.value.indexOf(
            currentScreenshotData.value.timestamp,
        );

    if (currentScreenshotIndex === -1) {
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

//= =============================
</script>

<style scoped>
.img-styling {
    background-color: black;
    transition: transform 0.3s ease-in-out;
}

.player-wrapper {
    position: relative;
    z-index: 0;
}

.controls {
    width: 100%;
    position: static;
    opacity: 1;
    transition: opacity 0.3s ease;
}

.controls-hidden {
    opacity: 0;
    pointer-events: none;
}

.player-wrapper:fullscreen .controls,
.player-wrapper:-webkit-full-screen .controls {
    position: absolute !important;
    bottom: 16px;
    left: 0;
    width: 100%;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
    padding: 8px 0;
}

.player-wrapper:fullscreen .controls .v-btn,
.player-wrapper:-webkit-full-screen .controls .v-btn {
    color: white !important;
}

.player-wrapper:fullscreen .controls .v-slider-track__background,
.player-wrapper:fullscreen .controls .v-slider-track__fill,
.player-wrapper:fullscreen .controls .v-slider-track__tick,
.player-wrapper:fullscreen .controls .v-slider-thumb__surface {
    background-color: white !important;
}

.player-wrapper:fullscreen .controls .v-slider-thumb__surface {
    border-color: white !important;
}

.player-wrapper:fullscreen .controls .v-chip {
    color: white !important;
    border-color: white !important;
}

.player-wrapper:-webkit-full-screen .controls .v-slider-track__background,
.player-wrapper:-webkit-full-screen .controls .v-slider-track__fill,
.player-wrapper:-webkit-full-screen .controls .v-slider-track__tick,
.player-wrapper:-webkit-full-screen .controls .v-slider-thumb__surface {
    background-color: white !important;
}

.player-wrapper:-webkit-full-screen .controls .v-slider-thumb__surface {
    border-color: white !important;
}

.player-wrapper:-webkit-full-screen .controls .v-chip {
    color: white !important;
    border-color: white !important;
}

.player-wrapper:fullscreen .controls,
.player-wrapper:-moz-full-screen .controls {
    position: absolute !important;
    bottom: 16px;
    left: 0;
    width: 100%;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
    padding: 8px 0;
}

.player-wrapper:fullscreen .controls .v-btn,
.player-wrapper:-moz-full-screen .controls .v-btn {
    color: white !important;
}

.player-wrapper:fullscreen .controls .v-slider-track__background,
.player-wrapper:fullscreen .controls .v-slider-track__fill,
.player-wrapper:fullscreen .controls .v-slider-track__tick,
.player-wrapper:fullscreen .controls .v-slider-thumb__surface {
    background-color: white !important;
}

.player-wrapper:fullscreen .controls .v-slider-thumb__surface {
    border-color: white !important;
}

.player-wrapper:fullscreen .controls .v-chip {
    color: white !important;
    border-color: white !important;
}

.player-wrapper:-moz-full-screen .controls .v-slider-track__background,
.player-wrapper:-moz-full-screen .controls .v-slider-track__fill,
.player-wrapper:-moz-full-screen .controls .v-slider-track__tick,
.player-wrapper:-moz-full-screen .controls .v-slider-thumb__surface {
    background-color: white !important;
}

.player-wrapper:-moz-full-screen .controls .v-slider-thumb__surface {
    border-color: white !important;
}

.player-wrapper:-moz-full-screen .controls .v-chip {
    color: white !important;
    border-color: white !important;
}

.metadata-card .v-card-text {
    flex: 1 1 auto;
    overflow-y: auto;
    padding-right: 8px;
}
.metadata-card .v-card-title,
.metadata-card .v-card-subtitle {
    flex: 0 0 auto;
}

.toggle-col {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.toggle-col v-btn {
    width: 100%;
    height: 100%;
    border-radius: 0;
}

.v-icon {
    color: #215caf;
}

.video-col,
.metadata-col,
.toggle-col {
    transition:
        flex-basis 0.3s ease,
        max-width 0.3s ease,
        opacity 0.3s ease;
}

.video-col.closed {
    flex: 0 0 91.66% !important;
    max-width: 91.66% !important;
}
.video-col.open {
    flex: 1 1 66.66% !important;
    max-width: 100% !important;
}

.metadata-col.closed {
    flex: 0 0 0 !important;
    max-width: 0 !important;
    opacity: 0;
    overflow: hidden;
}
.metadata-col.open {
    flex: 0 0 25% !important;
    max-width: 25% !important;
    opacity: 1;
}

.toggle-col.closed {
    flex: 0 0 8.33% !important;
    max-width: 8.33% !important;
}
.toggle-col.open {
    flex: 0 0 50px !important;
    max-width: 50px !important;
}

.metadata-col {
    transform: translateZ(0);
}

.video-col,
.toggle-col {
    transition:
        flex-basis 0.3s ease,
        max-width 0.3s ease;
}

.metadata-card {
    height: 100%;
}

.scrollable-details {
    overflow-y: auto;
    flex-grow: 1;
}

.toggle-col {
    cursor: pointer;
}
</style>
