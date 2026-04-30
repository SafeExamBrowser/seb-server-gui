<template>
    <LoadingFallbackComponent
        :loading="loadingSebSettingsView"
        :errors="errorSebSettingsView"
    >
        <v-row v-if="singleValues">
            <v-col class="text-subtitle-1">
                <SettingsTitle label="sebSettings.browser.links.title" />
                <v-row>
                    <RadioSetting
                        v-model="singleValues"
                        name="newBrowserWindowByLinkPolicy"
                        label="sebSettings.browser.links.policy"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="newBrowserWindowByLinkBlockForeign"
                        label="sebSettings.browser.links.block"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle label="sebSettings.browser.window.title" />
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="newBrowserWindowByLinkWidth"
                        label="sebSettings.browser.window.width"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="newBrowserWindowByLinkHeight"
                        label="sebSettings.browser.window.height"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="newBrowserWindowByLinkPositioning"
                        label="sebSettings.browser.window.pos"
                        :labels="true"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle label="sebSettings.browser.security.title" />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowFind"
                        label="sebSettings.browser.security.find"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowPDFReaderToolbar"
                        label="sebSettings.browser.security.toolbar"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowPrint"
                        label="sebSettings.browser.security.print"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="removeBrowserProfile"
                        label="sebSettings.browser.security.cache"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="enableRightMouseMac"
                        label="sebSettings.browser.security.enableRightMouse"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="browserWindowWebViewClassicHideDeprecationNote"
                        label="sebSettings.browser.security.browserWindowWebViewClassicHideDeprecationNote"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="browserConnectionErrorReload"
                        label="sebSettings.browser.security.errorReload"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle label="sebSettings.browser.restrictions.title" />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowBrowsingBackForward"
                        label="sebSettings.browser.restrictions.allowBackFor"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="browserWindowAllowReload"
                        label="sebSettings.browser.restrictions.allowReload"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="showReloadWarning"
                        label="sebSettings.browser.restrictions.showReloadWarning"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="browserWindowShowURL"
                        label="sebSettings.browser.restrictions.showURL"
                        :labels="true"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle
                    label="sebSettings.browser.restrictionsAdd.title"
                />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="newBrowserWindowNavigation"
                        label="sebSettings.browser.restrictionsAdd.allowBackFor"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="newBrowserWindowAllowReload"
                        label="sebSettings.browser.restrictionsAdd.allowReload"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="newBrowserWindowShowReloadWarning"
                        label="sebSettings.browser.restrictionsAdd.showReloadWarning"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="newBrowserWindowShowURL"
                        label="sebSettings.browser.restrictionsAdd.showURL"
                        :labels="true"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
            </v-col>

            <v-col class="text-subtitle-1">
                <SettingsTitle label="sebSettings.browser.agent" />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="enableSebBrowser"
                        label="sebSettings.browser.enableSebBrowser"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="browserWindowWebView"
                        label="sebSettings.browser.policy"
                        :labels="true"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <TextSetting
                        v-model="singleValues"
                        name="browserUserAgent"
                        label="sebSettings.browser.browserUserAgent"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <TextSetting
                        v-model="singleValues"
                        name="browserWindowTitleSuffix"
                        label="sebSettings.browser.windowTitleSuffix"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle label="sebSettings.browser.uaDesktop.title" />
                <v-row>
                    <RadioSetting
                        v-model="singleValues"
                        name="browserUserAgentWinDesktopMode"
                        label="sebSettings.browser.uaDesktop"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <TextSetting
                        v-model="singleValues"
                        name="browserUserAgentWinDesktopModeCustom"
                        label="sebSettings.browser.uaDesktop.custom"
                        :show-label="false"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle label="sebSettings.browser.uaMac.title" />
                <v-row>
                    <RadioSetting
                        v-model="singleValues"
                        name="browserUserAgentMac"
                        label="sebSettings.browser.uaMac"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <TextSetting
                        v-model="singleValues"
                        name="browserUserAgentMacCustom"
                        label="sebSettings.browser.uaMac.custom"
                        :show-label="false"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle label="sebSettings.browser.uaTouch.title" />
                <v-row>
                    <RadioSetting
                        ref="browserUserAgentWinTouchMode"
                        v-model="singleValues"
                        name="browserUserAgentWinTouchMode"
                        label="sebSettings.browser.uaTouch"
                        :disabled="context.readonly"
                        @saved="notifyBrowserUserAgentWinTouchMode"
                    />
                </v-row>
                <v-row>
                    <TextSetting
                        ref="browserUserAgentWinTouchModeCustom"
                        v-model="singleValues"
                        name="browserUserAgentWinTouchModeCustom"
                        label="sebSettings.browser.uaTouch.custom"
                        :show-label="false"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle label="sebSettings.browser.media.title" />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="browserMediaAutoplay"
                        label="sebSettings.browser.media.autoplay"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="browserMediaAutoplayAudio"
                        label="sebSettings.browser.media.audio"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="browserMediaAutoplayVideo"
                        label="sebSettings.browser.media.video"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="browserMediaCaptureCamera"
                        label="sebSettings.browser.media.camera"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="browserMediaCaptureMicrophone"
                        label="sebSettings.browser.media.mic"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="browserMediaCaptureScreen"
                        label="sebSettings.browser.media.screen"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="mobileAllowPictureInPictureMediaPlayback"
                        label="sebSettings.browser.media.pic"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="mobileAllowInlineMediaPlayback"
                        label="sebSettings.browser.media.playback"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="mobileCompactAllowInlineMediaPlayback"
                        label="sebSettings.browser.media.playbackPhone"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
            </v-col>
        </v-row>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { ViewType } from "@/models/seb-server/sebSettingsEnums.ts";
import { useTemplateRef } from "vue";
import SettingsTitle from "./components/SettingsTitle.vue";
import RadioSetting from "./components/inputFields/RadioSetting.vue";
import SelectionSetting from "./components/inputFields/SelectionSetting.vue";
import CheckboxSetting from "./components/inputFields/CheckboxSetting.vue";
import TextSetting from "./components/inputFields/TextSetting.vue";
import { useSEBSettingValues } from "./composables/useSEBSettingValues.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { SEBSettingsContext } from "./types.ts";

const props = defineProps<{
    context: SEBSettingsContext;
}>();

const { singleValues, loadingSebSettingsView, errorSebSettingsView } =
    useSEBSettingValues(
        props.context.isExam,
        props.context.containerId,
        ViewType.BROWSER,
    );

const browserUserAgentWinTouchModeRef = useTemplateRef(
    "browserUserAgentWinTouchMode",
);
const browserUserAgentWinTouchModeCustomRef = useTemplateRef(
    "browserUserAgentWinTouchModeCustom",
);

async function notifyBrowserUserAgentWinTouchMode() {
    if (!singleValues.value) return;

    if (browserUserAgentWinTouchModeRef.value?.radioValue === "1") {
        if (browserUserAgentWinTouchModeCustomRef.value != null) {
            browserUserAgentWinTouchModeCustomRef.value.textVal =
                singleValues.value.getStringValue(
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
