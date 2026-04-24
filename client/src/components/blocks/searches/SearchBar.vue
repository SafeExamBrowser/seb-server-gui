<template>
    <div class="pa-4">
        <v-row dense>
            <v-col cols="12" :md="dateTitle ? 6 : 9">
                <SearchSectionTitle :text="searchTitle" bold />
            </v-col>
            <v-col v-if="dateTitle" cols="12" md="3">
                <SearchSectionTitle :text="dateTitle" bold />
            </v-col>
        </v-row>

        <v-row dense align="stretch">
            <v-col cols="12" :md="dateTitle ? 6 : 9">
                <SearchBox
                    :model-value="modelValue"
                    :search-text="searchText"
                    @update:model-value="emit('update:modelValue', $event)"
                    @search="emit('search')"
                    @clear="emit('clear')"
                />
            </v-col>
            <v-col v-if="dateTitle" cols="12" md="3">
                <DatePicker
                    :model-value="dateValue ?? null"
                    @update:model-value="emit('update:dateValue', $event)"
                />
            </v-col>
            <v-col
                cols="12"
                md="3"
                class="d-flex align-center justify-end ga-2"
            >
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

        <v-row dense class="mt-3 align-start">
            <v-col cols="10" class="py-2">
                <FiltersBar
                    :model-value="filterValues"
                    :sections="filterSections"
                    @update:model-value="emit('update:filterValues', $event)"
                />
            </v-col>
            <v-col cols="2" class="d-flex justify-end align-center py-2">
                <v-btn
                    variant="outlined"
                    size="small"
                    color="primary"
                    class="text-none text-caption font-weight-medium"
                    :style="{
                        visibility: hasActiveFilters ? 'visible' : 'hidden',
                    }"
                    @click="emit('clearFilters')"
                >
                    <v-icon start size="small">mdi-close</v-icon>
                    {{ $t("general.clearFilters") }}
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import SearchBox from "@/components/widgets/SearchBox.vue";
import DatePicker from "@/components/widgets/DatePicker.vue";
import SearchSectionTitle from "@/components/widgets/SearchSectionTitle.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import FiltersBar from "@/components/blocks/filters/FiltersBar.vue";
import type { FilterSectionDef } from "@/components/blocks/filters/filterTypes.ts";
import type { TableFilters } from "@/components/blocks/entity-table/types.ts";

const props = defineProps<{
    modelValue: string | null;
    searchText: string;
    searchTitle: string;
    filterSections: FilterSectionDef[];
    filterValues: TableFilters;
    dateTitle?: string;
    dateValue?: Date | null;
}>();

const hasActiveFilters = computed(
    () =>
        props.filterSections.some((s) => !!props.filterValues[s.key]) ||
        props.dateValue != null,
);

const emit = defineEmits<{
    "update:modelValue": [value: string | null];
    search: [];
    clear: [];
    "update:filterValues": [value: TableFilters];
    clearFilters: [];
    "update:dateValue": [value: Date | null];
}>();
</script>
