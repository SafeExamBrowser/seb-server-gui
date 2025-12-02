<template>
    <v-color-input
        v-model="model"
        v-bind="standardProperties"
        mode="hex"
        pip-location="append-inner"
        color-pip
        @keydown="handleColorInputKeydown"
    >
    </v-color-input>
</template>

<script setup lang="ts">
// TODO @alain: the "close" and "ok" buttons don't work with keyboard navigation. This is an issue of Vuetify itself (https://github.com/vuetifyjs/vuetify/issues/19872). Follow-up on the bug report.
import { FormFieldBaseProperties, FormFieldTextualProperties } from "../types";

const model = defineModel<string | undefined>();

defineProps<{
    // field: FormField & { type: "color" };
    standardProperties: FormFieldBaseProperties & FormFieldTextualProperties;
}>();

const allowColorInputKeydown = (e: KeyboardEvent) => {
    // allow basic navigation
    if (["Enter", "Escape", "Tab"].includes(e.key)) {
        return true;
    }

    // allow copy to clipboard
    if (["KeyC"].includes(e.code) && (e.ctrlKey || e.metaKey)) {
        return true;
    }

    return false;
};

const handleColorInputKeydown = (e: KeyboardEvent) => {
    // This ensures, that basic keyboard navigation & copying to the clipboard works while not allowing the user to type in the input field itself.
    // This is not ideal, but it's the only way I found to make the color input `readonly` while still allowing the color picker to be opened.
    if (!allowColorInputKeydown(e)) {
        e.preventDefault();
    }
};
</script>
