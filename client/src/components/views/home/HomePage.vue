<template>
    <v-row>

        <v-col cols="2">
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-4">

                <div class="primary-text-color text-h6 font-weight-black">
                    {{translate('homePage.prepareExam')}}
                </div>

                <v-row>
                    <v-col align="right">
                        <v-btn 
                            rounded="sm" 
                            color="primary" 
                            variant="flat" 
                            class="mt-8"
                            :to="constants.QUIZ_IMPORT_ROUTE">
                            {{translate('homePage.startNow')}}
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
    import { useI18n } from "vue-i18n";
    import {translate} from "@/utils/generalUtils";

    //stores
    const appBarStore = useAppBarStore();

    //i18n
    const i18n = useI18n();

    onBeforeMount(() => {
        appBarStore.title = translate('titles.home');
    });


</script>

<style scoped>

</style>