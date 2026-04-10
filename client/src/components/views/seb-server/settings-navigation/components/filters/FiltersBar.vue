<template>
    <v-row class="align-start">
        <v-col cols="10">
            <v-row>
                <v-col v-for="section in sections" :key="section.key" cols="6">
                    <FilterSection
                        :title="section.title"
                        :options="section.options"
                        :model-value="modelValue[section.key] ?? null"
                        @update:model-value="
                            onSectionChange(section.key, $event)
                        "
                    />
                </v-col>
            </v-row>
        </v-col>

        <v-col cols="2" class="d-flex justify-end align-center">
            <v-btn
                variant="outlined"
                size="small"
                color="primary"
                class="text-none text-caption font-weight-medium"
                :style="{
                    visibility: hasActiveFilters ? 'visible' : 'hidden',
                }"
                @click="emit('clear')"
            >
                <v-icon start size="small">mdi-close</v-icon>
                {{ $t("general.clearFilters") }}
            </v-btn>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FilterSection from "./FilterSection.vue";
import type { FilterSectionDef } from "./filterTypes";

const props = defineProps<{
    sections: FilterSectionDef[];
    modelValue: Record<string, string | null>;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: Record<string, string | null>];
    clear: [];
}>();

const hasActiveFilters = computed(() =>
    props.sections.some((s) => !!props.modelValue[s.key]),
);

function onSectionChange(key: string, value: string | null) {
    emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>
