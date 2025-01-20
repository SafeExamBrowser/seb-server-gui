<template>
    <v-row>

        <v-col cols="2">
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-4">

                <div class="title-container text-h6 font-weight-black">
                    Prepare Exam
                </div>

                <v-row>
                    <v-col align="right">

                        <v-btn 
                            rounded="sm" 
                            color="primary" 
                            variant="flat" 
                            class="mt-8"
                            :to="constants.QUIZ_IMPORT_ROUTE">
                            Start now
                        </v-btn>

                    </v-col>
                </v-row>
            
            
            </v-sheet>
        </v-col>

    </v-row>
</template>

<script setup lang="ts">
    import { useAppBarStore } from '@/stores/store';
    import * as constants from "@/utils/constants";

    //stores
    const appBarStore = useAppBarStore();

    onBeforeMount(() => {
        appBarStore.title = constants.HOME_PAGE_TITLE;
    });


</script>

<style scoped>

</style>