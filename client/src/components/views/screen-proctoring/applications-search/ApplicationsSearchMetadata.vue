<template>

    <v-row>
        <v-col align="left" class="text-h6">
            {{ examObject.exam.name }}
        </v-col>
        <v-col align="right" class="text-h6">
            {{ timeUtils.formatTimestampToFullDate(examObject.exam.startTime) }}
        </v-col>
    </v-row>

    <v-row>
        <v-col>
            <v-expansion-panels 
                v-model="panels" 
                multiple>
                <v-expansion-panel 
                    v-for="metadataApp in examObject.metadataAppList" 
                    class="rounded-lg" 
                    :key="metadataApp"
                    :value="metadataApp">

                    <v-expansion-panel-title class="font-weight-bold panel-styling">
                        {{ metadataApp }}
                    </v-expansion-panel-title>
                    
                    <v-expansion-panel-text class="panel-styling">
                        <ApplicationsSearchWindowTitle
                            :metadataApp="metadataApp"
                            :groupIds="examObject.groupIds">
                        </ApplicationsSearchWindowTitle>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
    import { ref } from "vue";
    import * as timeUtils from "@/utils/timeUtils";
    import ApplicationsSearchWindowTitle from "./ApplicationsSearchWindowTitle.vue";


    //props
    const props = defineProps<{
        examObject: {
            exam: SPExam,
            metadataAppList: string[],
            groupIds: number[]
        }
    }>();

    //ui control
    const panels = ref<string[]>([]);

</script>


<style scoped>

    .panel-styling{
        background: #e2ecf7
    }

</style>