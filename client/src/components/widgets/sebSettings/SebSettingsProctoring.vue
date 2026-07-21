<template>
    <LoadingFallbackComponent
        :loading="loadingSebSettingsView"
        :errors="errorSebSettingsView"
    >
        <v-col v-if="singleValues" class="text-body-large">
            <SettingsTitle
                label="sebSettings.proctoring.screenProctoring.title"
                :tooltip="false"
            />
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="enableScreenProctoring"
                    label="sebSettings.proctoring.screenProctoring.enableScreenProctoring"
                    :tooltip="true"
                    :disabled="context.readonly"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="showProctoringDisclaimer"
                    label="sebSettings.proctoring.screenProctoring.showProctoringDisclaimer"
                    :tooltip="true"
                    :disabled="context.readonly"
                />
            </v-row>
            <v-row>
                <NumberSetting
                    v-model="singleValues"
                    name="screenProctoringScreenshotMinInterval"
                    label="sebSettings.proctoring.screenProctoring.screenProctoringScreenshotMinInterval"
                    :show-label="true"
                    :tooltip="true"
                    :disabled="context.readonly"
                    :min="500"
                />
            </v-row>
            <v-row>
                <NumberSetting
                    v-model="singleValues"
                    name="screenProctoringScreenshotMaxInterval"
                    label="sebSettings.proctoring.screenProctoring.screenProctoringScreenshotMaxInterval"
                    :show-label="true"
                    :tooltip="true"
                    :disabled="context.readonly"
                    :min="500"
                />
            </v-row>
            <v-row>
                <SelectionSetting
                    v-model="singleValues"
                    name="screenProctoringImageFormat"
                    label="sebSettings.proctoring.screenProctoring.screenProctoringImageFormat"
                    :tooltip="false"
                    :labels="true"
                    :disabled="context.readonly"
                />
            </v-row>
            <v-row>
                <SelectionSetting
                    v-model="singleValues"
                    name="screenProctoringImageQuantization"
                    label="sebSettings.proctoring.screenProctoring.screenProctoringImageQuantization"
                    :tooltip="true"
                    :labels="true"
                    :disabled="context.readonly"
                />
            </v-row>
            <v-row>
                <SelectionSetting
                    v-model="singleValues"
                    name="screenProctoringImageDownscale"
                    label="sebSettings.proctoring.screenProctoring.screenProctoringImageDownscale"
                    :tooltip="true"
                    :disabled="context.readonly"
                />
            </v-row>
            <v-row>
                <NumberSetting
                    v-model="singleValues"
                    name="screenProctoringCacheSize"
                    label="sebSettings.proctoring.screenProctoring.screenProctoringCacheSize"
                    :show-label="true"
                    :tooltip="true"
                    :disabled="context.readonly"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="screenProctoringIndicateHealthAndCaching"
                    label="sebSettings.proctoring.screenProctoring.screenProctoringIndicateHealthAndCaching"
                    :tooltip="true"
                    :disabled="context.readonly"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="screenProctoringMetadataURLEnabled"
                    label="sebSettings.proctoring.screenProctoring.screenProctoringMetadataURLEnabled"
                    :tooltip="true"
                    :disabled="context.readonly"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="screenProctoringMetadataWindowTitleEnabled"
                    label="sebSettings.proctoring.screenProctoring.screenProctoringMetadataWindowTitleEnabled"
                    :tooltip="true"
                    :disabled="context.readonly"
                />
            </v-row>
            <v-row>
                <CheckboxSetting
                    v-model="singleValues"
                    name="screenProctoringMetadataActiveAppEnabled"
                    label="sebSettings.proctoring.screenProctoring.screenProctoringMetadataActiveAppEnabled"
                    :tooltip="true"
                    :disabled="context.readonly"
                />
            </v-row>
        </v-col>
    </LoadingFallbackComponent>
</template>

<script setup lang="ts">
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { ViewType } from "@/models/seb-server/sebSettingsEnums.ts";

import CheckboxSetting from "./components/inputFields/CheckboxSetting.vue";
import NumberSetting from "./components/inputFields/NumberSetting.vue";
import SelectionSetting from "./components/inputFields/SelectionSetting.vue";
import SettingsTitle from "./components/SettingsTitle.vue";
import { useSEBSettingValues } from "./composables/useSEBSettingValues.ts";
import { SEBSettingsContext } from "./types.ts";

const props = defineProps<{
    context: SEBSettingsContext;
}>();

const { singleValues, loadingSebSettingsView, errorSebSettingsView } =
    useSEBSettingValues(
        props.context.isExam,
        props.context.containerId,
        ViewType.PROCTORING,
    );
</script>
