<template>
    <v-text-field
        v-model="searchValue"
        class="search-input"
        data-testid="search-input"
        density="comfortable"
        hide-details
        :placeholder="
            translate('userAccount.userAccountPage.filters.searchField')
        "
        type="text"
        variant="outlined"
        @keydown.enter="onSearch"
        @keydown.esc="onClearSearch"
    >
        <template #append-inner>
            <v-icon
                class="search-icon"
                data-testid="searchIcon-button"
                @click="onSearch"
            >
                mdi-magnify
            </v-icon>
        </template>
    </v-text-field>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { translate } from "@/utils/generalUtils.ts";
import type { BaseSettingsStoreView } from "@/components/views/seb-server/settings-navigation/store/storeContract.ts";

const props = defineProps<{
    store: BaseSettingsStoreView<unknown>;
}>();

const searchValue = computed({
    get: () => props.store.searchField,
    set: (value) => props.store.setSearchField(value),
});

function onSearch() {
    console.log("search:", props.store.searchField);
}

function onClearSearch() {
    props.store.resetSearchState();
}
</script>
