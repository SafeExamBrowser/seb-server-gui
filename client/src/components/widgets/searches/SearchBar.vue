<template>
    <div class="pa-6" :class="{ 'pt-0': dense }">
        <v-row align="start">
            <v-col
                cols="12"
                :md="hasDate ? 3 : 4"
                class="d-flex flex-column ga-2"
            >
                <span
                    class="text-caption text-medium-emphasis text-uppercase font-weight-medium"
                >
                    {{ $t(searchTitle ?? "general.searchTitle") }}
                </span>
                <SearchBox
                    :model-value="modelValue"
                    :search-text="searchText"
                    @update:model-value="emit('update:modelValue', $event)"
                    @search="emit('search')"
                    @clear="emit('clear')"
                />
            </v-col>

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
                    density="compact"
                    @update:model-value="emit('update:dateValue', $event)"
                />
            </v-col>

            <v-col cols="12" :md="filtersColMd" class="d-flex flex-column ga-3">
                <v-expand-transition>
                    <FiltersBar
                        v-if="expanded"
                        :sections="filterSections"
                        :model-value="filterValues"
                        @update:model-value="
                            emit('update:filterValues', $event)
                        "
                    />
                </v-expand-transition>

                <v-expand-transition>
                    <div v-if="!expanded && activePills.length > 0">
                        <div class="d-flex align-center ga-2 mb-2">
                            <span
                                class="text-caption text-medium-emphasis text-uppercase font-weight-medium"
                            >
                                {{ $t("general.activeFilters") }}
                            </span>
                            <v-chip
                                size="x-small"
                                color="primary"
                                variant="flat"
                            >
                                {{ activePills.length }}
                            </v-chip>
                        </div>
                        <div class="d-flex flex-wrap ga-2">
                            <v-chip
                                v-for="pill in activePills"
                                :key="`${pill.sectionKey}-${pill.option.value}`"
                                size="small"
                                :color="pill.option.color ?? 'primary'"
                                variant="tonal"
                                closable
                                class="font-weight-medium"
                                @click:close="clearFilter(pill.sectionKey)"
                            >
                                {{ pill.option.label }}
                            </v-chip>
                        </div>
                    </div>
                </v-expand-transition>

                <v-btn
                    v-if="filterSections.length > 1"
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
            <v-col
                v-if="hasActions"
                cols="12"
                md="2"
                class="d-flex flex-column ga-2"
            >
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
            </v-col>
        </v-row>
        <v-divider class="my-4" />

        <v-row>
            <v-col
                cols="12"
                :md="hasDate ? 3 : 4"
                class="d-flex flex-column ga-2"
            >
                <div class="d-flex align-center ga-2">
                    <v-btn
                        v-if="clearAllCount > 0"
                        variant="text"
                        color="primary"
                        size="small"
                        class="text-none"
                        @click="clearFilters"
                    >
                        <v-icon start>mdi-close</v-icon>
                        {{ $t("general.clearAll") }}
                        <v-chip
                            size="x-small"
                            color="primary"
                            variant="tonal"
                            class="ms-2"
                        >
                            {{ clearAllCount }}
                        </v-chip>
                    </v-btn>
                    <v-spacer />
                    <ConfirmButton
                        text="general.searchButton"
                        :disabled="searchDisabled"
                        @click="onSearch"
                    />
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import SearchBox from "@/components/widgets/SearchBox.vue";
import DatePicker from "@/components/widgets/DatePicker.vue";
import ConfirmButton from "@/components/widgets/ConfirmButton.vue";
import FiltersBar from "@/components/widgets/filters/FiltersBar.vue";
import type {
    FilterOption,
    FilterSectionDef,
} from "@/components/widgets/filters/filterTypes.ts";
import type { TableFilters } from "@/components/widgets/entity-table/types.ts";
import type { SearchBarAction } from "./types.ts";

const props = withDefaults(
    defineProps<{
        modelValue: string | null;
        searchText: string;
        filterSections: FilterSectionDef[];
        filterValues: TableFilters;
        searchTitle?: string;
        dateTitle?: string;
        dateValue?: Date | null;
        actions?: SearchBarAction[];
        dense?: boolean;
    }>(),
    //@TODO Andrei change
    {
        actions: () => [],
        searchTitle: "general.searchTitle",
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
}>();

const expanded = ref(true);

// The date picker is shown iff a dateTitle is provided.
const hasDate = computed(() => !!props.dateTitle);

// TODO: extend actions API (per-action disabled state, colors, tooltips) when first call site arrives.
const hasActions = computed(() => props.actions.length > 0);

const filtersColMd = computed(() => {
    if (hasActions.value) return hasDate.value ? 5 : 6;
    return hasDate.value ? 7 : 8;
});

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

function clearFilter(key: string) {
    emit("update:filterValues", { ...props.filterValues, [key]: null });
}
</script>
