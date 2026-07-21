<template>
    <LoadingFallbackComponent
        :loading="loadingSebSettingsView"
        :errors="errorSebSettingsView"
    >
        <v-row v-if="singleValues">
            <v-col class="text-body-large">
                <SettingsTitle label="sebSettings.userView.view_mode.title" />
                <v-row>
                    <RadioSetting
                        ref="browserViewMode"
                        v-model="singleValues"
                        name="browserViewMode"
                        label="sebSettings.userView.view_mode"
                        :disabled="context.readonly"
                        @saved="notifyBrowserViewMode"
                    />
                </v-row>
                <SettingsTitle
                    label="sebSettings.userView.main_browser.title"
                />
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="mainBrowserWindowWidth"
                        label="sebSettings.userView.main_browser.width"
                        :disabled="
                            context.readonly ||
                            browserViewModeRef?.radioValue !== '0'
                        "
                        :tooltip="true"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="mainBrowserWindowHeight"
                        label="sebSettings.userView.main_browser.height"
                        :disabled="
                            context.readonly ||
                            browserViewModeRef?.radioValue !== '0'
                        "
                        :tooltip="true"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="mainBrowserWindowPositioning"
                        label="sebSettings.userView.main_browser.pos"
                        :labels="true"
                        :disabled="
                            context.readonly ||
                            browserViewModeRef?.radioValue !== '0'
                        "
                    />
                </v-row>
                <SettingsTitle
                    label="sebSettings.userView.browser_window.title"
                />
                <v-row>
                    <CheckboxSetting
                        ref="enableBrowserWindowToolbar"
                        v-model="singleValues"
                        name="enableBrowserWindowToolbar"
                        label="sebSettings.userView.browser_window.enableToolbar"
                        :disabled="context.readonly"
                        :tooltip="true"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="browserWindowAllowAddressBar"
                        label="sebSettings.userView.browser_window.addrBar"
                        :tooltip="false"
                        :disabled="
                            context.readonly ||
                            !enableBrowserWindowToolbarRef?.boolVal
                        "
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="newBrowserWindowAllowAddressBar"
                        label="sebSettings.userView.browser_window.newAddrBar"
                        :tooltip="false"
                        :disabled="
                            context.readonly ||
                            !enableBrowserWindowToolbarRef?.boolVal
                        "
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowDeveloperConsole"
                        label="sebSettings.userView.browser_window.allowDev"
                        :tooltip="false"
                        :disabled="
                            context.readonly ||
                            !enableBrowserWindowToolbarRef?.boolVal
                        "
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="hideBrowserWindowToolbar"
                        label="sebSettings.userView.browser_window.hideTool"
                        :tooltip="true"
                        :disabled="
                            context.readonly ||
                            !enableBrowserWindowToolbarRef?.boolVal
                        "
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="showMenuBar"
                        label="sebSettings.userView.browser_window.showMenuBar"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <SettingsTitle label="sebSettings.userView.zoom.title" />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="enableZoomPage"
                        label="sebSettings.userView.zoom.enableZoomPage"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="enableZoomText"
                        label="sebSettings.userView.zoom.enableZoomText"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="defaultPageZoomLevel"
                        label="sebSettings.userView.zoom.defaultPageZoomLevel"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="defaultTextZoomLevel"
                        label="sebSettings.userView.zoom.defaultTextZoomLevel"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle label="sebSettings.userView.status_bar.title" />
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="mobileStatusBarAppearance"
                        label="sebSettings.userView.status_bar.mobileStatusBarAppearance"
                        :labels="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="mobileStatusBarAppearanceExtended"
                        label="sebSettings.userView.status_bar.mobileStatusBarAppearanceExtended"
                        :labels="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle label="sebSettings.userView.screenLock.title" />
                <v-row>
                    <ColorSetting
                        v-model="singleValues"
                        name="lockScreenBackgroundColor"
                        label="sebSettings.userView.screenLock.color"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
            </v-col>

            <v-col class="text-body-large">
                <SettingsTitle label="sebSettings.userView.audio.title" />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="audioControlEnabled"
                        label="sebSettings.userView.audio.enableControl"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="audioMute"
                        label="sebSettings.userView.audio.mute"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        ref="audioSetVolumeLevel"
                        v-model="singleValues"
                        name="audioSetVolumeLevel"
                        label="sebSettings.userView.audio.volume"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <SliderSetting
                        v-model="singleValues"
                        name="audioVolumeLevel"
                        :max="100"
                        :min="0"
                        :step="1"
                        :disabled="
                            context.readonly || !audioSetVolumeLevelRef?.boolVal
                        "
                    />
                </v-row>
                <SettingsTitle
                    label="sebSettings.userView.spellChecker.title"
                />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowSpellCheck"
                        label="sebSettings.userView.spellChecker.allow"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowDictionaryLookup"
                        label="sebSettings.userView.spellChecker.allowDict"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <SettingsTitle label="sebSettings.userView.task_bar.title" />
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="taskBarHeight"
                        label="sebSettings.userView.task_bar.height"
                        :labels="false"
                        :disabled="context.readonly"
                        :tooltip="true"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="showTaskBar"
                        label="sebSettings.userView.task_bar.showTaskBar"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="showSideMenu"
                        label="sebSettings.userView.task_bar.showSideMenu"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="raiseHandButtonShow"
                        label="sebSettings.userView.task_bar.raiseHandButtonShow"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="raiseHandButtonAlwaysPromptMessage"
                        label="sebSettings.userView.task_bar.raiseHandButtonAlwaysPromptMessage"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowWlan"
                        label="sebSettings.userView.task_bar.allowWlan"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="hideWiFiControls"
                        label="sebSettings.userView.task_bar.hideWiFiControls"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="showReloadButton"
                        label="sebSettings.userView.task_bar.showReloadButton"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="showTime"
                        label="sebSettings.userView.task_bar.showTime"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="showInputLanguage"
                        label="sebSettings.userView.task_bar.showInputLanguage"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="showBackToStartButton"
                        label="sebSettings.userView.task_bar.showBackToStartButton"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="showQRVerifyButton"
                        label="sebSettings.userView.task_bar.showQRVerifyButton"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="enableScrollLock"
                        label="sebSettings.userView.task_bar.enableScrollLock"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="showScrollLockButton"
                        label="sebSettings.userView.task_bar.showScrollLockButton"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="showQuitButton"
                        label="sebSettings.userView.task_bar.showQuitButton"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="showScanQRCodeButton"
                        label="sebSettings.userView.task_bar.showScanQRCodeButton"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="showNavigationButtons"
                        label="sebSettings.userView.task_bar.showNavigationButtons"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle
                    label="sebSettings.userView.accessibility.title"
                />
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="accessibilityFeatureVoiceOver"
                        label="sebSettings.userView.accessibility.accessibilityFeatureVoiceOver"
                        :labels="true"
                        :disabled="context.readonly"
                        :tooltip="false"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="accessibilityFeatureAssistiveTouch"
                        label="sebSettings.userView.accessibility.accessibilityFeatureAssistiveTouch"
                        :labels="true"
                        :disabled="context.readonly"
                        :tooltip="false"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="accessibilityFeatureGrayscaleDisplay"
                        label="sebSettings.userView.accessibility.accessibilityFeatureGrayscaleDisplay"
                        :labels="true"
                        :disabled="context.readonly"
                        :tooltip="false"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="accessibilityFeatureInvertColors"
                        label="sebSettings.userView.accessibility.accessibilityFeatureInvertColors"
                        :labels="true"
                        :disabled="context.readonly"
                        :tooltip="false"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="accessibilityFeatureZoom"
                        label="sebSettings.userView.accessibility.accessibilityFeatureZoom"
                        :labels="true"
                        :disabled="context.readonly"
                        :tooltip="false"
                    />
                </v-row>
            </v-col>
        </v-row>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { useTemplateRef } from "vue";

