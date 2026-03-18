<template>
    <v-btn
        class="ml-2"
        color="primary"
        data-testid="search-button"
        rounded="sm"
        variant="flat"
        @click="onSearch()"
    >
        {{ translate("general.searchButton") }}
    </v-btn>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";
import { BaseSettingsStoreView } from "@/components/views/seb-server/settings-navigation/store/storeContract.ts";

const props = defineProps<{
    store: BaseSettingsStoreView<unknown>;
}>();

function onSearch() {
    console.log("search:", props.store.searchField);
}
</script>
