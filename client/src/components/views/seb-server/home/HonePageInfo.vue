<template>

    <v-row dense>
        <!-- Breadcrumb -->
        <v-col cols="12" md="10" class="pl-5 mb-1">
            <div class="path-text d-flex align-center">
            <span
                class="breadcrumb-active"
                style="visibility: hidden;"
                @click="navigateTo(constants.HOME_PAGE_ROUTE)"
            >
                {{ translate("titles.home") }}
            </span>

                <span class="breadcrumb-arrow"
                      style="visibility: hidden;"
                >›</span>


            </div>
        </v-col>

        <!-- Title -->
        <v-col cols="12" md="10" class="pl-10">
            <div class="primary-text-color text-h4 font-weight-bold">
                {{ translate("titles.home") }}
            </div>
        </v-col>

        <v-col cols="12" md="2" class="pl-10"></v-col>
    </v-row>
</template>



<script setup lang="ts">
import {useAppBarStore} from '@/stores/store';
import * as constants from "@/utils/constants";
import {translate} from "@/utils/generalUtils";
import { useUserAccountStore} from '@/stores/authentication/authenticationStore';
import {navigateTo} from "@/router/navigation";

//stores
const appBarStore = useAppBarStore();


onBeforeMount(() => {
    appBarStore.title = translate('titles.home');

    console.log(useUserAccountStore().userAccount)
});

</script>



<style scoped>
</style>
