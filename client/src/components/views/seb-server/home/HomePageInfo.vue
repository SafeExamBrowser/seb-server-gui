<template>
    <v-row dense data-testid="homePageInfo-page-container">
        <!-- Breadcrumb -->
        <v-col cols="12" md="10" class="pl-5 mb-1" data-testid="homePageInfo-breadcrumb-container">
            <div class="path-text d-flex align-center" data-testid="homePageInfo-breadcrumb-wrapper">
                <span
                    class="breadcrumb-active"
                    style="visibility: hidden;"
                    @click="navigateTo(constants.HOME_PAGE_ROUTE)"
                    data-testid="homePageInfo-breadcrumbHome-link"
                >
                    {{ translate("titles.home") }}
                </span>

                <span
                    class="breadcrumb-arrow"
                    style="visibility: hidden;"
                    data-testid="homePageInfo-breadcrumbArrow-icon"
                >›</span>
            </div>
        </v-col>

        <!-- Title -->
        <v-col cols="12" md="10" class="pl-10" data-testid="homePageInfo-title-col">
            <div
                class="primary-text-color text-h4 font-weight-bold"
                data-testid="homePageInfo-title-text"
            >
                {{ translate("titles.home") }}
            </div>
        </v-col>

        <v-col cols="12" md="2" class="pl-10" data-testid="homePageInfo-spacer-col"></v-col>
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
