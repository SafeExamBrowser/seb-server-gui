<template>
    <v-text-field
        :model-value="modelValue"
        color="primary"
        :data-testid="`${dataTestId}-search-input`"
        density="compact"
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
                :data-testid="`${dataTestId}-search-icon`"
                @click="onSearch"
            >
                mdi-magnify
            </v-icon>
        </template>
    </v-text-field>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";

withDefaults(
    defineProps<{
        modelValue: string | undefined;
        searchText: string;
        dataTestId?: string;
    }>(),
    { dataTestId: undefined },
);

const emit = defineEmits<{
    "update:modelValue": [value: string | undefined];
    search: [];
    clear: [];
}>();

function onSearch() {
    emit("search");
}

function onClearSearch() {
    emit("clear");
}
</script>
