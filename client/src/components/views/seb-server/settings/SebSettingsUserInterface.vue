<template>
    <v-row>
        <v-col class="text-subtitle-1">
            <v-row>
                <v-col
                    >{{ translate("sebSettings.userView.view_mode.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="2"
                    ></v-divider
                ></v-col>
            </v-row>

            <v-row>
                <v-col>
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
                <v-col
                    >{{ translate("sebSettings.userView.main_browser.title") }}
                    <v-divider
                        class="border-opacity-25"
                        :thickness="2"
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
                            saveSingleValue(
                                mainBrowserWindowWidth.id,
                                mainBrowserWindowWidthVal,
                            )
                        "
                    >
                    </v-select>
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
                            saveSingleValue(
                                mainBrowserWindowHeight.id,
                                mainBrowserWindowHeightVal,
                            )
                        "
                    >
                    </v-select>
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
                            saveSingleValue(
                                mainBrowserWindowPositioning.id,
                                mainBrowserWindowPositioningVal,
                            )
                        "
                    >
                    </v-select>
                </v-col>
            </v-row>

            <v-row>
                <v-col
                    >{{ translate("sebSettings.userView.browser_window.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="2"
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
                            saveSingleValue(
                                enableBrowserWindowToolbar.id,
                                enableBrowserWindowToolbarVal
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
                            saveSingleValue(
                                browserWindowAllowAddressBar.id,
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
                            saveSingleValue(
                                newBrowserWindowAllowAddressBar.id,
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
                            saveSingleValue(
                                allowDeveloperConsole.id,
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
                            saveSingleValue(
                                hideBrowserWindowToolbar.id,
                                hideBrowserWindowToolbarVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
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
                            saveSingleValue(
                                showMenuBar.id,
                                showMenuBarVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>

            <v-row>
                <v-col
                    >{{ translate("sebSettings.userView.task_bar.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="2"
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
                            saveSingleValue(
                                showTaskBar.id,
                                showTaskBarVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
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
                            saveSingleValue(
                                showSideMenu.id,
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
                            saveSingleValue(
                                raiseHandButtonShow.id,
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
                            saveSingleValue(
                                raiseHandButtonAlwaysPromptMessage.id,
                                raiseHandButtonAlwaysPromptMessageVal
                                    ? 'true'
                                    : 'false',
                            )
                        "
                    ></v-checkbox-btn>
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
                            saveSingleValue(
                                allowWlan.id,
                                allowWlanVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
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
                            saveSingleValue(
                                showReloadButton.id,
                                showReloadButtonVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
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
                            saveSingleValue(
                                showTime.id,
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
                            saveSingleValue(
                                showInputLanguage.id,
                                showInputLanguageVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>

            <v-row>
                <v-col
                    >{{ translate("sebSettings.userView.zoom.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="2"
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
                            saveSingleValue(
                                enableZoomPage.id,
                                enableZoomPageVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
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
                            saveSingleValue(
                                enableZoomText.id,
                                enableZoomTextVal ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
        </v-col>

        <v-col class="text-subtitle-1">
            <v-row>
                <v-col
                    >{{ translate("sebSettings.userView.audio")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="2"
                    ></v-divider
                ></v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import * as sebSettingsService from "@/services/seb-server/component-services/sebSettingsService";
import { useI18n } from "vue-i18n";
import { stringToBoolean, translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import { ref, onBeforeMount } from "vue";

const i18n = useI18n();
const sebSettingsStore = useSEBSettingsStore();

// 0 and 1 is browserViewMode and 2 is touchOptimized=true / browserViewMode=null
const browserViewModeVal = ref<string>("0");
const touchOptimizedVal = ref<boolean>(false);

const mainBrowserWindowWidthVal = ref<string>("100%");
const mainBrowserWindowWidthItems = ref<any[]>([]);
const mainBrowserWindowHeightVal = ref<string>("100%");
const mainBrowserWindowHeightItems = ref<any[]>([]);
const mainBrowserWindowPositioningVal = ref<string>("Center");
const mainBrowserWindowPositioningItems = ref<any[]>([]);

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

// the parent component identifier
let componentId: string;

let browserViewMode: SEBSettingsValue;
let touchOptimized: SEBSettingsValue;

let mainBrowserWindowWidth: SEBSettingsValue;
let mainBrowserWindowHeight: SEBSettingsValue;
let mainBrowserWindowPositioning: SEBSettingsValue;

let enableBrowserWindowToolbar: SEBSettingsValue;
let browserWindowAllowAddressBar: SEBSettingsValue;
let newBrowserWindowAllowAddressBar: SEBSettingsValue;
let allowDeveloperConsole: SEBSettingsValue;
let hideBrowserWindowToolbar: SEBSettingsValue;
let showMenuBar: SEBSettingsValue;

let showTaskBar: SEBSettingsValue;
let showSideMenu: SEBSettingsValue;
let raiseHandButtonShow: SEBSettingsValue;
let raiseHandButtonAlwaysPromptMessage: SEBSettingsValue;
let allowWlan: SEBSettingsValue;
let showReloadButton: SEBSettingsValue;
let showTime: SEBSettingsValue;
let showInputLanguage: SEBSettingsValue;

let enableZoomPage: SEBSettingsValue;
let enableZoomText: SEBSettingsValue;

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
    const attributes: Map<string, SEBSettingAttribute> = new Map<
        string,
        SEBSettingAttribute
    >(Object.entries(userSettings.attributes));

    browserViewMode = singleValues.get("browserViewMode")!;
    browserViewModeVal.value = browserViewMode.value;

    touchOptimized = singleValues.get("touchOptimized")!;
    touchOptimizedVal.value = stringToBoolean(touchOptimized.value);

    mainBrowserWindowWidth = singleValues.get("mainBrowserWindowWidth")!;
    mainBrowserWindowWidthVal.value = mainBrowserWindowWidth.value;
    attributes
        .get("mainBrowserWindowWidth")
        ?.resources?.split(",")
        .forEach((item) => {
            mainBrowserWindowWidthItems.value.push({
                title: item,
                value: item,
            });
        });
    mainBrowserWindowHeight = singleValues.get("mainBrowserWindowHeight")!;
    mainBrowserWindowHeightVal.value = mainBrowserWindowHeight.value;
    attributes
        .get("mainBrowserWindowHeight")
        ?.resources?.split(",")
        .forEach((item) => {
            mainBrowserWindowHeightItems.value.push({
                title: item,
                value: item,
            });
        });
    mainBrowserWindowPositioning = singleValues.get(
        "mainBrowserWindowPositioning",
    )!;
    mainBrowserWindowPositioningVal.value = mainBrowserWindowPositioning.value;
    attributes
        .get("mainBrowserWindowPositioning")
        ?.resources?.split(",")
        .forEach((item) => {
            mainBrowserWindowPositioningItems.value.push({
                title: translate(
                    "sebSettings.userView.main_browser.pos_" + item,
                    i18n,
                ),
                value: item,
            });
        });

    enableBrowserWindowToolbar = singleValues.get(
        "enableBrowserWindowToolbar",
    )!;
    enableBrowserWindowToolbarVal.value = stringToBoolean(
        enableBrowserWindowToolbar.value,
    );
    browserWindowAllowAddressBar = singleValues.get(
        "browserWindowAllowAddressBar",
    )!;
    browserWindowAllowAddressBarVal.value = stringToBoolean(
        browserWindowAllowAddressBar.value,
    );
    newBrowserWindowAllowAddressBar = singleValues.get(
        "newBrowserWindowAllowAddressBar",
    )!;
    newBrowserWindowAllowAddressBarVal.value = stringToBoolean(
        newBrowserWindowAllowAddressBar.value,
    );
    allowDeveloperConsole = singleValues.get("allowDeveloperConsole")!;
    allowDeveloperConsoleVal.value = stringToBoolean(
        allowDeveloperConsole.value,
    );
    hideBrowserWindowToolbar = singleValues.get("hideBrowserWindowToolbar")!;
    hideBrowserWindowToolbarVal.value = stringToBoolean(
        hideBrowserWindowToolbar.value,
    );
    showMenuBar = singleValues.get("showMenuBar")!;
    showMenuBarVal.value = stringToBoolean(showMenuBar.value);

    showTaskBar = singleValues.get("showTaskBar")!;
    showTaskBarVal.value = stringToBoolean(showTaskBar.value);
    showSideMenu = singleValues.get("showSideMenu")!;
    showSideMenuVal.value = stringToBoolean(showSideMenu.value);
    raiseHandButtonShow = singleValues.get("raiseHandButtonShow")!;
    raiseHandButtonShowVal.value = stringToBoolean(raiseHandButtonShow.value);
    raiseHandButtonAlwaysPromptMessage = singleValues.get(
        "raiseHandButtonAlwaysPromptMessage",
    )!;
    raiseHandButtonAlwaysPromptMessageVal.value = stringToBoolean(
        raiseHandButtonAlwaysPromptMessage.value,
    );
    allowWlan = singleValues.get("allowWlan")!;
    allowWlanVal.value = stringToBoolean(allowWlan.value);
    showReloadButton = singleValues.get("showReloadButton")!;
    showReloadButtonVal.value = stringToBoolean(showReloadButton.value);
    showTime = singleValues.get("showTime")!;
    showTimeVal.value = stringToBoolean(showTime.value);
    showInputLanguage = singleValues.get("showInputLanguage")!;
    showInputLanguageVal.value = stringToBoolean(showInputLanguage.value);

    enableZoomPage = singleValues.get("enableZoomPage")!;
    enableZoomPageVal.value = stringToBoolean(enableZoomPage.value);
    enableZoomText = singleValues.get("enableZoomText")!;
    enableZoomTextVal.value = stringToBoolean(enableZoomText.value);
});

async function saveBrowserViewMode(value: string) {
    await saveSingleValue(browserViewMode.id, value);
    await saveSingleValue(touchOptimized.id, value === "2" ? "true" : "false");
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
