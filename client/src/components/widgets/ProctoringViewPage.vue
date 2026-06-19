<template>
    <v-row v-if="!showError" class="d-flex align-stretch" no-gutters>
        <!-----------video player---------->
        <v-col cols="12">
            <div class="proctor">
                <div
                    id="player-wrapper"
                    ref="videoPlayer"
                    class="player-wrapper"
                    @mouseleave="onMouseLeave"
                    @mousemove="onMouseMove"
                >
                    <div class="proctor__screen">
                        <span v-if="isLiveSelected" class="proctor__livebadge">
                            <span class="pulse"></span>
                            Live
                        </span>
                        <v-img
                            eager
                            :aspect-ratio="16 / 9"
                            class="img-styling"
                            :src="imageLink"
                        >
                            <template #error> no img available </template>
                        </v-img>
                    </div>

                    <!-----------controls---------->
                    <div
                        class="controls proctor__bar"
                        :class="{
                            'controls-hidden': !controlsVisible,
                        }"
                    >
                        <!-----------slider---------->
                        <v-slider
                            v-model="sliderTime"
                            class="mt-4"
                            color="white"
                            :max="sliderMax"
                            :min="sliderMin"
                            :step="1000"
                            thumb-color="white"
                            thumb-label
                            track-color="#bbb"
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

                                <!-----------session info on hover---------->
                                <v-menu
                                    attach="#player-wrapper"
                                    :close-on-content-click="false"
                                    location="top end"
                                    open-on-hover
                                >
                                    <template #activator="{ props: infoProps }">
                                        <v-btn
                                            v-bind="infoProps"
                                            aria-label="Session info"
                                            icon="mdi-information-outline"
                                            variant="text"
                                        >
                                        </v-btn>
                                    </template>
                                    <div class="proctor-info">
                                        <div class="proctor-info__group">
                                            <div class="proctor-info__title">
                                                SEB Session Info
                                            </div>
                                            <div
                                                v-for="(
                                                    value, key
                                                ) in sessionInfodata"
                                                :key="key"
                                                class="proctor-info__row"
                                            >
                                                <span
                                                    class="proctor-info__label"
                                                >
                                                    {{ key }}
                                                </span>
                                                <span
                                                    class="proctor-info__value"
                                                >
                                                    {{ value }}
                                                </span>
                                            </div>
                                        </div>

                                        <div class="proctor-info__group">
                                            <div class="proctor-info__title">
                                                Screenshot Metadata
                                            </div>
                                            <div
                                                v-for="(
                                                    value, key
                                                ) in screenshotMetadata"
                                                :key="key"
                                                class="proctor-info__row"
                                            >
                                                <span
                                                    class="proctor-info__label"
                                                >
                                                    {{ key }}
                                                </span>
                                                <span
                                                    class="proctor-info__value"
                                                >
                                                    {{ value }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </v-menu>
                            </template>
                            <!-------------------------->
                        </v-slider>
                        <!-------------------------->
                    </div>
                </div>
            </div>
        </v-col>
        <!-------------------------->
    </v-row>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import * as screenshotDataService from "@/services/screen-proctoring/screenshotDataService";
import * as timeUtils from "@/utils/timeUtils";
import * as groupingUtils from "@/utils/groupingUtils";
import * as searchService from "@/services/screen-proctoring/searchService";
import { useFullscreen } from "@vueuse/core";
import { SortOrder } from "@/models/screen-proctoring/sortOrderEnum";
import { throttle } from "lodash";
import { ScreenshotData } from "@/models/screen-proctoring/session";
import {
    ScreenshotsGrouped,
    SearchTimeline,
} from "@/models/screen-proctoring/search";
import { getSpecificImageLink } from "@/utils/linkBuilder.ts";
import {
    getScreenshotMetadata,
    getSessionInfodata,
} from "@/utils/screenshotMetadata.ts";

//TODO REFACTOR @Andrei This page is used as both component and page, really not great

// slider
const sliderTime = ref<number>(0);
const sliderMin = ref<number>(0);
const sliderMax = ref<number>(0);

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
const LIVE_INTERVAL: number = 1000;
const REFRESH_INTERVAL: number = 1000;

// playback speed
const SLOW_PLAYBACK_SPEED: number = 2000;
const DEFAULT_PLAYBACK_SPEED: number = 1000;
const FAST_PLAYBACK_SPEED: number = 500;
const PLAYBACK_SPEED = ref<number>(DEFAULT_PLAYBACK_SPEED);
const selectedSpeedId = ref<number>(1);
const playbackSpeeds: { title: string; id: number }[] = [
    { title: "0.5", id: 0 },
    { title: "Normal", id: 1 },
    { title: "2.0", id: 2 },
];

// intervals
let intervalScreenshots: ReturnType<typeof setInterval> | null = null;
let intervalLiveImage: ReturnType<typeof setInterval> | null = null;
let intervalRefresh: ReturnType<typeof setInterval> | null = null;

// router params
let sessionId: string = "";
const searchTimestampOnLoad = ref<boolean>(false);
const searchTimestamp: string | undefined =
    useRoute().query.searchTimestamp?.toString();

// fullscreen
const videoPlayer = ref<HTMLDivElement | null>(null);
const { isFullscreen, toggle } = useFullscreen(videoPlayer);

// metadata
const totalAmountOfScreenshots = ref<number>();

// New state for control visibility
const controlsVisible = ref(true);
let hideControlsTimeout: ReturnType<typeof setTimeout> | null = null;

// props
const props = defineProps<{
    sessionIdProp: string;
}>();

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
    searchTimeline.value = await searchService.searchTimeline(sessionId);

    await assignScreenshotDataByTimestamp(
        currentScreenshotData.value?.startTime.toString(),
    );

    if (currentScreenshotData.value == null) return;

    setSliderMin(currentScreenshotData.value.timestamp);
    firstScreenshotTime.value = currentScreenshotData.value.timestamp;
    throttledSetImageLink(Date.now().toString());
}

