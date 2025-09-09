<template>
    <v-row v-if="!showError">
        <!-----------video player---------->
        <v-col>
            <v-sheet class="rounded-lg pt-4 pl-4 pr-4" elevation="4">
                <v-img
                    ref="videoPlayer"
                    :aspect-ratio="16 / 9"
                    class="img-styling"
                    eager
                    :src="imageLink"
                >
                    <template #error> no img available </template>
                </v-img>

                <!-----------slider---------->
                <!-- <v-slider class="mt-4" :min="sliderMin" :max="lastScreenshotTime" :step="1000" v-model="sliderTime" thumb-label> -->
                <v-slider
                    v-model="sliderTime"
                    class="mt-4"
                    :max="sliderMax"
                    :min="sliderMin"
                    :step="1000"
                    thumb-label
                >
                    <template #thumb-label>
                        {{ currentTimeString }}
                    </template>

                    <!-----------control buttons---------->
                    <template #prepend>
                        <!--backwards-->
                        <v-btn
                            aria-label="backwards"
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
                            icon="mdi-step-forward"
                            size="small"
                            variant="text"
                            @click="forwards()"
                        >
                        </v-btn>
                    </template>
                    <!-------------------------->

                    <!-----------time---------->
                    <template #append>
                        <v-menu>
                            <template #activator="{ props }">
                                <v-btn
                                    v-bind="props"
                                    aria-label="Playback Speed Selection"
                                    icon="mdi-cog"
                                    variant="text"
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
                                        #append
                                    >
                                        <v-icon icon="mdi-check"></v-icon>
                                    </template>

                                    {{ playbackSpeed.title }}
                                </v-list-item>
                            </v-list>
                        </v-menu>

                        <v-chip variant="outlined">
                            {{ currentTimeString }} / {{ endTimeString }}
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
            </v-sheet>
        </v-col>
        <!-------------------------->

        <!-----------info box---------->
        <v-col v-if="isMetadataInfo" cols="4">
            <v-card class="mx-auto">
                <template #title>
                    <v-btn
                        :aria-expanded="isMetadataInfo"
                        aria-label="Details"
                        icon="mdi-information"
                        variant="text"
                        @click="hideShowMetadataInfo()"
                    >
                    </v-btn>
                    <h2 class="title-inherit-styling title-no-line-break">
                        Details
                    </h2>
                </template>
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
                            <template
                                v-for="(value, key) in screenshotMetadata"
                                :key="key"
                            >
                                <tr
                                    :class="[
                                        key ==
                                            spConstants.APPLICATION_METADATA ||
                                        key == spConstants.WINDOW_TITLE_METADATA
                                            ? 'metadata-color'
                                            : '',
                                    ]"
                                >
                                    <th>{{ key }}:</th>
                                    <td align="right">{{ value }}</td>
                                </tr>
                            </template>
                        </tbody>
                    </v-table>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col v-else align="center" cols="1">
            <v-card>
                <v-btn
                    :aria-expanded="isMetadataInfo"
                    aria-label="Details"
                    density="default"
                    icon="mdi-information"
                    size="x-large"
                    variant="text"
                    @click="hideShowMetadataInfo()"
                >
                </v-btn>
            </v-card>
        </v-col>
        <!-------------------------->
    </v-row>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import {
    computed,
    onBeforeMount,
    onBeforeUnmount,
    onMounted,
    onUpdated,
    ref,
    watch,
} from "vue";
import * as proctoringViewService from "@/services/screen-proctoring/component-services/proctoringViewService";
import * as timeUtils from "@/utils/timeUtils";
import { useAppBarStore } from "@/stores/store";
import { useFullscreen } from "@vueuse/core";
import * as linkService from "@/services/screen-proctoring/component-services/linkService";
import * as applicationsSearchViewService from "@/services/screen-proctoring/component-services/applicationsSearchViewService";
import * as spConstants from "@/utils/sp-constants";

// slider
const sliderTime = ref<number>();
const sliderMin = ref<number>();
const sliderMax = ref<number>();

// screenshots
const isPlaying = ref<boolean>(false);
const currentScreenshot = ref<ScreenshotData>();
const imageLink = ref<string>("");

// screenshot list
const screenshotTimestamps = ref<number[]>([]);
const screenshotTimestampsFloored = ref<number[]>([]);
const timestampsIndex = ref<number>(0);

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

// store
const appBarStore = useAppBarStore();

// router params & query
const route = useRoute();
const sessionId: string = route.params.sessionId.toString();
const metadataApp = route.query.metadataApp ?? "";
const metadataWindow = route.query.metadataWindow ?? "";

// fullscreen
const videoPlayer = ref(null);
const { toggle } = useFullscreen(videoPlayer);

// metadata
const isMetadataInfo = ref<boolean>(true);

// error handling
const showError = ref<boolean>(false);

//= ============lifecycle and watchers==================
onBeforeMount(async () => {
    await initialize();
    appBarStore.title = "Proctoring: " + currentScreenshot.value?.clientName;
});

onBeforeUnmount(() => {
    stopIntervalScreenshots();
});

