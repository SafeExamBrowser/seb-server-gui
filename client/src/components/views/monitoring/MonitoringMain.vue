<template>
    <v-row>
        <v-col>
            monitoring page is working
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import { useAppBarStore } from '@/stores/store';
    import * as constants from "@/utils/constants";
    import {translate} from "@/utils/generalUtils";

    //stores
    const appBarStore = useAppBarStore();

    onBeforeMount(() => {
        appBarStore.title = translate("titles.monitoring");
    });



</script>

<style scoped>

</style>