function setSessionId() {
    if (props.sessionIdProp != null) {
        sessionId = props.sessionIdProp;
        return;
    }
}

//= =============================

//= ============screenshot list logic==================
// get timestamp list for recording
async function setTimestampsList(sortOrder: SortOrder) {
    if (sliderTime.value == null) return;

    const timestampsResponse: number[] | null =
        await screenshotDataService.getScreenshotTimestamps(
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
const throttledSetImageLink = throttle((timestamp: string) => {
    setImageLink(timestamp);
}, 100);

function setImageLink(timestamp: string) {
    imageLink.value = getSpecificImageLink(
        currentScreenshotData.value,
        timestamp,
    );
}

//= ============screenshot logic==================
async function assignScreenshotData() {
    const screenshotDataResponse: ScreenshotData | null =
        await screenshotDataService.getScreenshotDataBySessionId(sessionId);
    if (screenshotDataResponse)
        currentScreenshotData.value = screenshotDataResponse;
}

async function assignScreenshotDataByTimestamp(timestamp: string | undefined) {
    if (timestamp == null) return;

    const screenshotDataResponse: ScreenshotData | null =
        await screenshotDataService.getScreenshotDataByTimestamp(
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
    return getSessionInfodata(currentScreenshotData.value || null);
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
        intervalLiveImage = null;
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
        intervalScreenshots = null;
    }
}

function stopIntervalRefresh() {
    if (intervalRefresh) {
        clearInterval(intervalRefresh);
        intervalRefresh = null;
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
        return getScreenshotMetadata(
            sliderTime.value || 0,
            currentScreenshotData.value.metaData,
            additionalMetadataInfo.value,
            screenshotDisplay.value,
        );
    }

    return getScreenshotMetadata(
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

async function calcTotalNrOfScreenshots(): Promise<number> {
    if (!firstScreenshotTime.value) return 0;

    const screenshotTimestamps: number[] | null =
        await screenshotDataService.getScreenshotTimestamps(
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
    background-color: transparent;
    transition: transform 0.3s ease-in-out;
}

.player-wrapper {
    position: relative;
    z-index: 0;
}

/* dark "screen proctoring" player surface (matches monitoring detail design) */
.proctor {
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    overflow: hidden;
    background: #0d1320;
}

.proctor__screen {
    position: relative;
    color: rgba(255, 255, 255, 0.7);
    background:
        radial-gradient(
            circle at 30% 30%,
            rgba(92, 187, 246, 0.16),
            transparent 60%
        ),
        radial-gradient(
            circle at 75% 70%,
            rgba(33, 92, 175, 0.22),
            transparent 55%
        ),
        #0d1320;
}

.proctor__livebadge {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.55);
    color: white;
    font-size: 12px;
    font-weight: 700;
}

.proctor__livebadge .pulse {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #ef5350;
    animation: pulse-red 1.6s infinite;
}

@keyframes pulse-red {
    0% {
        box-shadow: 0 0 0 0 rgba(239, 83, 80, 0.6);
    }
    70% {
        box-shadow: 0 0 0 7px rgba(239, 83, 80, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(239, 83, 80, 0);
    }
}

.proctor__bar {
    background: #141b2d;
    padding: 0 14px 4px;
}

.proctor__bar :deep(.v-btn) {
    color: #fff;
}

.proctor__bar :deep(.v-chip) {
    color: #fff;
    border-color: rgba(255, 255, 255, 0.4);
}

/* "stats for nerds"-style info overlay, themed to match the dark player */
.proctor-info {
    max-width: 400px;
    max-height: 420px;
    overflow-y: auto;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(13, 19, 32, 0.92);
    backdrop-filter: blur(6px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
    color: rgba(255, 255, 255, 0.9);
    font-size: 12px;
    line-height: 1.4;
}

.proctor-info__group + .proctor-info__group {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.proctor-info__title {
    margin-bottom: 6px;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.5);
}

.proctor-info__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 16px;
    padding: 3px 0;
}

.proctor-info__label {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.6);
}

.proctor-info__value {
    font-family: ui-monospace, "SFMono-Regular", "Menlo", monospace;
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    text-align: right;
    color: #fff;
    word-break: break-word;
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

.v-icon {
    color: rgb(var(--v-theme-primary));
}
</style>
