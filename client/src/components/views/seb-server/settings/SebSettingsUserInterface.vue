<template>
    <v-row v-if="fetched">
        <v-col class="text-subtitle-1">
            <SettingsTitle label="sebSettings.userView.view_mode.title" />
            <v-row>
                <RadioSetting
                    ref="browserViewMode"
                    name="browserViewMode"
                    label="sebSettings.userView.view_mode"
                    @saved="notifyBrowserViewMode"
                />
            </v-row>
            <SettingsTitle label="sebSettings.userView.main_browser.title" />
            <v-row>
                <SelectionSetting
                    name="mainBrowserWindowWidth"
                    label="sebSettings.userView.main_browser.width"
                    :disabled="browserViewModeRef?.radioValue !== '0'"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <SelectionSetting
                    name="mainBrowserWindowHeight"
                    label="sebSettings.userView.main_browser.height"
                    :disabled="browserViewModeRef?.radioValue !== '0'"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <SelectionSetting
                    name="mainBrowserWindowPositioning"
                    label="sebSettings.userView.main_browser.pos"
                    :labels="true"
                    :disabled="browserViewModeRef?.radioValue !== '0'"
                />
            </v-row>
            <SettingsTitle label="sebSettings.userView.browser_window.title" />
            <v-row>
                <CheckboxSetting
                    ref="enableBrowserWindowToolbar"
                    name="enableBrowserWindowToolbar"
                    label="sebSettings.userView.browser_window.enableToolbar"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="browserWindowAllowAddressBar"
                    label="sebSettings.userView.browser_window.addrBar"
                    :tooltip="false"
                    :disabled="!enableBrowserWindowToolbarRef?.boolVal"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="newBrowserWindowAllowAddressBar"
                    label="sebSettings.userView.browser_window.newAddrBar"
                    :tooltip="false"
                    :disabled="!enableBrowserWindowToolbarRef?.boolVal"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="allowDeveloperConsole"
                    label="sebSettings.userView.browser_window.allowDev"
                    :tooltip="false"
                    :disabled="!enableBrowserWindowToolbarRef?.boolVal"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="hideBrowserWindowToolbar"
                    label="sebSettings.userView.browser_window.hideTool"
                    :tooltip="true"
                    :disabled="!enableBrowserWindowToolbarRef?.boolVal"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="showMenuBar"
                    label="sebSettings.userView.browser_window.showMenuBar"
                    :tooltip="true"
                    :disabled="!enableBrowserWindowToolbarRef?.boolVal"
                />
            </v-row>
            <SettingsTitle label="sebSettings.userView.zoom.title" />
            <v-row>
                <CheckboxSetting
                    name="enableZoomPage"
                    label="sebSettings.userView.zoom.enableZoomPage"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="enableZoomText"
                    label="sebSettings.userView.zoom.enableZoomText"
                    :tooltip="true"
                />
            </v-row>
        </v-col>

        <v-col class="text-subtitle-1">
            <SettingsTitle label="sebSettings.userView.audio.title" />
            <v-row>
                <CheckboxSetting
                    name="audioControlEnabled"
                    label="sebSettings.userView.audio.enableControl"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="audioMute"
                    label="sebSettings.userView.audio.mute"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    ref="audioSetVolumeLevel"
                    name="audioSetVolumeLevel"
                    label="sebSettings.userView.audio.volume"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <SliderSetting
                    name="audioVolumeLevel"
                    :max="100"
                    :min="0"
                    :step="1"
                    :disabled="!audioSetVolumeLevelRef?.boolVal"
                />
            </v-row>
            <SettingsTitle label="sebSettings.userView.spellChecker.title" />
            <v-row>
                <CheckboxSetting
                    name="allowSpellCheck"
                    label="sebSettings.userView.spellChecker.allow"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="allowDictionaryLookup"
                    label="sebSettings.userView.spellChecker.allowDict"
                    :tooltip="true"
                />
            </v-row>
            <SettingsTitle label="sebSettings.userView.task_bar.title" />
            <v-row>
                <CheckboxSetting
                    name="showTaskBar"
                    label="sebSettings.userView.task_bar.showTaskBar"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="showSideMenu"
                    label="sebSettings.userView.task_bar.showSideMenu"
                    :tooltip="false"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="raiseHandButtonShow"
                    label="sebSettings.userView.task_bar.raiseHandButtonShow"
                    :tooltip="false"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="raiseHandButtonAlwaysPromptMessage"
                    label="sebSettings.userView.task_bar.raiseHandButtonAlwaysPromptMessage"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="allowWlan"
                    label="sebSettings.userView.task_bar.allowWlan"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="showReloadButton"
                    label="sebSettings.userView.task_bar.showReloadButton"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="showTime"
                    label="sebSettings.userView.task_bar.showTime"
                    :tooltip="false"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="showInputLanguage"
                    label="sebSettings.userView.task_bar.showInputLanguage"
                    :tooltip="true"
                />
            </v-row>
            <SettingsTitle label="sebSettings.userView.screenLock.title" />
            <v-row>
                <v-col class="pt-8 pb-0 pl-5 pr-10">
                    <v-row>
                        <v-color-input
                            v-model="lockScreenBackgroundColorVal"
                            :disabled="sebSettingsStore.readonly"
                            mode="hex"
                            max-width="300"
                            :label="
                                translate(
                                    'sebSettings.userView.screenLock.color',
                                )
                            "
                            pip-location="append-inner"
                            color-pip
                            variant="outlined"
                            density="compact"
                            @update:model-value="
                                sebSettingsStore.saveSingleValue(
                                    'lockScreenBackgroundColor',
                                    lockScreenBackgroundColorVal,
                                )
                            "
                        >
                        </v-color-input>
                    </v-row>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import { ref, onBeforeMount, useTemplateRef } from "vue";
import SettingsTitle from "./composables/SettingsTitle.vue";
import RadioSetting from "./composables/RadioSetting.vue";
import SelectionSetting from "./composables/SelectionSetting.vue";
import CheckboxSetting from "./composables/CheckboxSetting.vue";
import SliderSetting from "./composables/SliderSetting.vue";

const sebSettingsStore = useSEBSettingsStore();

const fetched = ref<boolean>(false);
// browserViewMode 0,1 is touchOptimized false and 2 is touchOptimized=true
const browserViewModeRef = useTemplateRef("browserViewMode");
const enableBrowserWindowToolbarRef = useTemplateRef(
    "enableBrowserWindowToolbar",
);
const audioSetVolumeLevelRef = useTemplateRef("audioSetVolumeLevel");

const lockScreenBackgroundColorVal = ref<string>("#0000");

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    fetched.value = await sebSettingsStore.fetchSingleValues(
        ViewType.USER_INTERFACE,
    );

    lockScreenBackgroundColorVal.value = sebSettingsStore.getStringValue(
        "lockScreenBackgroundColor",
    );
});

async function notifyBrowserViewMode() {
    await sebSettingsStore.saveSingleValue(
        "touchOptimized",
        browserViewModeRef.value?.radioValue === "2" ? "true" : "false",
    );
}
</script>
