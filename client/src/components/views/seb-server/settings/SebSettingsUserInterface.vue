<template>
    <v-row>
        <v-col class="text-subtitle-1">
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.userView.view_mode.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>

            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-radio-group
                        v-model="browserViewModeVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        @update:model-value="
                            saveBrowserViewMode(browserViewModeVal)
                        "
                    >
                        <v-radio
                            :label="
                                translate('sebSettings.userView.view_mode.0')
                            "
                            value="0"
                        >
                            <v-tooltip
                                activator="parent"
                                location="top left"
                                max-width="400"
                            >
                                {{
                                    translate(
                                        "sebSettings.userView.view_mode.0_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>
                        <v-radio
                            :label="
                                translate('sebSettings.userView.view_mode.1')
                            "
                            value="1"
                        >
                            <v-tooltip
                                activator="parent"
                                location="top left"
                                max-width="400"
                            >
                                {{
                                    translate(
                                        "sebSettings.userView.view_mode.1_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>
                        <v-radio
                            :label="
                                translate('sebSettings.userView.view_mode.2')
                            "
                            value="2"
                        >
                            <v-tooltip
                                activator="parent"
                                location="top left"
                                max-width="400"
                            >
                                {{
                                    translate(
                                        "sebSettings.userView.view_mode.2_tooltip",
                                    )
                                }}
                            </v-tooltip>
                        </v-radio>
                    </v-radio-group>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.userView.main_browser.title") }}
                    <v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-select
                        v-model="mainBrowserWindowWidthVal"
                        density="compact"
                        :label="
                            translate('sebSettings.userView.main_browser.width')
                        "
                        :disabled="
                            sebSettingsStore.readonly ||
                            browserViewModeVal !== '0'
                        "
                        hide-details
                        :items="mainBrowserWindowWidthItems"
                        variant="outlined"
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'mainBrowserWindowWidth',
                                mainBrowserWindowWidthVal,
                            )
                        "
                    >
                    </v-select>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.main_browser.width_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="mainBrowserWindowHeightVal"
                        density="compact"
                        :label="
                            translate(
                                'sebSettings.userView.main_browser.height',
                            )
                        "
                        :disabled="
                            sebSettingsStore.readonly ||
                            browserViewModeVal !== '0'
                        "
                        hide-details
                        :items="mainBrowserWindowHeightItems"
                        variant="outlined"
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'mainBrowserWindowHeight',
                                mainBrowserWindowHeightVal,
                            )
                        "
                    >
                    </v-select>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.main_browser.height_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-select
                        v-model="mainBrowserWindowPositioningVal"
                        density="compact"
                        :label="
                            translate('sebSettings.userView.main_browser.pos')
                        "
                        :disabled="
                            sebSettingsStore.readonly ||
                            browserViewModeVal !== '0'
                        "
                        hide-details
                        :items="mainBrowserWindowPositioningItems"
                        variant="outlined"
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'mainBrowserWindowPositioning',
                                mainBrowserWindowPositioningVal,
                            )
                        "
                    >
                    </v-select>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.userView.browser_window.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableBrowserWindowToolbarVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.browser_window.enableToolbar',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'enableBrowserWindowToolbar',
                                enableBrowserWindowToolbarVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.browser_window.enableToolbar_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-5">
                    <v-checkbox-btn
                        v-model="browserWindowAllowAddressBarVal"
                        :disabled="
                            sebSettingsStore.readonly ||
                            enableBrowserWindowToolbarVal == false
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.browser_window.addrBar',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'browserWindowAllowAddressBar',
                                browserWindowAllowAddressBarVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-5">
                    <v-checkbox-btn
                        v-model="newBrowserWindowAllowAddressBarVal"
                        :disabled="
                            sebSettingsStore.readonly ||
                            enableBrowserWindowToolbarVal == false
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.browser_window.newAddrBar',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'newBrowserWindowAllowAddressBar',
                                newBrowserWindowAllowAddressBarVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="pt-0 pb-0 pl-5">
                    <v-checkbox-btn
                        v-model="allowDeveloperConsoleVal"
                        :disabled="
                            sebSettingsStore.readonly ||
                            enableBrowserWindowToolbarVal == false
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.browser_window.allowDev',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'allowDeveloperConsole',
                                allowDeveloperConsoleVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-5">
                    <v-checkbox-btn
                        v-model="hideBrowserWindowToolbarVal"
                        :disabled="
                            sebSettingsStore.readonly ||
                            enableBrowserWindowToolbarVal == false
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.browser_window.hideTool',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'hideBrowserWindowToolbar',
                                hideBrowserWindowToolbarVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.browser_window.hideTool_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="showMenuBarVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.browser_window.showMenuBar',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'showMenuBar',
                                showMenuBarVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.browser_window.showMenuBar_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.userView.zoom.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableZoomPageVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.zoom.enableZoomPage',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'enableZoomPage',
                                enableZoomPageVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.zoom.enableZoomPage_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableZoomTextVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.zoom.enableZoomText',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'enableZoomText',
                                enableZoomTextVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.zoom.enableZoomText_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
        </v-col>

        <v-col class="text-subtitle-1">
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.userView.audio.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="audioControlEnabledVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.audio.enableControl',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'audioControlEnabled',
                                audioControlEnabledVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.audio.enableControl_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="audioMuteVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.userView.audio.mute')"
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'audioMute',
                                audioMuteVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate("sebSettings.userView.audio.mute_tooltip")
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="audioSetVolumeLevelVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.userView.audio.volume')"
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'audioSetVolumeLevel',
                                audioSetVolumeLevelVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.audio.volume_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-slider
                        v-model="audioVolumeLevelVal"
                        :max="100"
                        :min="0"
                        :step="1"
                        :disabled="
                            sebSettingsStore.readonly || !audioSetVolumeLevelVal
                        "
                        hide-details
                        @update:focused="
                            sebSettingsStore.saveSingleValue(
                                'audioVolumeLevel',
                                audioVolumeLevelVal.toString(),
                            )
                        "
                    ></v-slider>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.userView.spellChecker.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowSpellCheckVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate('sebSettings.userView.spellChecker.allow')
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'allowSpellCheck',
                                allowSpellCheckVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.spellChecker.allow_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowDictionaryLookupVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.spellChecker.allowDict',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'allowDictionaryLookup',
                                allowDictionaryLookupVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.spellChecker.allowDict_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.userView.task_bar.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="showTaskBarVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.task_bar.showTaskBar',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'showTaskBar',
                                showTaskBarVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.task_bar.showTaskBar_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="showSideMenuVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.task_bar.showSideMenu',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'showSideMenu',
                                showSideMenuVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="raiseHandButtonShowVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.task_bar.raiseHandButtonShow',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'raiseHandButtonShow',
                                raiseHandButtonShowVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="raiseHandButtonAlwaysPromptMessageVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.task_bar.raiseHandButtonAlwaysPromptMessage',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'raiseHandButtonAlwaysPromptMessage',
                                raiseHandButtonAlwaysPromptMessageVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.task_bar.raiseHandButtonAlwaysPromptMessage_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="allowWlanVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate('sebSettings.userView.task_bar.allowWlan')
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'allowWlan',
                                allowWlanVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.task_bar.allowWlan_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="showReloadButtonVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.task_bar.showReloadButton',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'showReloadButton',
                                showReloadButtonVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.task_bar.showReloadButton_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="showTimeVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate('sebSettings.userView.task_bar.showTime')
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'showTime',
                                showTimeVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="showInputLanguageVal"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate(
                                'sebSettings.userView.task_bar.showInputLanguage',
                            )
                        "
                        @update:model-value="
                            sebSettingsStore.saveSingleValue(
                                'showInputLanguage',
                                showInputLanguageVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                    <v-tooltip
                        activator="parent"
                        location="top left"
                        max-width="400"
                    >
                        {{
                            translate(
                                "sebSettings.userView.task_bar.showInputLanguage_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>

            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.userView.screenLock.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
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
import { stringToBoolean, translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import { ref, onBeforeMount } from "vue";

const sebSettingsStore = useSEBSettingsStore();

// 0 and 1 is browserViewMode and 2 is touchOptimized=true / browserViewMode=null
const browserViewModeVal = ref<string>("0");
const touchOptimizedVal = ref<boolean>(false);

const mainBrowserWindowWidthVal = ref<string>("100%");
const mainBrowserWindowWidthItems = ref<{ title: string; value: string }[]>([]);
const mainBrowserWindowHeightVal = ref<string>("100%");
const mainBrowserWindowHeightItems = ref<{ title: string; value: string }[]>(
    [],
);
const mainBrowserWindowPositioningVal = ref<string>("1");
const mainBrowserWindowPositioningItems = ref<
    { title: string; value: string }[]
>([]);

const enableBrowserWindowToolbarVal = ref<boolean>(false);
const browserWindowAllowAddressBarVal = ref<boolean>(false);
const newBrowserWindowAllowAddressBarVal = ref<boolean>(false);
const allowDeveloperConsoleVal = ref<boolean>(false);
const hideBrowserWindowToolbarVal = ref<boolean>(false);
const showMenuBarVal = ref<boolean>(false);

const showTaskBarVal = ref<boolean>(false);
const showSideMenuVal = ref<boolean>(false);
const raiseHandButtonShowVal = ref<boolean>(false);
const raiseHandButtonAlwaysPromptMessageVal = ref<boolean>(false);
const allowWlanVal = ref<boolean>(false);
const showReloadButtonVal = ref<boolean>(false);
const showTimeVal = ref<boolean>(false);
const showInputLanguageVal = ref<boolean>(false);

const enableZoomPageVal = ref<boolean>(false);
const enableZoomTextVal = ref<boolean>(false);

const audioControlEnabledVal = ref<boolean>(false);
const audioMuteVal = ref<boolean>(false);
const audioSetVolumeLevelVal = ref<boolean>(false);
const audioVolumeLevelVal = ref<number>(25);

const allowSpellCheckVal = ref<boolean>(false);
const allowDictionaryLookupVal = ref<boolean>(false);

const lockScreenBackgroundColorVal = ref<string>("#0000");

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    await sebSettingsStore.fetchSingleValues(ViewType.USER_INTERFACE);

    browserViewModeVal.value =
        sebSettingsStore.getStringValue("browserViewMode");
    touchOptimizedVal.value =
        sebSettingsStore.getBooleanValue("touchOptimized");
    mainBrowserWindowWidthVal.value = sebSettingsStore.getStringValue(
        "mainBrowserWindowWidth",
    );
    sebSettingsStore.applyAttributes(
        "mainBrowserWindowWidth",
        mainBrowserWindowWidthItems.value,
    );
    mainBrowserWindowHeightVal.value = sebSettingsStore.getStringValue(
        "mainBrowserWindowHeight",
    );
    sebSettingsStore.applyAttributes(
        "mainBrowserWindowHeight",
        mainBrowserWindowHeightItems.value,
    );
    mainBrowserWindowPositioningVal.value = sebSettingsStore.getStringValue(
        "mainBrowserWindowPositioning",
    );
    sebSettingsStore.applyAttributes(
        "mainBrowserWindowPositioning",
        mainBrowserWindowPositioningItems.value,
    );
    enableBrowserWindowToolbarVal.value = sebSettingsStore.getBooleanValue(
        "enableBrowserWindowToolbar",
    );
    browserWindowAllowAddressBarVal.value = sebSettingsStore.getBooleanValue(
        "browserWindowAllowAddressBar",
    );
    newBrowserWindowAllowAddressBarVal.value = sebSettingsStore.getBooleanValue(
        "newBrowserWindowAllowAddressBar",
    );
    allowDeveloperConsoleVal.value = sebSettingsStore.getBooleanValue(
        "allowDeveloperConsole",
    );
    hideBrowserWindowToolbarVal.value = sebSettingsStore.getBooleanValue(
        "hideBrowserWindowToolbar",
    );
    showMenuBarVal.value = sebSettingsStore.getBooleanValue("showMenuBar");
    showTaskBarVal.value = sebSettingsStore.getBooleanValue("showTaskBar");
    showSideMenuVal.value = sebSettingsStore.getBooleanValue("showSideMenu");
    raiseHandButtonShowVal.value = sebSettingsStore.getBooleanValue(
        "raiseHandButtonShow",
    );
    raiseHandButtonAlwaysPromptMessageVal.value =
        sebSettingsStore.getBooleanValue("raiseHandButtonAlwaysPromptMessage");
    allowWlanVal.value = sebSettingsStore.getBooleanValue("allowWlan");
    showReloadButtonVal.value =
        sebSettingsStore.getBooleanValue("showReloadButton");
    showTimeVal.value = sebSettingsStore.getBooleanValue("showTime");
    showInputLanguageVal.value = stringToBoolean("showInputLanguage");

    enableZoomPageVal.value =
        sebSettingsStore.getBooleanValue("enableZoomPage");
    enableZoomTextVal.value =
        sebSettingsStore.getBooleanValue("enableZoomText");

    audioControlEnabledVal.value = sebSettingsStore.getBooleanValue(
        "audioControlEnabled",
    );
    audioMuteVal.value = sebSettingsStore.getBooleanValue("audioMute");
    audioSetVolumeLevelVal.value = sebSettingsStore.getBooleanValue(
        "audioSetVolumeLevel",
    );
    audioVolumeLevelVal.value =
        sebSettingsStore.getNumberValue("audioVolumeLevel");

    allowSpellCheckVal.value =
        sebSettingsStore.getBooleanValue("allowSpellCheck");
    allowDictionaryLookupVal.value = sebSettingsStore.getBooleanValue(
        "allowDictionaryLookup",
    );
    lockScreenBackgroundColorVal.value = sebSettingsStore.getStringValue(
        "lockScreenBackgroundColor",
    );
});

async function saveBrowserViewMode(value: string) {
    await sebSettingsStore.saveSingleValue("browserViewMode", value);
    await sebSettingsStore.saveSingleValue(
        "touchOptimized",
        value === "2" ? "true" : "false",
    );
}
</script>
