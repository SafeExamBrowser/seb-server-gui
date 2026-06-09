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
                variant="flat"
                color="primary"
                block
                class="text-none"
                :data-testid="`${dataTestId}-action-${action.key}-button`"
                :disabled="action.disabled?.() ?? false"
                @click="action.onClick()"
            >
                <v-icon start>{{ action.icon }}</v-icon>
                {{ $t(action.label) }}
            </v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
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
        modelValue: string | undefined;
        searchText: string;
        filterSections: FilterSectionDef[];
        filterValues: TableFilters;
        dataTestId?: string;
        appliedSearch?: string | undefined;
        dateTitle?: string;
        dateValue?: Date | null;
        actions?: SearchBarAction[];
    }>(),
    {
        actions: () => [],
        dataTestId: undefined,
        appliedSearch: undefined,
        dateTitle: undefined,
        dateValue: undefined,
    },
);

const emit = defineEmits<{
    "update:modelValue": [value: string | undefined];
    search: [];
    clear: [];
    "update:filterValues": [value: TableFilters];
    clearFilters: [];
    "update:dateValue": [value: Date | null];
}>();

// The date picker is shown iff a dateTitle is provided.
const hasDate = computed(() => !!props.dateTitle);

const clearAllCount = computed(() => {
    let count = 0;
    if (props.appliedSearch) count++;
    if (props.dateValue) count++;
    for (const section of props.filterSections) {
        if (props.filterValues[section.key]) count++;
    }
    return count;
});

const searchDisabled = computed(
    () => (props.modelValue ?? "") === (props.appliedSearch ?? ""),
);

function onSearch() {
    emit("search");
}

function clearFilters() {
    emit("update:modelValue", undefined);
    emit("clearFilters");
}
</script>
