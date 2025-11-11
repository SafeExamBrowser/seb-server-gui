<template>
    <v-text-field
        v-model="searchText"
        density="compact"
        hide-details
        prepend-inner-icon="mdi-magnify"
        clearable
        single-line
        variant="outlined"
        class="flex-grow-0 flex-shrink-0"
        :label="$t('createTemplateExam.steps.supervisors.fields.search.label')"
        :placeholder="
            $t('createTemplateExam.steps.supervisors.fields.search.placeholder')
        "
        @keydown.esc="handleKeyDownEsc"
    />
</template>

<script setup lang="ts">
const searchText = defineModel<string | undefined>();

const handleKeyDownEsc = () => {
    searchText.value = undefined;
};
</script>
