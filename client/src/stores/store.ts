import { defineStore } from "pinia";
import { ref } from "vue";
import { GridSize } from "@/models/types";

// --------------------app bar-----------------------------//
export const useAppBarStore = defineStore("appBar", () => {
    const previousTitle = ref<string>("");
    const title = ref<string>("Example Title");

    const examOverviewShowPastExams = ref<boolean>(false);
    const examOverviewShowUpcomingExams = ref<boolean>(false);

    const galleryGridSize = ref<GridSize>({
        title: "3x3",
        value: 3,
    });
    const galleryIsNameEnabled = ref<boolean>(true);
    const galleryIsIpEnabled = ref<boolean>(false);
    const galleryIsMetadataEnabled = ref<boolean>(false);
    const galleryCurrentPage = ref<number>(1);
    const galleryMaxPages = ref<number>(1);
    const galleryLiveSessions = ref<number>(0);
    const galleryAmountOfSessions = ref<number>(0);
    const galleryDescription = ref<string>("");
    const galleryIsNameSortAsc = ref<boolean>(true);

    return {
        previousTitle,
        title,
        examOverviewShowPastExams,
        examOverviewShowUpcomingExams,
        galleryGridSize,
        galleryIsNameEnabled,
        galleryIsIpEnabled,
        galleryIsMetadataEnabled,
        galleryCurrentPage,
        galleryMaxPages,
        galleryLiveSessions,
        galleryAmountOfSessions,
        galleryDescription,
        galleryIsNameSortAsc,
    };
});

// --------------------navigation-----------------------------//
export const useNavigationStore = defineStore("navigation", () => {
    const isNavigationOverviewOpen = ref<boolean>(false);

    return {
        isNavigationOverviewOpen,
    };
});

export const useLayoutStore = defineStore("layout", () => {
    const isBlueBackground = ref(false);

    function setBlueBackground(value: boolean) {
        isBlueBackground.value = value;
    }

    return {
        isBlueBackground,
        setBlueBackground,
    };
});

// ----------------------loading---------------------------//
export const useLoadingStore = defineStore("loading", () => {
    const skipLoading = ref<boolean>(false);
    const isLoading = ref<boolean>(false);
    const isTimeout = ref<boolean>(false);

    return { skipLoading, isLoading, isTimeout };
});

// ----------------------sp exams overview---------------------------//
export const useTableStore = defineStore("table", () => {
    const isIndicatorsExpanded = ref<boolean>(false);
    const isIndicatorExpandButtonDisabled = ref<boolean>(false);

    const isIpDisplayList = ref<{ day: string; isIp: boolean }[]>([]);

    return {
        isIndicatorsExpanded,
        isIpDisplayList,
        isIndicatorExpandButtonDisabled,
    };
});

// ----------------------gallery view---------------------------//
export const useGalleryStore = defineStore("gallery", () => {
    const focusedImageIndexes = ref<boolean[]>([]);

    return { focusedImageIndexes };
});
