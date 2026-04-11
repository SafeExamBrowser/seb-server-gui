<template>
    <div>
        <v-row class="pl-6">
            <SearchSectionTitle />
        </v-row>

        <v-row class="px-6">
            <SearchBox
                :model-value="modelValue"
                :search-text="searchText"
                @update:model-value="emit('update:modelValue', $event)"
                @search="emit('search')"
                @clear="emit('clear')"
            />
        </v-row>

        <v-row class="justify-end px-6 pt-4 ga-2">
            <CancelButton
                :text="'general.cancelButton'"
                @click="emit('clear')"
            />
            <ConfirmButton
                :text="'general.searchButton'"
                @click="emit('search')"
            />
        </v-row>
    </div>
</template>

<script setup lang="ts">
import SearchBox from "@/components/views/seb-server/settings-navigation/widgets/SearchBox.vue";
import SearchSectionTitle from "@/components/views/seb-server/settings-navigation/widgets/SearchSectionTitle.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";

defineProps<{
    modelValue: string | null;
    searchText: string;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: string | null];
    search: [];
    clear: [];
}>();
</script>
