<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" text="Select Connection Configuration"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeConfigDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <v-col>
                    Please select the Connection Configuration you want to use for starting this exam and click OK to start the download.
                </v-col>
            </v-row>

            <v-row>
                <v-col>
                    <v-select
                        hide-details
                        density="compact"
                        variant="outlined"  
                        v-model="connectionConfigSelect"
                        :items="props.connectionConfigurations.content"
                        item-title="name"
                        item-value="id">
                    </v-select>
                </v-col>
            </v-row>

            <v-row>
                <v-col align="right">
                    <v-btn 
                        rounded="sm" 
                        color="black" 
                        variant="outlined"
                        @click="emit('closeConfigDialog')">
                        Cancel
                    </v-btn>

                    <v-btn 
                        rounded="sm" 
                        color="primary" 
                        variant="flat" 
                        class="ml-2"
                        :disabled="connectionConfigSelect == null"
                        @click="confirmSelection()">
                        OK
                    </v-btn>

                </v-col>
            </v-row>
        </v-card-text>
    </v-card> 
</template>


<script setup lang="ts">
    import { useExamStore } from '@/stores/examStore';
    import * as userAccountViewService from "@/services/component-services/userAccountViewService";
    import * as tableUtils from "@/utils/table/tableUtils";
    
    //emits
    const emit = defineEmits<{
        closeConfigDialog: [],
        downloadExamConfig: [connectionId: string]
    }>();

    //props
    const props = defineProps<{
        connectionConfigurations: ConnectionConfigurations
    }>();

    const connectionConfigSelect = ref<number>();


    //=======================events & watchers=======================
    function confirmSelection(){
        if(connectionConfigSelect.value != null){
            emit("downloadExamConfig", connectionConfigSelect.value.toString());
        }
    }


    

</script>

<style scoped>



</style>