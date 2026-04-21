<template>
    <v-col v-if="fetched">
        <v-row>
            <PasswordSetting
                name="hashedAdminPassword"
                label="sebSettings.generalView.adminPassword"
                confirm-label="sebSettings.generalView.confirmAdminPassword"
                tooltip="sebSettings.generalView.adminPassword_tooltip"
            />
        </v-row>
        <v-row>
            <CheckboxSetting
                name="allowQuit"
                label="sebSettings.generalView.allowQuit"
                :tooltip="true"
            />
        </v-row>
        <v-row>
            <PasswordSetting
                name="hashedQuitPassword"
                label="sebSettings.generalView.quitPassword"
                confirm-label="sebSettings.generalView.confirmQuitPassword"
                tooltip="sebSettings.generalView.quitPassword_tooltip"
            />
        </v-row>
    </v-col>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import { ViewType } from "@/models/seb-server/sebSettingsEnums";
import CheckboxSetting from "./components/CheckboxSetting.vue";
import PasswordSetting from "./components/PasswordSetting.vue";

const sebSettingsStore = useSEBSettingsStore();
const fetched = ref<boolean>(false);

onBeforeMount(async () => {
    if (sebSettingsStore.selectedContainerId == null) {
        return;
    }

    fetched.value = await sebSettingsStore.fetchSingleValues(ViewType.GENERAL);
});
</script>
