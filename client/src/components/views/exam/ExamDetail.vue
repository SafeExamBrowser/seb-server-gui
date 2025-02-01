<template>
    <v-row>
        <v-col>
            <v-sheet class="pa-4">

                <div>
                    Exam Detail
                </div>
            
            
            
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import { useAppBarStore } from '@/stores/store';
    import * as constants from "@/utils/constants";

    //stores
    const appBarStore = useAppBarStore();

    onBeforeMount(async () => {
        appBarStore.title = constants.EXAMS_DETAIL_TITLE;

    });


</script>

<style scoped>

</style>