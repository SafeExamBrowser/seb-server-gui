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
            <v-card-text>
                <v-tabs
                    v-model="currentTab"
                    align-tabs="center"
                    class="mb-4"
                    color="primary"
                >
                    <v-tab
                        v-for="tab in tabs"
                        :key="tab.value"
                        :value="tab.value"
                        >{{ tab.title }}</v-tab
                    >
                </v-tabs>

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
            </v-card-text>
        </v-row>

        <v-row align="center">
            <v-col align="right">
                <v-btn
                    color="black"
                    :disabled="sebSettingsStore.readonly"
                    rounded="sm"
                    variant="outlined"
                    @click="emit('closeSebSettingsDialog', false)"
                >
                    {{ translate("general.cancelButton") }}
                </v-btn>

                <v-btn
                    class="ml-2"
                    color="primary"
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

const sebSettingsStore = useSEBSettingsStore();
const ability = useAbilities();

const emit = defineEmits<{
    closeSebSettingsDialog: any;
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
                  title: translate("sebSettings.views.apps"),
                  value: 2,
                  component: markRaw(SebSettingsApplications),
              },
              {
                  title: translate("sebSettings.views.network"),
                  value: 3,
                  component: markRaw(SebSettingsNetwork),
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
