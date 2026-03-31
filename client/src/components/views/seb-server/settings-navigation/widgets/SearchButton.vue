<template>
    <v-btn
        class="ml-2"
        color="primary"
        data-testid="search-button"
        rounded="sm"
        variant="flat"
        @click="onSearch"
    >
        {{ translate("general.searchButton") }}
    </v-btn>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";
import type { BaseSettingsStoreView } from "@/components/views/seb-server/settings-navigation/store/storeContract.ts";

defineProps<{
    store: BaseSettingsStoreView<unknown>;
}>();

const emit = defineEmits<{
    click: [];
}>();

function onSearch() {
    emit("click");
}
</script>
