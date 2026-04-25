<template>
    <div class="pl-6 pr-6">
        <v-row align="start">
            <!-- Column 1: Search -->
            <v-col
                cols="12"
                :md="hasDate ? 3 : 4"
                class="d-flex flex-column ga-2"
            >
                <span
                    class="text-caption text-medium-emphasis text-uppercase font-weight-medium"
                >
                    {{ $t(searchTitle) }}
                </span>
                <SearchBox
                    :model-value="modelValue"
                    :search-text="searchText"
                    @update:model-value="emit('update:modelValue', $event)"
                    @search="emit('search')"
                    @clear="emit('clear')"
                />
            </v-col>

            <!-- Column 2: Date (optional) -->
            <v-col
                v-if="hasDate"
                cols="12"
                md="2"
                class="d-flex flex-column ga-2"
            >
                <span
                    class="text-caption text-medium-emphasis text-uppercase font-weight-medium"
                >
                    {{ $t(dateTitle!) }}
                </span>
                <DatePicker
                    :model-value="dateValue ?? null"
                    @update:model-value="emit('update:dateValue', $event)"
                />
            </v-col>

            <!-- Column 3: Filters + toggle -->
            <v-col
                cols="12"
                :md="hasDate ? 7 : 8"
                class="d-flex flex-column ga-3"
            >
                <FiltersBar
                    v-if="expanded"
                    :sections="filterSections"
                    :model-value="filterValues"
                    @update:model-value="emit('update:filterValues', $event)"
                />

                <div v-else-if="activePills.length > 0">
                    <div class="d-flex align-center ga-2 mb-2">
                        <span
                            class="text-caption text-medium-emphasis text-uppercase font-weight-medium"
                        >
                            {{ $t("general.activeFilters") }}
                        </span>
                        <v-chip size="x-small" color="primary" variant="flat">
                            {{ activePills.length }}
                        </v-chip>
                    </div>
                    <div class="d-flex flex-wrap ga-2">
                        <v-chip
                            v-for="pill in activePills"
                            :key="`${pill.sectionKey}-${pill.option.value}`"
                            size="small"
                            :color="pill.option.color || 'primary'"
                            variant="tonal"
                            closable
                            class="font-weight-medium"
                            @click:close="clearFilter(pill.sectionKey)"
                        >
                            {{ pill.option.label }}
                        </v-chip>
                    </div>
                </div>

                <v-btn
                    v-if="filterSections.length > 0"
                    variant="text"
                    color="primary"
                    size="small"
                    class="text-none align-self-start"
                    @click="expanded = !expanded"
                >
                    <v-icon start>
                        {{ expanded ? "mdi-chevron-up" : "mdi-chevron-down" }}
                    </v-icon>
                    {{
                        expanded
                            ? $t("general.hideAdvancedFilters")
                            : $t("general.showAdvancedFilters")
                    }}
                </v-btn>
            </v-col>
        </v-row>

        <!-- Actions row -->
        <v-divider class="mt-4 mb-4" />
        <div class="d-flex align-center ga-2">
            <v-btn
                v-if="activeFilterCount > 0"
                variant="text"
                color="primary"
                size="small"
                class="text-none me-auto"
                @click="emit('clearFilters')"
            >
                <v-icon start>mdi-close</v-icon>
                {{ $t("general.clearFilters") }}
                <v-chip
                    size="x-small"
                    color="primary"
                    variant="tonal"
                    class="ms-2"
                >
                    {{ activeFilterCount }}
                </v-chip>
            </v-btn>

            <v-btn
                v-for="action in actions"
                :key="action.key"
                variant="outlined"
                color="primary"
                class="text-none"
                @click="emit('action', action.key)"
            >
                <v-icon start>{{ action.icon }}</v-icon>
                {{ $t(action.text) }}
            </v-btn>

            <CancelButton text="general.cancelButton" @click="emit('clear')" />
            <ConfirmButton
                text="general.searchButton"
                @click="emit('search')"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import SearchBox from "@/components/widgets/SearchBox.vue";
import DatePicker from "@/components/widgets/DatePicker.vue";
import CancelButton from "@/components/widgets/CancelButton.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import FiltersBar from "@/components/blocks/filters/FiltersBar.vue";
import type {
    FilterOption,
    FilterSectionDef,
} from "@/components/blocks/filters/filterTypes.ts";
import type { TableFilters } from "@/components/blocks/entity-table/types.ts";
import type { SearchBarAction } from "./types.ts";

const props = withDefaults(
    defineProps<{
        modelValue: string | null;
        searchText: string;
        searchTitle: string;
        filterSections: FilterSectionDef[];
        filterValues: TableFilters;
        dateTitle?: string;
        dateValue?: Date | null;
        actions?: SearchBarAction[];
    }>(),
    { actions: () => [], dateTitle: undefined, dateValue: null },
);

const emit = defineEmits<{
    "update:modelValue": [value: string | null];
    search: [];
    clear: [];
    "update:filterValues": [value: TableFilters];
    clearFilters: [];
    "update:dateValue": [value: Date | null];
    action: [key: string];
}>();

const expanded = ref(true);

const hasDate = computed(() => !!props.dateTitle);

const activePills = computed(() => {
    const pills: { sectionKey: string; option: FilterOption }[] = [];
    for (const section of props.filterSections) {
        const val = props.filterValues[section.key];
        if (!val) continue;
        const opt = section.options.find((o) => o.value === val);
        if (opt) pills.push({ sectionKey: section.key, option: opt });
    }
    return pills;
});

const activeFilterCount = computed(() => {
    let count = 0;
    if (props.dateValue != null) count++;
    for (const section of props.filterSections) {
        if (props.filterValues[section.key]) count++;
    }
    return count;
});

function clearFilter(key: string) {
    emit("update:filterValues", { ...props.filterValues, [key]: null });
}
</script>
