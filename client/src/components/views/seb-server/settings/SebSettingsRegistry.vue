<template>
    <v-row> REGISTRY Settings TODO </v-row>
</template>

<script setup lang="ts">
// import * as sebSettingsService from "@/services/seb-server/component-services/sebSettingsService";
// import { useI18n } from "vue-i18n";
// import { stringToBoolean, translate } from "@/utils/generalUtils";
// import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
// import { ViewType } from "@/models/seb-server/sebSettingsEnums";
// import { ref, onBeforeMount } from "vue";

// const i18n = useI18n();
// const sebSettingsStore = useSEBSettingsStore();

// // the parent component identifier
// let componentId: string;

// onBeforeMount(async () => {
//     if (sebSettingsStore.selectedContainerId == null) {
//         return;
//     }

//     componentId = sebSettingsStore.selectedContainerId.toString();

//     const registrySettings: SEBSettingsView | null =
//         await sebSettingsService.getViewSettings(
//             ViewType.REGISTRY,
//             componentId,
//             sebSettingsStore.isExam,
//         );
//     if (registrySettings == null) {
//         return;
//     }
// });

// async function saveSingleValue(valId: number, value: string) {
//     await sebSettingsService.updateSEBSettingValue(
//         componentId,
//         valId.toString(),
//         value,
//         sebSettingsStore.isExam,
//     );
// }

// async function saveOnFocusLost(focusIn: boolean, valId: number, value: string) {
//     if (!focusIn) {
//         saveSingleValue(valId, value);
//     }
// }
</script>
