<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" text="Archive Exam"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeArchiveDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <v-col>
                    An archived exam cannot be rerun and will remain in read-only view.
                </v-col>
            </v-row>
            <v-row>
                <v-col class="font-weight-bold">
                    Are you sure you want to archive the exam?
                </v-col>
            </v-row>

            <v-row>
                <v-col align="right">
                    <v-btn 
                        rounded="sm" 
                        color="black" 
                        variant="outlined"
                        @click="emit('closeArchiveDialog')">
                        Cancel
                    </v-btn>

                    <v-btn 
                        rounded="sm" 
                        color="primary" 
                        variant="flat" 
                        class="ml-2"
                        @click="emit('archiveExam')">
                        OK
                    </v-btn>

                </v-col>
            </v-row>
        </v-card-text>
    </v-card> 
</template>


<script setup lang="ts">

    //emits
    const emit = defineEmits<{
        closeArchiveDialog: any,
        archiveExam: any,
    }>();

</script>

<style scoped>



</style>