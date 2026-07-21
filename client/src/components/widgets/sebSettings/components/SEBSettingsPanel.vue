<template>
    <v-row>
        <v-tabs v-model="currentTab" show-arrows="always" center-active>
            <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value">{{
                tab.title
            }}</v-tab>
        </v-tabs>
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
                        <component
                            :is="tab.component"
                            :context="props.context"
                        />
                    </v-card>
                </v-tabs-window-item> </v-tabs-window
        ></v-col>
    </v-row>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";
import SebSettingsApplications from "@/components/widgets/sebSettings/SebSettingsApplications.vue";
import SebSettingsNetwork from "@/components/widgets/sebSettings/SebSettingsNetwork.vue";
import { GUIAction, useAbilities } from "@/services/ability.ts";
import SebSettingsGeneral from "@/components/widgets/sebSettings/SebSettingsGeneral.vue";
import SebSettingsUserInterface from "@/components/widgets/sebSettings/SebSettingsUserInterface.vue";
import SebSettingsBrowser from "@/components/widgets/sebSettings/SebSettingsBrowser.vue";
import SebSettingsDownUploads from "@/components/widgets/sebSettings/SebSettingsDownUploads.vue";
import SebSettingsExam from "@/components/widgets/sebSettings/SebSettingsExam.vue";
import SebSettingsSecurity from "@/components/widgets/sebSettings/SebSettingsSecurity.vue";
import SebSettingsRegistry from "@/components/widgets/sebSettings/SebSettingsRegistry.vue";
import SebSettingsHookedKeys from "@/components/widgets/sebSettings/SebSettingsHookedKeys.vue";
import SebSettingsProctoring from "@/components/widgets/sebSettings/SebSettingsProctoring.vue";
import { ref, markRaw } from "vue";
import type { Component } from "vue";
import { SEBSettingsContext } from "@/components/widgets/sebSettings/types.ts";

const props = defineProps<{
    context: SEBSettingsContext;
}>();

const ability = useAbilities();
const currentTab = ref<number>(1);

const tabs: { title: string; value: number; component: Component }[] =
    ability.canDo(GUIAction.EDIT_FULL_SEB_SETTINGS)
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
