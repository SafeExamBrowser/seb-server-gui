<template>
    <div class="d-flex align-center mr-4">
        <v-btn-toggle
            class="mr-2"
            color="primary"
            density="comfortable"
            divided
            mandatory
            :model-value="languageToggle"
            @update:model-value="updateLanguageToggle"
        >
            <v-btn :value="0">EN</v-btn>
            <v-btn :value="1">DE</v-btn>
        </v-btn-toggle>

        <v-btn-toggle
            color="primary"
            density="comfortable"
            divided
            mandatory
            :model-value="themeToggle"
            @update:model-value="updateThemeToggle"
        >
            <v-btn :value="0" icon="mdi-weather-sunny" />
            <v-btn :value="1" icon="mdi-weather-night" />
        </v-btn-toggle>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    languageToggle: number;
    themeToggle: number;
}>();

const emit = defineEmits<{
    "update:languageToggle": [number];
    "update:themeToggle": [number];
}>();

function updateLanguageToggle(value: unknown) {
    if (value == null) return;
    emit("update:languageToggle", Number(value));
}

function updateThemeToggle(value: unknown) {
    if (value == null) return;
    emit("update:themeToggle", Number(value));
}
</script>
