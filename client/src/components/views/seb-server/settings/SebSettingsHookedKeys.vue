<template>
    <v-row>
        <v-col class="text-subtitle-1">
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.hotKeys.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
                <v-tooltip
                    activator="parent"
                    location="top left"
                    max-width="400"
                >
                    {{ translate("sebSettings.hotKeys.title_tooltip") }}
                </v-tooltip>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableEsc"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableEsc')"
                        @update:model-value="
                            saveSingleValue(
                                'enableEsc',
                                enableEsc ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableCtrlEsc"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableCtrlEsc')"
                        @update:model-value="
                            saveSingleValue(
                                'enableCtrlEsc',
                                enableCtrlEsc ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableAltEsc"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableAltEsc')"
                        @update:model-value="
                            saveSingleValue(
                                'enableAltEsc',
                                enableAltEsc ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableAltTab"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableAltTab')"
                        @update:model-value="
                            saveSingleValue(
                                'enableAltTab',
                                enableAltTab ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableAltF4"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableAltF4')"
                        @update:model-value="
                            saveSingleValue(
                                'enableAltF4',
                                enableAltF4 ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableStartMenu"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate('sebSettings.hotKeys.enableStartMenu')
                        "
                        @update:model-value="
                            saveSingleValue(
                                'enableStartMenu',
                                enableStartMenu ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableRightMouse"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate('sebSettings.hotKeys.enableRightMouse')
                        "
                        @update:model-value="
                            saveSingleValue(
                                'enableRightMouse',
                                enableRightMouse ? 'true' : 'false',
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
                                "sebSettings.hotKeys.enableRightMouse_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableAltMouseWheel"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="
                            translate('sebSettings.hotKeys.enableAltMouseWheel')
                        "
                        @update:model-value="
                            saveSingleValue(
                                'enableAltMouseWheel',
                                enableAltMouseWheel ? 'true' : 'false',
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
                                "sebSettings.hotKeys.enableAltMouseWheel_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableF1"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableF1')"
                        @update:model-value="
                            saveSingleValue(
                                'enableF1',
                                enableF1 ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableF2"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableF2')"
                        @update:model-value="
                            saveSingleValue(
                                'enableF2',
                                enableF2 ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableF3"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableF3')"
                        @update:model-value="
                            saveSingleValue(
                                'enableF3',
                                enableF3 ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableF4"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableF4')"
                        @update:model-value="
                            saveSingleValue(
                                'enableF4',
                                enableF4 ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableF5"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableF5')"
                        @update:model-value="
                            saveSingleValue(
                                'enableF5',
                                enableF5 ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableF6"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableF6')"
                        @update:model-value="
                            saveSingleValue(
                                'enableF6',
                                enableF6 ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableF7"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableF7')"
                        @update:model-value="
                            saveSingleValue(
                                'enableF7',
                                enableF7 ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableF8"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableF8')"
                        @update:model-value="
                            saveSingleValue(
                                'enableF8',
                                enableF8 ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableF9"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableF9')"
                        @update:model-value="
                            saveSingleValue(
                                'enableF9',
                                enableF9 ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableF10"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableF10')"
                        @update:model-value="
                            saveSingleValue(
                                'enableF10',
                                enableF10 ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableF11"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableF11')"
                        @update:model-value="
                            saveSingleValue(
                                'enableF11',
                                enableF11 ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableF12"
                        :disabled="sebSettingsStore.readonly"
                        hide-details
                        :label="translate('sebSettings.hotKeys.enableF12')"
                        @update:model-value="
                            saveSingleValue(
                                'enableF12',
                                enableF12 ? 'true' : 'false',
                            )
                        "
                    ></v-checkbox-btn>
                </v-col>
            </v-row>
        </v-col>

        <v-col class="text-subtitle-1"> </v-col>
    </v-row>
</template>

<script setup lang="ts">
import * as sebSettingsService from "@/services/seb-server/component-services/sebSettingsService";
import { stringToBoolean, translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import { ref, onBeforeMount } from "vue";
import {
    SEBSettingsValue,
    SEBSettingsView,
} from "@/models/seb-server/sebSettings";

const sebSettingsStore = useSEBSettingsStore();

// settings
const enableEsc = ref<boolean>(false);
const enableCtrlEsc = ref<boolean>(false);
const enableAltEsc = ref<boolean>(false);
const enableAltTab = ref<boolean>(false);
const enableAltF4 = ref<boolean>(false);
const enableStartMenu = ref<boolean>(false);
const enableRightMouse = ref<boolean>(false);
const enableAltMouseWheel = ref<boolean>(false);
const enableF1 = ref<boolean>(false);
const enableF2 = ref<boolean>(false);
const enableF3 = ref<boolean>(false);
const enableF4 = ref<boolean>(false);
const enableF5 = ref<boolean>(false);
const enableF6 = ref<boolean>(false);
const enableF7 = ref<boolean>(false);
const enableF8 = ref<boolean>(false);
const enableF9 = ref<boolean>(false);
const enableF10 = ref<boolean>(false);
const enableF11 = ref<boolean>(false);
const enableF12 = ref<boolean>(false);

// the parent component identifier
let componentId: string;
let singleValues: Map<string, SEBSettingsValue>;

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    componentId = sebSettingsStore.selectedContainerId.toString();

    const hotKeySettings: SEBSettingsView | null =
        await sebSettingsService.getViewSettings(
            ViewType.HOOKED_KEYS,
            componentId,
        );
    if (hotKeySettings == null) {
        return;
    }

    singleValues = new Map<string, SEBSettingsValue>(
        Object.entries(hotKeySettings.singleValues),
    );

    enableEsc.value = stringToBoolean(getSingleValue("enableEsc").value);
    enableCtrlEsc.value = stringToBoolean(
        getSingleValue("enableCtrlEsc").value,
    );
    enableAltEsc.value = stringToBoolean(getSingleValue("enableAltEsc").value);
    enableAltTab.value = stringToBoolean(getSingleValue("enableAltTab").value);
    enableAltF4.value = stringToBoolean(getSingleValue("enableAltF4").value);
    enableStartMenu.value = stringToBoolean(
        getSingleValue("enableStartMenu").value,
    );
    enableRightMouse.value = stringToBoolean(
        getSingleValue("enableRightMouse").value,
    );
    enableAltMouseWheel.value = stringToBoolean(
        getSingleValue("enableAltMouseWheel").value,
    );
    enableF1.value = stringToBoolean(getSingleValue("enableF1").value);
    enableF2.value = stringToBoolean(getSingleValue("enableF2").value);
    enableF3.value = stringToBoolean(getSingleValue("enableF3").value);
    enableF4.value = stringToBoolean(getSingleValue("enableF4").value);
    enableF5.value = stringToBoolean(getSingleValue("enableF5").value);
    enableF6.value = stringToBoolean(getSingleValue("enableF6").value);
    enableF7.value = stringToBoolean(getSingleValue("enableF7").value);
    enableF8.value = stringToBoolean(getSingleValue("enableF8").value);
    enableF9.value = stringToBoolean(getSingleValue("enableF9").value);
    enableF10.value = stringToBoolean(getSingleValue("enableF10").value);
    enableF11.value = stringToBoolean(getSingleValue("enableF11").value);
    enableF12.value = stringToBoolean(getSingleValue("enableF12").value);
});

async function saveSingleValue(name: string, value: string) {
    const setting: SEBSettingsValue = getSingleValue(name);
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        setting.id.toString(),
        value,
    );
}

function getSingleValue(name: string): SEBSettingsValue {
    const value = singleValues.get(name);
    if (!value) {
        throw new Error("No Single Value " + name + " found");
    }

    return value;
}
</script>
