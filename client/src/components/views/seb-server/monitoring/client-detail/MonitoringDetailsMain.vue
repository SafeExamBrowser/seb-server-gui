<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-8">

                <v-expansion-panels 
                    v-model="panels" 
                    multiple>


                    <!------notifications------->
                    <v-expansion-panel class="rounded-lg">

                        <v-expansion-panel-title class="font-weight-bold">
                            test
                        </v-expansion-panel-title>
                        
                        <v-expansion-panel-text>
                            test
                        </v-expansion-panel-text>
                    </v-expansion-panel>


                    <!------messages------->
                    <v-expansion-panel class="rounded-lg">
                        <v-expansion-panel-title class="font-weight-bold">
                            test
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                            test
                        </v-expansion-panel-text>
                    </v-expansion-panel>


                    <!------screen proctoring------->
                    <v-expansion-panel class="rounded-lg">
                        <v-expansion-panel-title class="font-weight-bold">
                            Screen Proctoring
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                            <ProctoringViewPage :session-id-prop="connectionToken"></ProctoringViewPage>
                        </v-expansion-panel-text>
                    </v-expansion-panel>


                    <!------logs------->
                    <v-expansion-panel class="rounded-lg">
                        <v-expansion-panel-title class="font-weight-bold">
                            test
                        </v-expansion-panel-title>

                        <v-expansion-panel-text>
                            test
                        </v-expansion-panel-text>
                    </v-expansion-panel>

                </v-expansion-panels>
            </v-sheet>
        </v-col>
    </v-row>

    
</template>

<script setup lang="ts">
    import { useMonitoringStore } from '@/stores/seb-server/monitoringStore';

    //route params
    const examId = useRoute().params.examId.toString();
    const connectionToken = useRoute().params.connectionToken.toString();

    //ui control
    const panels = ref<string[]>([]);

    //stores
    const monitoringStore = useMonitoringStore();


</script>

<style scoped>

</style>