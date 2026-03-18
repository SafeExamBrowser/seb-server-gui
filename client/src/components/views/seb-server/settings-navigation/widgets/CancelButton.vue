<template>
    <v-btn
        color="black"
        data-testid="cancel-button"
        rounded="sm"
        variant="outlined"
        @click="onClearSearch()"
    >
        {{ translate("general.cancelButton") }}
    </v-btn>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";
import { BaseSettingsStoreView } from "@/components/views/seb-server/settings-navigation/store/storeContract.ts";

const props = defineProps<{
    store: BaseSettingsStoreView<unknown>;
}>();

function onClearSearch() {
    props.store.resetSearchState();
}
</script>
