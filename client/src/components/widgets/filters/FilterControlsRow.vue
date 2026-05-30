<template>
    <div
        class="d-flex align-center flex-wrap ga-2 px-6 pt-4 pb-1"
        :data-testid="`${dataTestId}-controls`"
    >
        <v-btn
            :variant="open ? 'flat' : 'outlined'"
            :color="open ? 'primary' : undefined"
            class="text-none"
            :data-testid="`${dataTestId}-toggle-filters-button`"
            @click="emit('toggle')"
        >
            <v-icon
                start
                :icon="open ? 'mdi-chevron-left' : 'mdi-filter-variant'"
            />
            {{ open ? $t("general.hideFilters") : $t("general.filters") }}
            <v-chip
                v-if="pills.length > 0"
                size="x-small"
                :color="open ? 'white' : 'primary'"
                variant="flat"
                class="ms-2 font-weight-bold"
            >
                {{ pills.length }}
            </v-chip>
        </v-btn>

        <v-divider vertical class="align-self-stretch mx-1" />

        <template v-if="pills.length > 0">
            <span
                class="text-body-small text-medium-emphasis text-uppercase font-weight-medium"
            >
                {{ $t("general.activeFilters") }}
            </span>
            <v-chip
                v-for="pill in pills"
                :key="`${pill.sectionKey}-${pill.option.value}`"
                :color="pill.option.color ?? 'primary'"
                variant="tonal"
                closable
                class="font-weight-medium"
                :data-testid="`${dataTestId}-${pill.testIdSuffix}-active-pill`"
                @click:close="emit('remove', pill.sectionKey)"
            >
                {{ pill.option.label }}
            </v-chip>
            <v-btn
                variant="text"
                color="primary"
                size="small"
                class="text-none"
                :data-testid="`${dataTestId}-clear-all-button`"
                @click="emit('clearAll')"
            >
                {{ $t("general.clearAll") }}
            </v-btn>
        </template>
        <span v-else class="text-body-small text-medium-emphasis font-italic">
            {{ $t("general.noFiltersApplied") }}
        </span>
    </div>
</template>

<script setup lang="ts">
import type { ActiveFilterPill } from "./useActiveFilterPills.ts";

withDefaults(
    defineProps<{
        open: boolean;
        pills: ActiveFilterPill[];
        dataTestId?: string;
    }>(),
    { dataTestId: undefined },
);

const emit = defineEmits<{
    toggle: [];
    remove: [sectionKey: string];
    clearAll: [];
}>();
</script>
