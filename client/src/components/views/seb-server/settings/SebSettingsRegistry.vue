<template>
    <v-row>
        <v-col class="text-subtitle-1">
            <v-row>
                <v-col class="font-weight-bold pt-8 pb-0"
                    >{{ translate("sebSettings.registry.title")
                    }}<v-divider
                        class="border-opacity-25"
                        :thickness="5"
                    ></v-divider
                ></v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="insideSebEnableSwitchUser"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.registry.insideSebEnableSwitchUser',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'insideSebEnableSwitchUser',
                                insideSebEnableSwitchUser ? 'true' : 'false',
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
                                "sebSettings.registry.insideSebEnableSwitchUser_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="insideSebEnableLockThisComputer"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.registry.insideSebEnableLockThisComputer',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'insideSebEnableLockThisComputer',
                                insideSebEnableLockThisComputer
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
                                "sebSettings.registry.insideSebEnableLockThisComputer_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="insideSebEnableChangeAPassword"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.registry.insideSebEnableChangeAPassword',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'insideSebEnableChangeAPassword',
                                insideSebEnableChangeAPassword
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
                                "sebSettings.registry.insideSebEnableChangeAPassword_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="insideSebEnableStartTaskManager"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.registry.insideSebEnableStartTaskManager',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'insideSebEnableStartTaskManager',
                                insideSebEnableStartTaskManager
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
                                "sebSettings.registry.insideSebEnableStartTaskManager_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="insideSebEnableLogOff"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.registry.insideSebEnableLogOff',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'insideSebEnableLogOff',
                                insideSebEnableLogOff ? 'true' : 'false',
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
                                "sebSettings.registry.insideSebEnableLogOff_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="insideSebEnableShutDown"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.registry.insideSebEnableShutDown',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'insideSebEnableShutDown',
                                insideSebEnableShutDown ? 'true' : 'false',
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
                                "sebSettings.registry.insideSebEnableShutDown_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="insideSebEnableVmWareClientShade"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.registry.insideSebEnableVmWareClientShade',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'insideSebEnableVmWareClientShade',
                                insideSebEnableVmWareClientShade
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
                                "sebSettings.registry.insideSebEnableVmWareClientShade_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="insideSebEnableEaseOfAccess"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.registry.insideSebEnableEaseOfAccess',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'insideSebEnableEaseOfAccess',
                                insideSebEnableEaseOfAccess ? 'true' : 'false',
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
                                "sebSettings.registry.insideSebEnableEaseOfAccess_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="insideSebEnableEaseOfAccess"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.registry.insideSebEnableEaseOfAccess',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'insideSebEnableEaseOfAccess',
                                insideSebEnableEaseOfAccess ? 'true' : 'false',
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
                                "sebSettings.registry.insideSebEnableEaseOfAccess_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="insideSebEnableNetworkConnectionSelector"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.registry.insideSebEnableNetworkConnectionSelector',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'insideSebEnableNetworkConnectionSelector',
                                insideSebEnableNetworkConnectionSelector
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
                                "sebSettings.registry.insideSebEnableNetworkConnectionSelector_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="setVmwareConfiguration"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate(
                                'sebSettings.registry.setVmwareConfiguration',
                            )
                        "
                        @update:model-value="
                            saveSingleValue(
                                'setVmwareConfiguration',
                                setVmwareConfiguration ? 'true' : 'false',
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
                                "sebSettings.registry.setVmwareConfiguration_tooltip",
                            )
                        }}
                    </v-tooltip>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pt-0 pb-0 pl-0">
                    <v-checkbox-btn
                        v-model="enableFindPrinter"
                        :disabled="
                            sebSettingsStore.readonly ||
                            !sebSettingsStore.ignoreSEBService
                        "
                        hide-details
                        :label="
                            translate('sebSettings.registry.enableFindPrinter')
                        "
                        @update:model-value="
                            saveSingleValue(
                                'enableFindPrinter',
                                enableFindPrinter ? 'true' : 'false',
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
const insideSebEnableSwitchUser = ref<boolean>(false);
const insideSebEnableLockThisComputer = ref<boolean>(false);
const insideSebEnableChangeAPassword = ref<boolean>(false);
const insideSebEnableStartTaskManager = ref<boolean>(false);
const insideSebEnableLogOff = ref<boolean>(false);
const insideSebEnableShutDown = ref<boolean>(false);
const insideSebEnableVmWareClientShade = ref<boolean>(false);
const insideSebEnableEaseOfAccess = ref<boolean>(false);
const insideSebEnableNetworkConnectionSelector = ref<boolean>(false);
const setVmwareConfiguration = ref<boolean>(false);
const enableFindPrinter = ref<boolean>(false);

// the parent component identifier
let componentId: string;
let singleValues: Map<string, SEBSettingsValue>;

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    componentId = sebSettingsStore.selectedContainerId.toString();

    const registrySettings: SEBSettingsView | null =
        await sebSettingsService.getViewSettings(
            ViewType.REGISTRY,
            componentId,
            sebSettingsStore.isExam,
        );
    if (registrySettings == null) {
        return;
    }

    singleValues = new Map<string, SEBSettingsValue>(
        Object.entries(registrySettings.singleValues),
    );

    insideSebEnableSwitchUser.value = stringToBoolean(
        getSingleValue("insideSebEnableSwitchUser").value,
    );
    insideSebEnableLockThisComputer.value = stringToBoolean(
        getSingleValue("insideSebEnableLockThisComputer").value,
    );
    insideSebEnableChangeAPassword.value = stringToBoolean(
        getSingleValue("insideSebEnableChangeAPassword").value,
    );
    insideSebEnableStartTaskManager.value = stringToBoolean(
        getSingleValue("insideSebEnableStartTaskManager").value,
    );
    insideSebEnableLogOff.value = stringToBoolean(
        getSingleValue("insideSebEnableLogOff").value,
    );
    insideSebEnableShutDown.value = stringToBoolean(
        getSingleValue("insideSebEnableShutDown").value,
    );
    insideSebEnableVmWareClientShade.value = stringToBoolean(
        getSingleValue("insideSebEnableVmWareClientShade").value,
    );
    insideSebEnableEaseOfAccess.value = stringToBoolean(
        getSingleValue("insideSebEnableEaseOfAccess").value,
    );
    insideSebEnableNetworkConnectionSelector.value = stringToBoolean(
        getSingleValue("insideSebEnableNetworkConnectionSelector").value,
    );
    setVmwareConfiguration.value = stringToBoolean(
        getSingleValue("setVmwareConfiguration").value,
    );
    enableFindPrinter.value = stringToBoolean(
        getSingleValue("enableFindPrinter").value,
    );
});

async function saveSingleValue(name: string, value: string) {
    const setting: SEBSettingsValue = getSingleValue(name);
    await sebSettingsService.updateSEBSettingValue(
        componentId,
        setting.id.toString(),
        value,
        sebSettingsStore.isExam,
    );
}

function getSingleValue(name: string): SEBSettingsValue {
    const value = singleValues.get(name);
    if (!value) {
        throw new Error("No Single Value" + name + " found");
    }

    return value;
}
</script>
