<template>
    <LoadingFallbackComponent
        :loading="loadingSebSettingsView"
        :errors="errorSebSettingsView"
    >
        <v-col v-if="singleValues">
            <v-row>
                <PasswordSetting
                    v-model="singleValues"
                    name="hashedAdminPassword"
                    label="sebSettings.generalView.adminPassword"
                    confirm-label="sebSettings.generalView.confirmAdminPassword"
                    tooltip="sebSettings.generalView.adminPassword_tooltip"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="allowQuit"
                    label="sebSettings.generalView.allowQuit"
                    :tooltip="true"
                />
            </v-row>
            <v-row>
                <PasswordSetting
                    v-model="singleValues"
                    name="hashedQuitPassword"
                    label="sebSettings.generalView.quitPassword"
                    confirm-label="sebSettings.generalView.confirmQuitPassword"
                    tooltip="sebSettings.generalView.quitPassword_tooltip"
                />
            </v-row>
        </v-col>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
// import { ref, onBeforeMount } from "vue";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import CheckboxSetting from "./components/CheckboxSetting.vue";
import PasswordSetting from "./components/PasswordSetting.vue";
import { useSEBSettingValues } from "./composables/useSEBSettingValues";

const sebSettingsStore = useSEBSettingsStore();

const { singleValues, loadingSebSettingsView, errorSebSettingsView } =
    useSEBSettingValues(
        false,
        sebSettingsStore.selectedContainerId !== null
            ? sebSettingsStore.selectedContainerId.toString()
            : "",
        ViewType.GENERAL,
    );
</script>
