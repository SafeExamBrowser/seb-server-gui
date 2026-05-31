<template>
    <div
        class="d-flex flex-column h-100"
        :data-testid="`${dataTestId}-filters-container`"
    >
        <div
            class="d-flex align-center ga-2 px-4 pt-6 pb-1"
            :style="{ minHeight: '56px' }"
        >
            <v-icon icon="mdi-filter-variant" color="primary" />
            <span class="text-subtitle-1 font-weight-bold flex-grow-1">
                {{ $t("general.filters") }}
            </span>
            <v-btn
                v-if="clearAllCount > 0"
                variant="text"
                color="primary"
                size="small"
                class="text-none"
                :data-testid="`${dataTestId}-search-cancel-button`"
                @click="clearFilters"
            >
                <v-icon start size="small" icon="mdi-refresh" />
                {{ $t("general.reset") }}
            </v-btn>
        </div>

        <div
            class="flex-grow-1 overflow-y-auto px-4 py-3"
            :style="{ minHeight: 0 }"
        >
            <SearchBox
                :model-value="modelValue"
                :search-text="searchText"
                :data-test-id="dataTestId"
                @update:model-value="emit('update:modelValue', $event)"
                @search="onSearch"
                @clear="emit('clear')"
            />

            <FiltersBar
                class="mt-3"
                :sections="filterSections"
                :model-value="filterValues"
                :data-test-id="dataTestId"
                @update:model-value="emit('update:filterValues', $event)"
            />

            <template v-if="hasDate">
                <FilterSection
                    :title="$t(dateTitle!)"
                    :data-test-id="`${dataTestId}-date`"
                >
                    <div class="px-2 pt-1">
                        <DatePicker
                            :model-value="dateValue ?? null"
                            density="compact"
                            :data-test-id="`${dataTestId}-search-date`"
                            @update:model-value="
                                emit('update:dateValue', $event)
                            "
                        />
                    </div>
                </FilterSection>
            </template>
        </div>

        <v-divider />

        <div class="pa-4 d-flex flex-column ga-2">
            <ConfirmButton
                text="general.searchButton"
                block
                :disabled="searchDisabled"
                :data-test-id="`${dataTestId}-search-button`"
                @click="onSearch"
            />
            <v-btn
                v-for="action in actions"
                :key="action.key"
                variant="outlined"
                color="primary"
                block
                class="text-none"
                :data-testid="`${dataTestId}-action-${action.key}-button`"
                @click="emit('action', action.key)"
            >
                <v-icon start>{{ action.icon }}</v-icon>
                {{ $t(action.text) }}
            </v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import SearchBox from "@/components/widgets/SearchBox.vue";
import DatePicker from "@/components/widgets/DatePicker.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import FiltersBar from "@/components/widgets/filters/FiltersBar.vue";
import FilterSection from "@/components/widgets/filters/FilterSection.vue";
import type { FilterSectionDef } from "@/components/widgets/filters/filterTypes.ts";
import type { TableFilters } from "@/components/widgets/entity-table/types.ts";
import type { SearchBarAction } from "./types.ts";

const props = withDefaults(
    defineProps<{
        modelValue: string | null;
        searchText: string;
        filterSections: FilterSectionDef[];
        filterValues: TableFilters;
        dataTestId?: string;
        searchTitle?: string;
        dateTitle?: string;
        dateValue?: Date | null;
        actions?: SearchBarAction[];
        dense?: boolean;
    }>(),
    {
        actions: () => [],
        searchTitle: "general.searchTitle",
        dataTestId: undefined,
        dateTitle: undefined,
        dateValue: null,
        dense: false,
    },
);

const emit = defineEmits<{
    "update:modelValue": [value: string | null];
    search: [];
    clear: [];
    "update:filterValues": [value: TableFilters];
    clearFilters: [];
    "update:dateValue": [value: Date | null];
    action: [key: string];
    collapse: [];
}>();

// The date picker is shown iff a dateTitle is provided.
const hasDate = computed(() => !!props.dateTitle);

const lastSearchedValue = ref<string | null>(props.modelValue);

const clearAllCount = computed(() => {
    let count = 0;
    if (lastSearchedValue.value) count++;
    if (props.dateValue != null) count++;
    for (const section of props.filterSections) {
        if (props.filterValues[section.key]) count++;
    }
    return count;
});

const searchDisabled = computed(
    () => props.modelValue === lastSearchedValue.value,
);

function onSearch() {
    lastSearchedValue.value = props.modelValue;
    emit("search");
}

function clearFilters() {
    lastSearchedValue.value = null;
    emit("update:modelValue", null);
    emit("clearFilters");
}
</script>
