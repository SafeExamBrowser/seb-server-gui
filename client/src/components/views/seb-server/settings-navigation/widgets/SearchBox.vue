<template>
    <v-text-field
        :model-value="modelValue"
        class="search-input"
        data-testid="search-input"
        density="comfortable"
        hide-details
        :placeholder="translate(searchText)"
        type="text"
        variant="outlined"
        @update:model-value="emit('update:modelValue', $event)"
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
import { translate } from "@/utils/generalUtils.ts";

defineProps<{
    modelValue: string | null;
    searchText: string;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: string | null];
    search: [];
    clear: [];
}>();

function onSearch() {
    emit("search");
}

function onClearSearch() {
    emit("update:modelValue", null);
    emit("clear");
}
</script>
