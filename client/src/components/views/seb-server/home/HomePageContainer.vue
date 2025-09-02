<template>
    <div data-testid="home-page-container">
    <v-row>
        <v-col cols="12">
            <!-- Infos -->
            <v-row>
                <v-col cols="12">
                    <HonePageInfo></HonePageInfo>
                </v-col>
            </v-row>

            <!-- Main -->
            <v-row class="mt-5" align="stretch">
                <HomePageMain></HomePageMain>
            </v-row>

        </v-col>
    </v-row>
    </div>
</template>


<script setup lang="ts">
import {useAppBarStore} from '@/stores/store';
import * as constants from "@/utils/constants";
import * as spConstants from "@/utils/sp-constants";
import {useI18n} from "vue-i18n";
import {translate} from "@/utils/generalUtils";
import * as generalUtils from "@/utils/generalUtils";
import {useAuthStore, useUserAccountStore} from '@/stores/authentication/authenticationStore';
import {StorageItemEnum} from "@/models/StorageItemEnum";
import {navigateTo} from "@/router/navigation";
import HonePageInfo from "@/components/views/seb-server/home/HonePageInfo.vue";
import HomePageMain from "@/components/views/seb-server/home/HomePageMain.vue";

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
