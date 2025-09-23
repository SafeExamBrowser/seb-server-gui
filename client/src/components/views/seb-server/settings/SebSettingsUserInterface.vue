<template>
    <v-row> USER_INTERFACE Settings TODO </v-row>
</template>

<script setup lang="ts">
import * as sebSettingsService from "@/services/seb-server/component-services/sebSettingsService";
import { useI18n } from "vue-i18n";
import { stringToBoolean, translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";

const i18n = useI18n();
const sebSettingsStore = useSEBSettingsStore();

// 0 and 1 is browserViewMode and 2 is touchOptimized=true / browserViewMode=null
const browserViewModeVal = ref<string>("0");
const touchOptimizedVal = ref<boolean>(false);

// the parent component identifier
let componentId: string;

let browserViewMode: SEBSettingsValue;
let touchOptimized: SEBSettingsValue;

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    componentId = sebSettingsStore.selectedContainerId.toString();

    const userSettings: SEBSettingsView | null =
        await sebSettingsService.getViewSettings(
            ViewType.USER_INTERFACE,
            componentId,
            sebSettingsStore.isExam,
        );
    if (userSettings == null) {
        return;
    }

    const singleValues: Map<string, SEBSettingsValue> = new Map<
        string,
        SEBSettingsValue
    >(Object.entries(userSettings.singleValues));

    browserViewMode = singleValues.get("browserViewMode")!;
    browserViewModeVal.value = browserViewMode.value;

    touchOptimized = singleValues.get("touchOptimized")!;
    touchOptimizedVal.value = stringToBoolean(touchOptimized.value);
});

async function savebrowserViewMode(value: string) {
    if (value === "0" || value === "1") {
        await saveSingleValue(browserViewMode.id, value);
        await saveSingleValue(touchOptimized.id, "false");
    } else if (value === "3") {
        await saveSingleValue(browserViewMode.id, "");
        await saveSingleValue(touchOptimized.id, "true");
    }
}

async function saveSingleValue(valId: number, value: string) {
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        valId.toString(),
        value,
        sebSettingsStore.isExam,
    );
}

async function saveOnFocusLost(focusIn: boolean, valId: number, value: string) {
    if (!focusIn) {
        saveSingleValue(valId, value);
    }
}
</script>
