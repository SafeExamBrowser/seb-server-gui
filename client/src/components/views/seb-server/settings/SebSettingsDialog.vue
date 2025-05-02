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
    import SebSettingsApplications from "@/components/views/seb-server/settings/SebSettingsApplications.vue";
    import SebSettingsNetwork from "@/components/views/seb-server/settings/SebSettingsNetwork.vue";


    // const props = defineProps<{
    //     examTemplate: ExamTemplate | null
    // }>();

    const emit = defineEmits<{
        closeSebSettingsDialog: any,
    }>();

    const currentTab = ref<number>(1);

    const tabs: {title: string, value: number, component: Component}[] = [
        {
            title: "Applications",
            value: 1,
            component: markRaw(SebSettingsApplications)
        },
        {
            title: "Network",
            value: 2,
            component: markRaw(SebSettingsNetwork)
        },
    ];


</script>