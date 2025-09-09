<template>
    <v-card>
        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" text="Edit Application and Network Settings"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeSebSettingsDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>

            <v-tabs v-model="currentTab" align-tabs="center" color="primary" class="mb-4">
                <v-tab v-for="tab in tabs" :value=tab.value>{{tab.title}}</v-tab>
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
    </v-card>
</template>

<script setup lang="ts">
    import {stringToBoolean, translate} from "@/utils/generalUtils";
    import SebSettingsApplications from "@/components/views/seb-server/settings/SebSettingsApplications.vue";
    import SebSettingsNetwork from "@/components/views/seb-server/settings/SebSettingsNetwork.vue";
    import { useSEBSettingsStore } from "@/stores/seb-server/sebSettingsStore";
    import { useExamStore } from "@/stores/seb-server/examStore";

    const sebSettingsStore = useSEBSettingsStore();
    const examStore = useExamStore();

    const emit = defineEmits<{
        closeSebSettingsDialog: any,
    }>();

    const currentTab = ref<number>(1);

    const tabs: {title: string, value: number, component: Component}[] = [
        {
            title: translate("sebSettings.views.apps"),
            value: 1,
            component: markRaw(SebSettingsApplications)
        },
        {
            title: translate("sebSettings.views.network"),
            value: 2,
            component: markRaw(SebSettingsNetwork)
        },
    ];

    onBeforeMount(async () => {

        // TODO this is just for now, later we should be able to distinguish if SEB Settings are for Exam or Template
         if(examStore.selectedExam == null){
            return;
        }
        sebSettingsStore.isExam = true;
        sebSettingsStore.selectedContainerId = examStore.selectedExam.id;
    });


</script>