async function initialize() {
    await setTimestampsList();
    await assignScreenshotDataByTimestamp(
        screenshotTimestamps.value[0].toString(),
    );

    if (currentScreenshot.value == null) {
        showError.value = true;
        return;
    }

    setSliderMin(screenshotTimestamps.value[0]);
    setStartingSliderTime();

    setSliderMax(
        screenshotTimestamps.value[screenshotTimestamps.value.length - 1],
    );
}

watch(sliderTime, async () => {
    if (sliderTime.value == null) {
        return;
    }

    if (sliderTime.value != sliderMax.value && !intervalScreenshots) {
        pause();
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
            Math.floor(timestamp / 1000),
        );
    const sliderTimeForIndexShortend: number = Math.floor(
        sliderTime.value / 1000,
    );

    if (screenshotTimestampsShortend.includes(sliderTimeForIndexShortend)) {
        timestampsIndex.value = screenshotTimestampsShortend.indexOf(
            sliderTimeForIndexShortend,
        );
    }

    assignScreenshotDataByTimestamp(sliderTime.value.toString());
});
//= =============================

//= ============screenshot list logic==================
async function setTimestampsList() {
    const timestamps: number[] | null =
        await applicationsSearchViewService.getTimestampListForApplicationSearch(
            sessionId,
            metadataApp.toString(),
            metadataWindow.toString(),
        );

    if (timestamps == null) {
        showError.value = true;
        return;
    }

    screenshotTimestamps.value = timestamps;
    screenshotTimestampsFloored.value = timestamps.map((timestamp) =>
        Math.floor(timestamp / 1000),
    );

    timestampsIndex.value = 0;
}

function setImageLink(timestamp: string) {
    imageLink.value = linkService.getSpecificImageLink(
        currentScreenshot.value,
        timestamp,
    );
}

//= ============screenshot logic==================
async function assignScreenshotDataByTimestamp(timestamp: string | undefined) {
    if (timestamp == null) return;

    const screenshotDataResponse: ScreenshotData | null =
        await proctoringViewService.getScreenshotDataByTimestamp(
            sessionId,
            timestamp,
        );

    if (screenshotDataResponse) {
        currentScreenshot.value = screenshotDataResponse;
        setImageLink(timestamp);
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
    if (sliderMin.value != null) {
        return timeUtils.toTimeString(
            screenshotTimestamps.value[screenshotTimestamps.value.length - 1] -
                sliderMin.value,
        );
    }

    return "";
});

const sessionInfodata = computed<object>(() => {
    return proctoringViewService.getSessionInfodata(
        currentScreenshot.value || null,
    );
});
//= =============================

//= ========interval=============
function startIntervalScreenshots() {
    intervalScreenshots = setInterval(async () => {
        if (timestampsIndex.value == screenshotTimestamps.value.length - 1) {
            stopIntervalScreenshots();
            isPlaying.value = false;
            return;
        }

        sliderTime.value! += DEFAULT_PLAYBACK_SPEED;
        // timestampsIndex.value += 1;
    }, PLAYBACK_SPEED.value);
}

function stopIntervalScreenshots() {
    if (intervalScreenshots) {
        clearInterval(intervalScreenshots);
    }
}
//= =============================

//= =====video intercation=======
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
    sliderTime.value = sliderMin.value;
}

async function backwards() {
    pause();

    if (
        currentScreenshot.value == null ||
        sliderTime.value == null ||
        sliderTime.value == currentScreenshot.value.startTime
    ) {
        return;
    }

    setImageLink(screenshotTimestamps.value[timestampsIndex.value].toString());
    sliderTime.value -= DEFAULT_PLAYBACK_SPEED;
}

async function forwards() {
    pause();

    if (
        currentScreenshot.value == null ||
        sliderTime.value == null ||
        sliderTime.value == currentScreenshot.value.startTime
    ) {
        return;
    }

    setImageLink(screenshotTimestamps.value[timestampsIndex.value].toString());
    sliderTime.value += DEFAULT_PLAYBACK_SPEED;
}

function pause() {
    isPlaying.value = false;
    stopIntervalScreenshots();
}

function play() {
    isPlaying.value = true;
    startIntervalScreenshots();
}
//= =============================

//= ============metadata==================
const screenshotMetadata = computed<object>(() => {
    if (currentScreenshot.value) {
        return proctoringViewService.getScreenshotMetadata(
            sliderTime.value || 0,
            currentScreenshot.value.metaData,
            "",
            screenshotDisplay.value,
        );
    }

    return proctoringViewService.getScreenshotMetadata(
        sliderTime.value || 0,
        null,
        "",
        screenshotDisplay.value,
    );
});

const screenshotDisplay = computed<string>(() => {
    return timestampsIndex.value + " / " + screenshotTimestamps.value.length;
});

function hideShowMetadataInfo() {
    isMetadataInfo.value
        ? (isMetadataInfo.value = false)
        : (isMetadataInfo.value = true);
}
//= =============================
</script>

<style scoped>
.img-styling {
    background-color: black;
    transition: transform 0.3s ease-in-out;
}

.metadata-color {
    background: #e2ecf7;
}
</style>
