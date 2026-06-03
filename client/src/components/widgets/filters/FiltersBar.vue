<template>
    <div class="d-flex flex-column">
        <template v-for="section in nonEmptySections" :key="section.key">
            <FilterSection
                :title="section.title"
                :data-test-id="`${dataTestId}-${section.testIdSuffix ?? section.key}`"
            >
                <FilterOptionItem
                    v-for="option in section.options"
                    :key="option.value"
                    class="mb-1"
                    :label="option.label"
                    :color="option.color"
                    :multiple="section.multiple"
                    :selected="
                        isFilterValueSelected(
                            modelValue[section.key],
                            option.value,
                            section.multiple ?? false,
                        )
                    "
                    :data-test-id="`${dataTestId}-${section.testIdSuffix ?? section.key}-option-${option.value}`"
                    @toggle="handleToggle(section, option.value)"
                />
            </FilterSection>
            <v-divider class="my-1" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FilterSection from "./FilterSection.vue";
import FilterOptionItem from "./FilterOptionItem.vue";
import type { FilterSectionDef } from "./filterTypes.ts";
import { isFilterValueSelected, toggleFilterValue } from "./filterValues.ts";

const props = withDefaults(
    defineProps<{
        sections: FilterSectionDef[];
        modelValue: Record<string, string | undefined>;
        dataTestId?: string;
    }>(),
    { dataTestId: undefined },
);

const emit = defineEmits<{
    "update:modelValue": [value: Record<string, string | undefined>];
}>();

const nonEmptySections = computed(() =>
    props.sections.filter((section) => section.options.length > 0),
);

function handleToggle(section: FilterSectionDef, value: string) {
    emit("update:modelValue", {
        ...props.modelValue,
        [section.key]: toggleFilterValue(
            props.modelValue[section.key],
            value,
            section.multiple ?? false,
        ),
    });
}
</script>
