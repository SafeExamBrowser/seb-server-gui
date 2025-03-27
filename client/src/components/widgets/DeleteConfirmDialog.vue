<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" :text="title"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeDeleteDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <v-col>
                    {{infoText}}
                </v-col>
            </v-row>
            <v-row>
                <v-col class="font-weight-bold">
                    {{questionText}}
                </v-col>
            </v-row>

            <v-row>
                <v-col align="right">
                    <v-btn 
                        rounded="sm" 
                        color="black" 
                        variant="outlined"
                        @click="emit('closeDeleteDialog')">
                        Cancel
                    </v-btn>

                    <v-btn 
                        rounded="sm" 
                        color="error" 
                        variant="flat" 
                        class="ml-2"
                        @click="emit('deleteEntity')">
                        Delete
                    </v-btn>

                </v-col>
            </v-row>
        </v-card-text>
    </v-card> 
</template>


<script setup lang="ts">

    //emits
    const emit = defineEmits<{
        closeDeleteDialog: any,
        deleteEntity: any,
    }>();

    //props
    const props = defineProps<{
        title: string,
        infoText: string,
        questionText: string
    }>();


</script>

<style scoped>



</style>