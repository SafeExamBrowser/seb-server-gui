<template>
    <v-card class="pa-5">
        <v-row>
            <v-toolbar color="transparent">
                <v-toolbar-title
                    class="text-h6"
                    :text="translate(sebSettingsStore.dialogTitle)"
                ></v-toolbar-title>
                <template #append>
                    <v-btn
                        icon="mdi-close"
                        @click="emit('closeSebSettingsDialog', false)"
                    ></v-btn>
                </template>
            </v-toolbar>
        </v-row>

        <v-row
            v-if="
                sebSettingsStore.activeSEBClientConnection != null &&
                sebSettingsStore.activeSEBClientConnection > 0
            "
            class="ml-5 mr-5"
        >
            <v-card class="pa-5" color="indigo" variant="elevated">
                {{ translate("examDetail.main.activeSEBClientsNote") }}
            </v-card>
        </v-row>

        <v-row>
            <v-col>
                <v-tabs v-model="currentTab" show-arrows="always" center-active>
                    <v-tab
                        v-for="tab in tabs"
                        :key="tab.value"
                        :value="tab.value"
                        >{{ tab.title }}</v-tab
                    >
                </v-tabs>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-tabs-window v-model="currentTab">
                    <v-tabs-window-item
                        v-for="tab in tabs"
                        :key="tab.value"
                        :value="tab.value"
                    >
                        <v-card class="rounded-lg pa-4" variant="outlined">
                            <component :is="tab.component" />
                        </v-card>
                    </v-tabs-window-item>
                </v-tabs-window>
            </v-col>
        </v-row>

        <v-row align="center">
            <v-col align="right">
                <v-btn
                    color="black"
                    rounded="sm"
                    variant="outlined"
                    @click="emit('closeSebSettingsDialog', false)"
                >
                    {{ translate("general.cancelButton") }}
                </v-btn>

                <v-btn
                    class="ml-2"
                    color="primary"
                    :disabled="sebSettingsStore.readonly"
                    rounded="sm"
                    variant="flat"
                    @click="emit('closeSebSettingsDialog', true)"
                >
                    {{ translate("general.saveButton") }}
                </v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils";
import SebSettingsApplications from "@/components/views/seb-server/settings/SebSettingsApplications.vue";
import SebSettingsNetwork from "@/components/views/seb-server/settings/SebSettingsNetwork.vue";
import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
import SebSettingsGeneral from "./SebSettingsGeneral.vue";
import { GUIAction, useAbilities } from "@/services/ability";
import SebSettingsUserInterface from "./SebSettingsUserInterface.vue";
import SebSettingsBrowser from "./SebSettingsBrowser.vue";
import SebSettingsDownUploads from "./SebSettingsDownUploads.vue";
import SebSettingsExam from "./SebSettingsExam.vue";
import SebSettingsSecurity from "./SebSettingsSecurity.vue";
import SebSettingsRegistry from "./SebSettingsRegistry.vue";
import SebSettingsHookedKeys from "./SebSettingsHookedKeys.vue";
import SebSettingsProctoring from "./SebSettingsProctoring.vue";
import { ref, markRaw } from "vue";
import type { Component } from "vue";

const sebSettingsStore = useSEBSettingsStore();
const ability = useAbilities();

const emit = defineEmits<{
    (e: "closeSebSettingsDialog", value: boolean): void;
}>();

const currentTab = ref<number>(1);

const tabs: { title: string; value: number; component: Component }[] =
    ability.canDo(GUIAction.EditFullSEBSettings)
        ? [
              {
                  title: translate("sebSettings.views.general"),
                  value: 1,
                  component: markRaw(SebSettingsGeneral),
              },
              {
                  title: translate("sebSettings.views.userInterface"),
                  value: 2,
                  component: markRaw(SebSettingsUserInterface),
              },
              {
                  title: translate("sebSettings.views.browser"),
                  value: 3,
                  component: markRaw(SebSettingsBrowser),
              },
              {
                  title: translate("sebSettings.views.downUploads"),
                  value: 4,
                  component: markRaw(SebSettingsDownUploads),
              },
              {
                  title: translate("sebSettings.views.exam"),
                  value: 5,
                  component: markRaw(SebSettingsExam),
              },
              {
                  title: translate("sebSettings.views.apps"),
                  value: 6,
                  component: markRaw(SebSettingsApplications),
              },
              {
                  title: translate("sebSettings.views.network"),
                  value: 7,
                  component: markRaw(SebSettingsNetwork),
              },
              {
                  title: translate("sebSettings.views.security"),
                  value: 8,
                  component: markRaw(SebSettingsSecurity),
              },
              {
                  title: translate("sebSettings.views.registry"),
                  value: 9,
                  component: markRaw(SebSettingsRegistry),
              },
              {
                  title: translate("sebSettings.views.hookedKeys"),
                  value: 10,
                  component: markRaw(SebSettingsHookedKeys),
              },
              {
                  title: translate("sebSettings.views.proctoring"),
                  value: 11,
                  component: markRaw(SebSettingsProctoring),
              },
          ]
        : [
              {
                  title: translate("sebSettings.views.apps"),
                  value: 2,
                  component: markRaw(SebSettingsApplications),
              },
              {
                  title: translate("sebSettings.views.network"),
                  value: 3,
                  component: markRaw(SebSettingsNetwork),
              },
          ];
</script>
