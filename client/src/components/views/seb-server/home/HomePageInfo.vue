<template>
    <v-row data-testid="homePageInfo-page-container" dense>
        <!-- Breadcrumb -->
        <v-col
            class="pl-5 mb-1"
            cols="12"
            data-testid="homePageInfo-breadcrumb-container"
            md="10"
        >
            <div
                class="path-text d-flex align-center"
                data-testid="homePageInfo-breadcrumb-wrapper"
            >
                <span
                    class="breadcrumb-active"
                    data-testid="homePageInfo-breadcrumbHome-link"
                    style="visibility: hidden"
                    @click="navigateTo(constants.HOME_PAGE_ROUTE)"
                >
                    {{ translate("titles.home") }}
                </span>

                <span
                    class="breadcrumb-arrow"
                    data-testid="homePageInfo-breadcrumbArrow-icon"
                    style="visibility: hidden"
                    >›</span
                >
            </div>
        </v-col>

        <!-- Title -->
        <v-col
            class="pl-10"
            cols="12"
            data-testid="homePageInfo-title-col"
            md="10"
        >
            <div
                class="primary-text-color text-h4 font-weight-bold"
                data-testid="homePageInfo-title-text"
            >
                {{ translate("titles.home") }}
            </div>
        </v-col>

        <v-col
            class="pl-10"
            cols="12"
            data-testid="homePageInfo-spacer-col"
            md="2"
        ></v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useAppBarStore } from "@/stores/store";
import * as constants from "@/utils/constants";
import { translate } from "@/utils/generalUtils";
import { useUserAccountStore } from "@/stores/authentication/authenticationStore";
import { navigateTo } from "@/router/navigation";

// stores
const appBarStore = useAppBarStore();


let foo = 1; //test


if (bar == 1) {
  console.log("this is bad");
}






onBeforeMount(() => {
    appBarStore.title = translate("titles.home");

    console.log(useUserAccountStore().userAccount);
});
</script>

<style scoped></style>
