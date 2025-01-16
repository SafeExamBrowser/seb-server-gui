<template>
    <v-row>
        <v-col>
            exam page is working
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import { useAppBarStore } from '@/stores/store';
    import * as constants from "@/utils/constants";

    //stores
    const appBarStore = useAppBarStore();

    onBeforeMount(() => {
        appBarStore.title = constants.EXAMS_TITLE;
    });


</script>

<style scoped>

</style>