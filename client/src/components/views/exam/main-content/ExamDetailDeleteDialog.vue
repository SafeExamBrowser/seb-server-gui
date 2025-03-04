<template>
    <v-card>

        <v-toolbar color="transparent">
            <v-toolbar-title class="text-h6" text="Delete Exam"></v-toolbar-title>
            <template v-slot:append>
                <v-btn @click="emit('closeDeleteDialog')" icon="mdi-close"></v-btn>
            </template>
        </v-toolbar>

        <v-card-text>
            <v-row>
                <v-col>
                    This deletes the exam and the local import of a course or quiz in SEB Server.
                </v-col>
            </v-row>
            <v-row>
                <v-col class="font-weight-bold">
                    Are you sure you want to delete the exam?
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
                        color="primary" 
                        variant="flat" 
                        class="ml-2"
                        @click="emit('deleteExam')">
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
        closeDeleteDialog: any,
        deleteExam: any,
    }>();

</script>

<style scoped>



</style>