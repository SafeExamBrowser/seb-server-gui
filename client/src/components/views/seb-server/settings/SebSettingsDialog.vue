<template>
    <v-card class="pa-5">
        <v-row>
            <v-toolbar color="transparent">
                <v-toolbar-title class="text-h6" :text="translate(sebSettingsStore.dialogTitle)"></v-toolbar-title>
                <template v-slot:append>
                    <v-btn @click="emit('closeSebSettingsDialog', false)" icon="mdi-close"></v-btn>
                </template>
            </v-toolbar>
        </v-row>

        <v-row v-if="sebSettingsStore.activeSEBClientConnection != null && sebSettingsStore.activeSEBClientConnection > 0"  class="ml-5 mr-5" >
            <v-card variant="elevated" color="indigo" class="pa-5" >
                {{translate("examDetail.main.activeSEBClientsNote")}}
            </v-card>
        </v-row>

        <v-row>
            <v-card-text>
                <v-tabs v-model="currentTab" align-tabs="center" color="primary" class="mb-4">
                    <v-tab v-for="tab in tabs" :value=tab.value >{{tab.title}}</v-tab>
                </v-tabs>

                <v-tabs-window v-model="currentTab">
                    <v-tabs-window-item v-for="tab in tabs" :key="tab.value" :value="tab.value">
                        <v-card 
                            variant="outlined"
                            class="rounded-lg pa-4">

                            <component :is="tab.component"/>

                        </v-card>
                    </v-tabs-window-item>
                </v-tabs-window>
            </v-card-text>
        </v-row>

        <v-row align="center">
            <v-col align="right">
                <v-btn 
                    rounded="sm" 
                    color="black" 
                    variant="outlined"
                    :disabled="sebSettingsStore.readonly"
                    @click="emit('closeSebSettingsDialog', true)">
                    Save Settings
                </v-btn>

                <v-btn 
                    rounded="sm" 
                    color="primary" 
                    variant="flat" 
                    class="ml-2"
                    @click="emit('closeSebSettingsDialog', false)">
                    Cancel Changes
                </v-btn>
            </v-col>
        </v-row>
    </v-card>

    
</template>

<script setup lang="ts">
    import {translate} from "@/utils/generalUtils";
    import SebSettingsApplications from "@/components/views/seb-server/settings/SebSettingsApplications.vue";
    import SebSettingsNetwork from "@/components/views/seb-server/settings/SebSettingsNetwork.vue";
    import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
    import SebSettingsGeneral from "./SebSettingsGeneral.vue";
    import { useAbilities, GUIAction } from '@/services/ability';

    const sebSettingsStore = useSEBSettingsStore();
    const ability = useAbilities()

    const emit = defineEmits<{
        closeSebSettingsDialog: any,
    }>();

    const currentTab = ref<number>(1);

    const tabs: {title: string, value: number, component: Component}[] =
        ability.canDo(GUIAction.EditFullSEBSettings) 
            ? [
                    {
                        title: translate("sebSettings.views.general"),
                        value: 1,
                        component: markRaw(SebSettingsGeneral)
                    },
                    {
                        title: translate("sebSettings.views.apps"),
                        value: 2,
                        component: markRaw(SebSettingsApplications)
                    },
                    {
                        title: translate("sebSettings.views.network"),
                        value: 3,
                        component: markRaw(SebSettingsNetwork)
                    },
                ]
            : [
                    {
                        title: translate("sebSettings.views.apps"),
                        value: 2,
                        component: markRaw(SebSettingsApplications)
                    },
                    {
                        title: translate("sebSettings.views.network"),
                        value: 3,
                        component: markRaw(SebSettingsNetwork)
                    },
                ];


</script>