import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { ViewType } from "@/models/seb-server/sebSettingsEnums.ts";

import CheckboxSetting from "./components/inputFields/CheckboxSetting.vue";
import ColorSetting from "./components/inputFields/ColorSetting.vue";
import RadioSetting from "./components/inputFields/RadioSetting.vue";
import SelectionSetting from "./components/inputFields/SelectionSetting.vue";
import SliderSetting from "./components/inputFields/SliderSetting.vue";
import SettingsTitle from "./components/SettingsTitle.vue";
import { useSEBSettingValues } from "./composables/useSEBSettingValues.ts";
import { SEBSettingsContext } from "./types.ts";

const props = defineProps<{
    context: SEBSettingsContext;
}>();

const { singleValues, loadingSebSettingsView, errorSebSettingsView } =
    useSEBSettingValues(
        props.context.isExam,
        props.context.containerId,
        ViewType.USER_INTERFACE,
    );

const browserViewModeRef = useTemplateRef("browserViewMode");
const enableBrowserWindowToolbarRef = useTemplateRef(
    "enableBrowserWindowToolbar",
);
const audioSetVolumeLevelRef = useTemplateRef("audioSetVolumeLevel");

async function notifyBrowserViewMode() {
    if (!singleValues.value) return;

    singleValues.value.saveSingleValue(
        "touchOptimized",
        browserViewModeRef.value?.radioValue === "2" ? "true" : "false",
    );
}
</script>
