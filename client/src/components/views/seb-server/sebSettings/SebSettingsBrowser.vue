<template>
    <v-row v-if="fetched">
        <v-col class="text-subtitle-1">
            <SettingsTitle label="sebSettings.browser.links.title" />
            <v-row>
                <RadioSetting
                    name="newBrowserWindowByLinkPolicy"
                    label="sebSettings.browser.links.policy"
                    :tooltip="false"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="newBrowserWindowByLinkBlockForeign"
                    label="sebSettings.browser.links.block"
                    :tooltip="true"
                />
            </v-row>

            <SettingsTitle label="sebSettings.browser.window.title" />
            <v-row>
                <SelectionSetting
                    name="newBrowserWindowByLinkWidth"
                    label="sebSettings.browser.window.width"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <SelectionSetting
                    name="newBrowserWindowByLinkHeight"
                    label="sebSettings.browser.window.height"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <SelectionSetting
                    name="newBrowserWindowByLinkPositioning"
                    label="sebSettings.browser.window.pos"
                    :labels="true"
                    :tooltip="false"
                />
            </v-row>

            <SettingsTitle label="sebSettings.browser.security.title" />
            <v-row>
                <CheckboxSetting
                    name="allowFind"
                    label="sebSettings.browser.security.find"
                    :tooltip="false"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="allowPDFReaderToolbar"
                    label="sebSettings.browser.security.toolbar"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="allowPrint"
                    label="sebSettings.browser.security.print"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="removeBrowserProfile"
                    label="sebSettings.browser.security.cache"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="enableRightMouseMac"
                    label="sebSettings.browser.security.enableRightMouse"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="browserWindowWebViewClassicHideDeprecationNote"
                    label="sebSettings.browser.security.browserWindowWebViewClassicHideDeprecationNote"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="browserConnectionErrorReload"
                    label="sebSettings.browser.security.errorReload"
                    :tooltip="true"
                />
            </v-row>

            <SettingsTitle label="sebSettings.browser.restrictions.title" />
            <v-row>
                <CheckboxSetting
                    name="allowBrowsingBackForward"
                    label="sebSettings.browser.restrictions.allowBackFor"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="browserWindowAllowReload"
                    label="sebSettings.browser.restrictions.allowReload"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="showReloadWarning"
                    label="sebSettings.browser.restrictions.showReloadWarning"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <SelectionSetting
                    name="browserWindowShowURL"
                    label="sebSettings.browser.restrictions.showURL"
                    :labels="true"
                    :tooltip="true"
                />
            </v-row>

            <SettingsTitle label="sebSettings.browser.restrictionsAdd.title" />
            <v-row>
                <CheckboxSetting
                    name="newBrowserWindowNavigation"
                    label="sebSettings.browser.restrictionsAdd.allowBackFor"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="newBrowserWindowAllowReload"
                    label="sebSettings.browser.restrictionsAdd.allowReload"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="newBrowserWindowShowReloadWarning"
                    label="sebSettings.browser.restrictionsAdd.showReloadWarning"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <SelectionSetting
                    name="newBrowserWindowShowURL"
                    label="sebSettings.browser.restrictionsAdd.showURL"
                    :labels="true"
                    :tooltip="true"
                />
            </v-row>
        </v-col>

        <v-col class="text-subtitle-1">
            <SettingsTitle label="sebSettings.browser.agent" />
            <v-row>
                <CheckboxSetting
                    name="enableSebBrowser"
                    label="sebSettings.browser.enableSebBrowser"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <SelectionSetting
                    name="browserWindowWebView"
                    label="sebSettings.browser.policy"
                    :labels="true"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <TextSetting
                    name="browserUserAgent"
                    label="sebSettings.browser.browserUserAgent"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <TextSetting
                    name="browserWindowTitleSuffix"
                    label="sebSettings.browser.windowTitleSuffix"
                    :tooltip="true"
                />
            </v-row>

            <SettingsTitle label="sebSettings.browser.uaDesktop.title" />
            <v-row>
                <RadioSetting
                    name="browserUserAgentWinDesktopMode"
                    label="sebSettings.browser.uaDesktop"
                />
            </v-row>
            <v-row>
                <TextSetting
                    name="browserUserAgentWinDesktopModeCustom"
                    label="sebSettings.browser.uaDesktop.custom"
                    :show-label="false"
                    :tooltip="true"
                />
            </v-row>

            <SettingsTitle label="sebSettings.browser.uaMac.title" />
            <v-row>
                <RadioSetting
                    name="browserUserAgentMac"
                    label="sebSettings.browser.uaMac"
                />
            </v-row>
            <v-row>
                <TextSetting
                    name="browserUserAgentMacCustom"
                    label="sebSettings.browser.uaMac.custom"
                    :show-label="false"
                    :tooltip="true"
                />
            </v-row>

            <SettingsTitle label="sebSettings.browser.uaTouch.title" />
            <v-row>
                <RadioSetting
                    ref="browserUserAgentWinTouchMode"
                    name="browserUserAgentWinTouchMode"
                    label="sebSettings.browser.uaTouch"
                    @saved="notifyBrowserUserAgentWinTouchMode"
                />
            </v-row>
            <v-row>
                <TextSetting
                    ref="browserUserAgentWinTouchModeCustom"
                    name="browserUserAgentWinTouchModeCustom"
                    label="sebSettings.browser.uaTouch.custom"
                    :show-label="false"
                    :tooltip="true"
                />
            </v-row>

            <SettingsTitle label="sebSettings.browser.media.title" />
            <v-row>
                <CheckboxSetting
                    name="browserMediaAutoplay"
                    label="sebSettings.browser.media.autoplay"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="browserMediaAutoplayAudio"
                    label="sebSettings.browser.media.audio"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="browserMediaAutoplayVideo"
                    label="sebSettings.browser.media.video"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="browserMediaCaptureCamera"
                    label="sebSettings.browser.media.camera"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="browserMediaCaptureMicrophone"
                    label="sebSettings.browser.media.mic"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="browserMediaCaptureScreen"
                    label="sebSettings.browser.media.screen"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="mobileAllowPictureInPictureMediaPlayback"
                    label="sebSettings.browser.media.pic"
                    :tooltip="false"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="mobileAllowInlineMediaPlayback"
                    label="sebSettings.browser.media.playback"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    name="mobileCompactAllowInlineMediaPlayback"
                    label="sebSettings.browser.media.playbackPhone"
                    :tooltip="true"
                />
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import { ref, onBeforeMount, useTemplateRef } from "vue";
import SettingsTitle from "./components/SettingsTitle.vue";
import RadioSetting from "./components/RadioSetting.vue";
import SelectionSetting from "./components/SelectionSetting.vue";
import CheckboxSetting from "./components/CheckboxSetting.vue";
import TextSetting from "./components/TextSetting.vue";

const sebSettingsStore = useSEBSettingsStore();
const fetched = ref<boolean>(false);

const browserUserAgentWinTouchModeRef = useTemplateRef(
    "browserUserAgentWinTouchMode",
);
const browserUserAgentWinTouchModeCustomRef = useTemplateRef(
    "browserUserAgentWinTouchModeCustom",
);

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    fetched.value = await sebSettingsStore.fetchSingleValues(ViewType.BROWSER);
});

async function notifyBrowserUserAgentWinTouchMode() {
    if (browserUserAgentWinTouchModeRef.value?.radioValue === "1") {
        if (browserUserAgentWinTouchModeCustomRef.value != null) {
            browserUserAgentWinTouchModeCustomRef.value.textVal =
                sebSettingsStore.getStringValue(
                    "browserUserAgentWinTouchModeIPad",
                );
        }
    } else {
        if (browserUserAgentWinTouchModeCustomRef.value != null) {
            browserUserAgentWinTouchModeCustomRef.value.textVal = "";
        }
    }
}
</script>
