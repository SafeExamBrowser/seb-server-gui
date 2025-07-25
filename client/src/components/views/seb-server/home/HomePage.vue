<template>

    <v-row dense>
        <v-col cols="12" md="10" class="pl-5">
            <div class="path-text">
                <span
                    class="pr-1"
                    @click="navigateTo(constants.HOME_PAGE_ROUTE)"
                    style="visibility: hidden;"
                >
                    {{ translate("titles.home") }}
                </span>
            </div>
        </v-col>
        <v-col cols="12" md="10" class="pl-10">
            <div class="primary-text-color text-h4 font-weight-bold ">
                {{ translate('titles.home') }}
            </div>
        </v-col>

        <v-col cols="12" md="2" class="pl-10 ">
        </v-col>
    </v-row>


    <v-row>
        <!-- First Column -->
        <v-col
            cols="3"
            class="d-flex flex-column align-center"
            style="min-height: 92vh; gap: 2rem;"
        >
            <v-sheet
                elevation="4"
                class="rounded-sm pa-4 d-flex flex-column justify-space-between"
                style="width: 100%; max-width: 95%; height: 30%;"
            >

            <div class="primary-text-color text-h5 font-weight-black mb-16">
                    {{ translate('homePage.createTemplates') }}
                </div>
                <div class="d-flex justify-end mt-auto">
                    <v-btn
                        rounded="sm"
                        color="primary"
                        variant="flat"
                        class="bigger-btn"
                    >
                        {{ translate('homePage.startNow') }}
                    </v-btn>
                </div>
            </v-sheet>

            <v-sheet
                elevation="4"
                class="rounded-sm pa-4 d-flex flex-column justify-space-between"
                style="width: 100%; max-width: 95%; height: 30%;"
            >

                <div class="primary-text-color text-h5 font-weight-black mb-16">
                    {{ translate('homePage.prepareExam') }}
                </div>
                <div class="d-flex justify-end mt-auto">
                    <v-btn
                        rounded="sm"
                        color="primary"
                        variant="flat"
                        :to="constants.QUIZ_IMPORT_ROUTE"
                        class="bigger-btn"
                    >
                        {{ translate('homePage.startNow') }}
                    </v-btn>
                </div>
            </v-sheet>

            <v-sheet
                elevation="4"
                class="rounded-sm pa-4 d-flex flex-column justify-space-between"
                style="width: 100%; max-width: 95%; height: 30%;"
            >

            <div class="primary-text-color text-h5 font-weight-black mb-16">
                    {{ translate('homePage.monitorExams') }}
                </div>
                <div class="d-flex justify-end mt-auto">
                    <v-btn
                        rounded="sm"
                        color="primary"
                        variant="flat"
                        :to="constants.MONITORING_ROUTE"
                        class="bigger-btn"
                    >
                        {{ translate('homePage.startNow') }}
                    </v-btn>
                </div>
            </v-sheet>

        </v-col>

        <!-- Right Column -->
        <v-col cols="9">
            <v-sheet >
            </v-sheet>
        </v-col>
    </v-row>
</template>



<script setup lang="ts">
    import { useAppBarStore } from '@/stores/store';
    import * as constants from "@/utils/constants";
    import * as spConstants from "@/utils/sp-constants";
    import { useI18n } from "vue-i18n";
    import {translate} from "@/utils/generalUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import { useAuthStore, useUserAccountStore } from '@/stores/authentication/authenticationStore';
    import { StorageItemEnum } from "@/models/StorageItemEnum";
    import {navigateTo} from "@/router/navigation";

    //stores
    const appBarStore = useAppBarStore();
    const authStore = useAuthStore();

    //i18n
    const i18n = useI18n();

    onBeforeMount(() => {
        appBarStore.title = translate('titles.home');

        console.log(useUserAccountStore().userAccount)
    });


</script>

<style scoped>

    .bigger-btn {
        font-size: 0.90rem;
        min-height: 40px;
        padding: 0.5rem 1.25rem;
    }

</style>
