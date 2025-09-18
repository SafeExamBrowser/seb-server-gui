<template>
    <v-row> PROCTORING Settings TODO </v-row>
</template>

<script setup lang="ts">
import * as sebSettingsService from "@/services/seb-server/component-services/sebSettingsService";
import { useI18n } from "vue-i18n";
import { stringToBoolean, translate } from "@/utils/generalUtils";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";

const i18n = useI18n();
const sebSettingsStore = useSEBSettingsStore();

// the parent component identifier
let componentId: string;

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    componentId = sebSettingsStore.selectedContainerId.toString();

    const proctoringSettings: SEBSettingsView | null =
        await sebSettingsService.getViewSettings(
            ViewType.PROCTORING,
            componentId,
            sebSettingsStore.isExam,
        );
    if (proctoringSettings == null) {
        return;
    }
});

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
