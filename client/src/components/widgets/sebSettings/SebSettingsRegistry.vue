<template>
    <LoadingFallbackComponent
        :loading="loadingSebSettingsView"
        :errors="errorSebSettingsView"
    >
        <v-col v-if="singleValues">
            <SettingsTitle
                label="sebSettings.registry.title"
                :tooltip="false"
            />
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="insideSebEnableSwitchUser"
                    label="sebSettings.registry.insideSebEnableSwitchUser"
                    :tooltip="true"
                    :disabled="context.readonly || !ignoreSEBService"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="insideSebEnableLockThisComputer"
                    label="sebSettings.registry.insideSebEnableLockThisComputer"
                    :tooltip="true"
                    :disabled="context.readonly || !ignoreSEBService"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="insideSebEnableChangeAPassword"
                    label="sebSettings.registry.insideSebEnableChangeAPassword"
                    :tooltip="true"
                    :disabled="context.readonly || !ignoreSEBService"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="insideSebEnableStartTaskManager"
                    label="sebSettings.registry.insideSebEnableStartTaskManager"
                    :tooltip="true"
                    :disabled="context.readonly || !ignoreSEBService"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="insideSebEnableLogOff"
                    label="sebSettings.registry.insideSebEnableLogOff"
                    :tooltip="true"
                    :disabled="context.readonly || !ignoreSEBService"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="insideSebEnableShutDown"
                    label="sebSettings.registry.insideSebEnableShutDown"
                    :tooltip="true"
                    :disabled="context.readonly || !ignoreSEBService"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="insideSebEnableVmWareClientShade"
                    label="sebSettings.registry.insideSebEnableVmWareClientShade"
                    :tooltip="true"
                    :disabled="context.readonly || !ignoreSEBService"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="insideSebEnableEaseOfAccess"
                    label="sebSettings.registry.insideSebEnableEaseOfAccess"
                    :tooltip="true"
                    :disabled="context.readonly || !ignoreSEBService"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="insideSebEnableEaseOfAccess"
                    label="sebSettings.registry.insideSebEnableEaseOfAccess"
                    :tooltip="true"
                    :disabled="context.readonly || !ignoreSEBService"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="insideSebEnableNetworkConnectionSelector"
                    label="sebSettings.registry.insideSebEnableNetworkConnectionSelector"
                    :tooltip="true"
                    :disabled="context.readonly || !ignoreSEBService"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="setVmwareConfiguration"
                    label="sebSettings.registry.setVmwareConfiguration"
                    :tooltip="true"
                    :disabled="context.readonly || !ignoreSEBService"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="enableFindPrinter"
                    label="sebSettings.registry.enableFindPrinter"
                    :tooltip="false"
                    :disabled="context.readonly || !ignoreSEBService"
                />
            </v-row>
        </v-col>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { ViewType } from "@/models/seb-server/sebSettingsEnums.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import CheckboxSetting from "./components/inputFields/CheckboxSetting.vue";
import SettingsTitle from "./components/SettingsTitle.vue";
import {
    useSEBSettingValues,
    ignoreSEBService,
} from "./composables/useSEBSettingValues.ts";
import { SEBSettingsContext } from "./types.ts";

const props = defineProps<{
    context: SEBSettingsContext;
}>();

const { singleValues, loadingSebSettingsView, errorSebSettingsView } =
    useSEBSettingValues(
        props.context.isExam,
        props.context.containerId,
        ViewType.REGISTRY,
    );
</script>
