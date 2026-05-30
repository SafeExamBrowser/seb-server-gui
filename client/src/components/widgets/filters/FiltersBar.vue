<template>
    <div class="d-flex flex-column">
        <template
            v-for="(section, index) in nonEmptySections"
            :key="section.key"
        >
            <v-divider v-if="index > 0" class="my-1" />
            <FilterSection
                :title="section.title"
                :data-test-id="`${dataTestId}-${section.testIdSuffix ?? section.key}`"
            >
                <FilterRadioOption
                    v-for="option in section.options"
                    :key="option.value"
                    :label="option.label"
                    :color="option.color"
                    :selected="
                        (modelValue[section.key] ?? null) === option.value
                    "
                    :data-test-id="`${dataTestId}-${section.testIdSuffix ?? section.key}-option-${option.value}`"
                    @toggle="onToggle(section.key, option.value)"
                />
            </FilterSection>
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
        modelValue: Record<string, string | null>;
        dataTestId?: string;
    }>(),
    { dataTestId: undefined },
);

const emit = defineEmits<{
    "update:modelValue": [value: Record<string, string | null>];
}>();

const nonEmptySections = computed(() =>
    props.sections.filter((section) => section.options.length > 0),
);

function onToggle(key: string, value: string) {
    const current = props.modelValue[key] ?? null;
    emit("update:modelValue", {
        ...props.modelValue,
        [key]: current === value ? null : value,
    });
}
</script>
