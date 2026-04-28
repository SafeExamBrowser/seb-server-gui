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
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import CheckboxSetting from "./components/inputFields/CheckboxSetting.vue";
import PasswordSetting from "./components/inputFields/PasswordSetting.vue";
import { useSEBSettingValues } from "./composables/useSEBSettingValues";
import { SEBSettingsContext } from "./types";

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
