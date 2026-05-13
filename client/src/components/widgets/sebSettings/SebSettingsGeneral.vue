<template>
    <LoadingFallbackComponent
        :loading="loadingSebSettingsView"
        :errors="errorSebSettingsView"
    >
        <v-row v-if="singleValues">
            <v-col>
                <SettingsTitle
                    label="sebSettings.generalView.title"
                    :tooltip="false"
                />
                <v-row>
                    <PasswordSetting
                        v-model="singleValues"
                        name="hashedAdminPassword"
                        label="sebSettings.generalView.adminPassword"
                        confirm-label="sebSettings.generalView.confirmAdminPassword"
                        tooltip="sebSettings.generalView.adminPassword_tooltip"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowQuit"
                        label="sebSettings.generalView.allowQuit"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <PasswordSetting
                        v-model="singleValues"
                        name="hashedQuitPassword"
                        label="sebSettings.generalView.quitPassword"
                        confirm-label="sebSettings.generalView.confirmQuitPassword"
                        tooltip="sebSettings.generalView.quitPassword_tooltip"
                        :disabled="context.readonly"
                    />
                </v-row>
            </v-col>

            <v-col>
                <SettingsTitle
                    label="sebSettings.generalView.configuration.title"
                    :tooltip="false"
                />
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="allowPreferencesWindow"
                        label="sebSettings.generalView.configuration.allowPreferencesWindow"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="mobileAllowQRCodeConfig"
                        label="sebSettings.generalView.configuration.mobileAllowQRCodeConfig"
                        :tooltip="true"
                        :disabled="context.readonly"
                    />
                </v-row>
                <v-row>
                    <CheckboxSetting
                        v-model="singleValues"
                        name="mobileShowSettings"
                        label="sebSettings.generalView.configuration.mobileShowSettings"
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
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import CheckboxSetting from "./components/inputFields/CheckboxSetting.vue";
import PasswordSetting from "./components/inputFields/PasswordSetting.vue";
import { useSEBSettingValues } from "./composables/useSEBSettingValues.ts";
import { SEBSettingsContext } from "./types.ts";
import SettingsTitle from "./components/SettingsTitle.vue";

const props = defineProps<{
    context: SEBSettingsContext;
}>();

const { singleValues, loadingSebSettingsView, errorSebSettingsView } =
    useSEBSettingValues(
        props.context.isExam,
        props.context.containerId,
        ViewType.GENERAL,
    );
</script>
