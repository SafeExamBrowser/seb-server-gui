<template>
    <v-row data-testid="homepageContainer-page-container">
        <v-col cols="12" data-testid="homepageContainer-root-col">
            <!-- Infos -->
            <v-row data-testid="homepageContainer-info-section">
                <v-col cols="12" data-testid="homepageContainer-info-col">
                    <HomePageInfo
                        data-testid="homepageContainer-homePageInfo-component"
                    />
                </v-col>
            </v-row>

            <!-- Main -->
            <v-row
                align="stretch"
                class="mt-5"
                data-testid="homepageContainer-main-section"
            >
                <HomePageMain
                    data-testid="homepageContainer-homePageMain-component"
                />
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useAppBarStore } from "@/stores/store";
import * as constants from "@/utils/constants";
import * as spConstants from "@/utils/sp-constants";
import { useI18n } from "vue-i18n";
import { translate } from "@/utils/generalUtils";
import * as generalUtils from "@/utils/generalUtils";
import {
    useAuthStore,
    useUserAccountStore,
} from "@/stores/authentication/authenticationStore";
import { StorageItemEnum } from "@/models/StorageItemEnum";
import { navigateTo } from "@/router/navigation";
import HomePageInfo from "@/components/views/seb-server/home/HomePageInfo.vue";
import HomePageMain from "@/components/views/seb-server/home/HomePageMain.vue";

// stores
const appBarStore = useAppBarStore();
const authStore = useAuthStore();

// i18n
const i18n = useI18n();

onBeforeMount(() => {
    appBarStore.title = translate("titles.home");

    console.log(useUserAccountStore().userAccount);
});
</script>

<style scoped>
.bigger-btn {
    font-size: 0.9rem;
    min-height: 40px;
    padding: 0.5rem 1.25rem;
}
</style>
