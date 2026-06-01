<template>
    <div class="d-flex flex-column">
        <template v-for="section in nonEmptySections" :key="section.key">
            <FilterSection
                :title="section.title"
                :data-test-id="`${dataTestId}-${section.testIdSuffix ?? section.key}`"
            >
                <FilterRadioOption
                    v-for="option in section.options"
                    :key="option.value"
                    class="mb-1"
                    :label="option.label"
                    :color="option.color"
                    :selected="modelValue[section.key] === option.value"
                    :data-test-id="`${dataTestId}-${section.testIdSuffix ?? section.key}-option-${option.value}`"
                    @toggle="onToggle(section.key, option.value)"
                />
            </FilterSection>
            <v-divider class="my-1" />
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FilterSection from "./FilterSection.vue";
import FilterRadioOption from "./FilterRadioOption.vue";
import type { FilterSectionDef } from "./filterTypes.ts";

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

function onToggle(key: string, value: string) {
    const current = props.modelValue[key] ?? undefined;
    emit("update:modelValue", {
        ...props.modelValue,
        [key]: current === value ? undefined : value,
    });
}
</script>
