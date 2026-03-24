<template>
    <v-text-field
        v-model="searchValue"
        class="search-input"
        data-testid="search-input"
        density="comfortable"
        hide-details
        :placeholder="translate(searchText)"
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
    searchText: string;
}>();

const emit = defineEmits<{
    search: [];
    clear: [];
}>();

const searchValue = computed({
    get: () => props.store.searchField,
    set: (value) => props.store.setSearchField(value),
});

function onSearch() {
    emit("search");
}

function onClearSearch() {
    props.store.resetSearchState();
    emit("clear");
}
</script>
