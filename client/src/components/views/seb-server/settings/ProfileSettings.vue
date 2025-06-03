<template>
    <v-row class="pa-4 fill-height bg-red">
        <v-col>
            profile
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue'
    import { useAppBarStore, useLayoutStore } from '@/stores/store'
    import { translate } from '@/utils/generalUtils'
    import * as userAccountViewService from "@/services/seb-server/component-services/userAccountViewService";

    const appBarStore = useAppBarStore()
    const layoutStore = useLayoutStore()

    onMounted(async () => {
        appBarStore.title = translate('titles.userAccounts')
        layoutStore.setBlueBackground(true)
    })

    // when this view unmounts, turn off the blue background
    onBeforeUnmount(() => {
        layoutStore.setBlueBackground(false)
        //fetch Users
    })


    async function getUserAccounts() {
        // const userAccountResponse: UserAccount[] | null = await userAccountViewService.getUserAccounts();
        //
        // if(userAccountResponse == null){
        //     return;
        // }
        // userAccounts = userAccountResponse;
    }
</script>

<style scoped>
    /* (no changes here) */
</style>
