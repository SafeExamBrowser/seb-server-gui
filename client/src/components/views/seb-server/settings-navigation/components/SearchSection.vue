<template>
    <v-col>
        <v-row>
            <v-col cols="11">
                <v-row class="pl-6">
                    <SearchSectionTitle />
                </v-row>

                <v-row class="px-6">
                    <SearchBox
                        :store="store"
                        :search-text="searchText"
                        @search="emit('search')"
                        @clear="emit('clear')"
                    />
                </v-row>

                <v-row class="justify-end pa-6 pt-5 pb-0">
                    <CancelButton
                        :text="'general.cancelButton'"
                        @click="emit('clear')"
                    />
                    <ConfirmButton
                        :text="'general.searchButton'"
                        @click="emit('search')"
                    />
                </v-row>
            </v-col>
        </v-row>
    </v-col>
</template>

<script setup lang="ts">
import SearchBox from "@/components/views/seb-server/settings-navigation/widgets/SearchBox.vue";
import CancelButton from "@/components/views/seb-server/settings-navigation/widgets/CancelButton.vue";
import SearchSectionTitle from "@/components/views/seb-server/settings-navigation/widgets/SearchSectionTitle.vue";
import ConfirmButton from "@/components/views/seb-server/settings-navigation/widgets/ConfirmButton.vue";
import type { BaseSettingsStoreView } from "@/components/views/seb-server/settings-navigation/store/storeContract.ts";

defineProps<{
    searchText: string;
    store: BaseSettingsStoreView<unknown>;
}>();

const emit = defineEmits<{
    search: [];
    clear: [];
}>();
</script>

<style scoped>
.search-input :deep(.v-field--focused) {
    border-color: #215caf !important;
}

.search-input :deep(input::placeholder) {
    color: #215caf !important;
    opacity: 1 !important;
}

.search-input.v-input.v-input--focused :deep(.v-icon) {
    color: #215caf !important;
}
</style>
