<template>
    <LoadingFallbackComponent
        :loading="loadingSebSettingsView"
        :errors="errorSebSettingsView"
    >
        <v-row v-if="singleValues">
            <v-col class="text-body-large">
                <SettingsTitle
                    label="sebSettings.securityView.sebService.title"
                />
                <v-row>
                    <CheckboxSetting
                        ref="sebServiceIgnore"
                        v-model="singleValues"
                        name="sebServiceIgnore"
                        label="sebSettings.securityView.sebService.sebServiceIgnore"
                        :tooltip="false"
                        :disabled="context.readonly"
                        :invert-value="true"
                        @saved="notifyEBServiceIgnore"
                    />
                </v-row>
                <v-row>
                    <v-col
                        ><div style="color: darkred">
                            {{
                                translate(
                                    "sebSettings.securityView.sebService.note",
                                )
                            }}
                        </div>
                    </v-col>
                </v-row>
                <v-row>
                    <RadioSetting
                        v-model="singleValues"
                        name="sebServicePolicy"
                        label="sebSettings.securityView.sebService.sebServicePolicy"
                        :show-label="true"
                        :tooltip="false"
                        :label-tooltip="true"
                        :disabled="
                            context.readonly || igonreSEBServiceRef
                                ? !igonreSEBServiceRef?.boolVal
                                : false
                        "
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="enableWindowsUpdate"
                        label="sebSettings.securityView.sebService.enableWindowsUpdate"
                        :tooltip="false"
                        :disabled="
                            context.readonly || igonreSEBServiceRef
                                ? !igonreSEBServiceRef?.boolVal
                                : false
                        "
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="enableChromeNotifications"
                        label="sebSettings.securityView.sebService.enableChromeNotifications"
                        :tooltip="false"
                        :disabled="
                            context.readonly || igonreSEBServiceRef
                                ? !igonreSEBServiceRef?.boolVal
                                : false
                        "
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowScreenSharing"
                        label="sebSettings.securityView.sebService.allowScreenSharing"
                        :tooltip="false"
                        :disabled="
                            context.readonly || igonreSEBServiceRef
                                ? !igonreSEBServiceRef?.boolVal
                                : false
                        "
                    />
                </v-row>

                <SettingsTitle
                    label="sebSettings.securityView.kioskMode.kioskMode"
                    :tooltip="true"
                />
                <v-row>
                    <RadioSetting
                        v-model="singleValues"
                        name="kioskMode"
                        label="sebSettings.securityView.kioskMode.items"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="screenProctoringAACCapturePolicy"
                        label="sebSettings.securityView.screenProctoringAACCapturePolicy"
                        :labels="true"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="lockdownModePolicy"
                        label="sebSettings.securityView.lockdownModePolicy"
                        :labels="true"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle
                    label="sebSettings.securityView.overall.title"
                    :tooltip="false"
                />
                <v-row>
                    <NumberSetting
                        v-model="singleValues"
                        name="allowedDisplaysMaxNumber"
                        label="sebSettings.securityView.overall.allowedDisplaysMaxNumber"
                        :show-label="true"
                        :tooltip="false"
                        :disabled="context.readonly"
                        :min="1"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowedDisplayBuiltinEnforce"
                        label="sebSettings.securityView.overall.allowedDisplayBuiltinEnforce"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowedDisplaysIgnoreFailure"
                        label="sebSettings.securityView.overall.allowedDisplaysIgnoreFailure"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="enableCursorVerification"
                        label="sebSettings.securityView.overall.enableCursorVerification"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="enableSessionVerification"
                        label="sebSettings.securityView.overall.enableSessionVerification"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowStickyKeys"
                        label="sebSettings.securityView.overall.allowStickyKeys"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle
                    label="sebSettings.securityView.logging.title"
                    :tooltip="false"
                />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="enableLogging"
                        label="sebSettings.securityView.logging.enableLogging"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <TextSetting
                        v-model="singleValues"
                        name="logDirectoryWin"
                        label="sebSettings.securityView.logging.logDirectoryWin"
                        :tooltip="false"
                        :show-label="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <TextSetting
                        v-model="singleValues"
                        name="logDirectoryOSX"
                        label="sebSettings.securityView.logging.logDirectoryOSX"
                        :tooltip="false"
                        :show-label="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="logLevel"
                        label="sebSettings.securityView.logging.logLevel"
                        :labels="true"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowApplicationLog"
                        label="sebSettings.securityView.logging.allowApplicationLog"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="showApplicationLogButton"
                        label="sebSettings.securityView.logging.showApplicationLogButton"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle
                    label="sebSettings.securityView.sebVersion.title"
                    :tooltip="false"
                />
                <v-row>
                    <v-col
                        ><div>
                            {{
                                translate(
                                    "sebSettings.securityView.sebVersion.sebAllowedVersions_note1",
                                )
                            }}
                        </div>
                        <div class="font-weight-bold pl-5">
                            {{
                                translate(
                                    "sebSettings.securityView.sebVersion.sebAllowedVersions_format",
                                )
                            }}
                        </div>
                        <div>
                            {{
                                translate(
                                    "sebSettings.securityView.sebVersion.sebAllowedVersions_note2",
                                )
                            }}
                        </div>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="pt-1 pb-1">
                        <SEBVersionSetting
                            v-model="singleValues"
                            name="sebAllowedVersions"
                            label="sebSettings.securityView.sebVersion.sebAllowedVersions"
                            :show-label="false"
                            :tooltip="false"
                            :disabled="context.readonly"
                        />
                    </v-col>
                </v-row>
            </v-col>

            <!-- Left Right-->

            <v-col class="text-body-large">
                <SettingsTitle
                    label="sebSettings.securityView.macOS.title"
                    :tooltip="false"
                />
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="minMacOSVersion"
                        label="sebSettings.securityView.macOS.minMacOSVersion"
                        :labels="true"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="enableMacOSAAC"
                        label="sebSettings.securityView.macOS.enableMacOSAAC"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="aacDnsPrePinning"
                        label="sebSettings.securityView.macOS.aacDnsPrePinning"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="enableAppSwitcherCheck"
                        label="sebSettings.securityView.macOS.enableAppSwitcherCheck"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="forceAppFolderInstall"
                        label="sebSettings.securityView.macOS.forceAppFolderInstall"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowUserAppFolderInstall"
                        label="sebSettings.securityView.macOS.allowUserAppFolderInstall"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowSiri"
                        label="sebSettings.securityView.macOS.allowSiri"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowDictation"
                        label="sebSettings.securityView.macOS.allowDictation"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="detectStoppedProcess"
                        label="sebSettings.securityView.macOS.detectStoppedProcess"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowDisplayMirroring"
                        label="sebSettings.securityView.macOS.allowDisplayMirroring"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowedDisplayBuiltin"
                        label="sebSettings.securityView.macOS.allowedDisplayBuiltin"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowedDisplayBuiltinExceptDesktop"
                        label="sebSettings.securityView.macOS.allowedDisplayBuiltinExceptDesktop"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="screenSharingMacEnforceBlocked"
                        label="sebSettings.securityView.macOS.screenSharingMacEnforceBlocked"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowScreenCapture"
                        label="sebSettings.securityView.macOS.allowScreenCapture"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowWindowCapture"
                        label="sebSettings.securityView.macOS.allowWindowCapture"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="blockScreenShotsLegacy"
                        label="sebSettings.securityView.macOS.blockScreenShotsLegacy"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>

                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowMacOSVersionNumberCheckFull"
                        label="sebSettings.securityView.macOS.allowMacOSVersionNumberCheckFull"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowMacOSVersionNumberMajor"
                        label="sebSettings.securityView.macOS.allowMacOSVersionNumberMajor"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowMacOSVersionNumberMinor"
                        label="sebSettings.securityView.macOS.allowMacOSVersionNumberMinor"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowMacOSVersionNumberPatch"
                        label="sebSettings.securityView.macOS.allowMacOSVersionNumberPatch"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="detectAccessibilityApps"
                        label="sebSettings.securityView.macOS.detectAccessibilityApps"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <SettingsTitle
                    label="sebSettings.securityView.ios.title"
                    :tooltip="false"
                />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="mobileAllowSingleAppMode"
                        label="sebSettings.securityView.ios.mobileAllowSingleAppMode"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="mobileEnableASAM"
                        label="sebSettings.securityView.ios.mobileEnableASAM"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="mobileEnableGuidedAccessLinkTransform"
                        label="sebSettings.securityView.ios.mobileEnableGuidedAccessLinkTransform"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="mobilePreventAutoLock"
                        label="sebSettings.securityView.ios.mobilePreventAutoLock"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="mobileSleepModeLockScreen"
                        label="sebSettings.securityView.ios.mobileSleepModeLockScreen"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>

                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="allowiOSBetaVersionNumber"
                        label="sebSettings.securityView.ios.allowiOSBetaVersionNumber"
                        :labels="true"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <SelectionSetting
                        v-model="singleValues"
                        name="allowiOSVersionNumberMajor"
                        label="sebSettings.securityView.ios.allowiOSVersionNumberMajor"
                        :labels="false"
                        :tooltip="false"
                        :disabled="context.readonly"
                    />
                </v-row>

                <v-row>
                    <NumberSetting
                        v-model="singleValues"
                        name="allowiOSVersionNumberMinor"
                        label="sebSettings.securityView.ios.allowiOSVersionNumberMinor"
                        :show-label="true"
                        :tooltip="false"
                        :disabled="context.readonly"
                        :min="0"
                    />
                </v-row>

                <v-row>
                    <NumberSetting
                        v-model="singleValues"
                        name="allowiOSVersionNumberPatch"
                        label="sebSettings.securityView.ios.allowiOSVersionNumberPatch"
                        :show-label="true"
                        :tooltip="false"
                        :disabled="context.readonly"
                        :min="0"
                    />
                </v-row>

                <SettingsTitle
                    label="sebSettings.securityView.clipboard.title"
                    :tooltip="false"
                />
                <v-row>
                    <RadioSetting
                        v-model="singleValues"
                        name="clipboardPolicy"
                        label="sebSettings.securityView.clipboard"
                        :tooltip="true"
                        :disabled="context.readonly"
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
import { translate } from "@/utils/generalUtils.ts";

import CheckboxSetting from "./components/inputFields/CheckboxSetting.vue";
import NumberSetting from "./components/inputFields/NumberSetting.vue";
import RadioSetting from "./components/inputFields/RadioSetting.vue";
import SEBVersionSetting from "./components/inputFields/SEBVersionSetting.vue";
import SelectionSetting from "./components/inputFields/SelectionSetting.vue";
import TextSetting from "./components/inputFields/TextSetting.vue";
import SettingsTitle from "./components/SettingsTitle.vue";
import {
    ignoreSEBService,
    useSEBSettingValues,
} from "./composables/useSEBSettingValues.ts";
import { SEBSettingsContext } from "./types.ts";

const props = defineProps<{
    context: SEBSettingsContext;
}>();

const { singleValues, loadingSebSettingsView, errorSebSettingsView } =
    useSEBSettingValues(
        props.context.isExam,
        props.context.containerId,
        ViewType.SECURITY,
    );

const igonreSEBServiceRef = useTemplateRef("sebServiceIgnore");

function notifyEBServiceIgnore() {
    if (!singleValues) return;

    if (igonreSEBServiceRef.value) {
        ignoreSEBService.value = igonreSEBServiceRef.value.boolVal;
    }
}
</script>
