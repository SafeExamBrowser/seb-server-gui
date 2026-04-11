<template>
    <div class="pa-4">
        <v-row dense class="align-center">
            <v-col cols="12" md="6">
                <SearchBox
                    :model-value="modelValue"
                    :search-text="searchText"
                    @update:model-value="emit('update:modelValue', $event)"
                    @search="emit('search')"
                    @clear="emit('clear')"
                />
            </v-col>
            <v-col cols="12" md="3" class="d-flex justify-end ga-2">
                <CancelButton
                    text="general.cancelButton"
                    @click="emit('clear')"
                />
                <ConfirmButton
                    text="general.searchButton"
                    @click="emit('search')"
                />
            </v-col>
        </v-row>

        <v-row dense class="mt-2">
            <v-col>
                <FiltersBar
                    :model-value="filterValues"
                    :sections="filterSections"
                    @update:model-value="emit('update:filterValues', $event)"
                    @clear="emit('clearFilters')"
                />
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import SearchBox from "@/components/widgets/SearchBox.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import FiltersBar from "@/components/blocks/filters/FiltersBar.vue";
import type { FilterSectionDef } from "@/components/blocks/filters/filterTypes.ts";
import type { TableFilters } from "@/components/blocks/entity-table/types.ts";

defineProps<{
    modelValue: string | null;
    searchText: string;
    filterSections: FilterSectionDef[];
    filterValues: TableFilters;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: string | null];
    search: [];
    clear: [];
    "update:filterValues": [value: TableFilters];
    clearFilters: [];
}>();
</script>
