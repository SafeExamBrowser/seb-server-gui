<!-- TODO @alain: this could become a generally reusable component, it's not limited to the exam template -->
<template>
    <v-form class="w-100 w-md-50" @submit.prevent>
        <v-container fluid class="pa-0">
            <v-row
                v-for="field in fields"
                :key="field.name"
                :field="field"
                dense
            >
                <v-col>
                    <v-text-field
                        v-if="field.type === 'text'"
                        v-model="field.model.value"
                        :label="field.label"
                        :placeholder="field.placeholder"
                        variant="outlined"
                        required
                    >
                    </v-text-field>
                    <v-textarea
                        v-else-if="field.type === 'textarea'"
                        v-model="field.model.value"
                        :label="field.label"
                        :placeholder="field.placeholder"
                        :rows="4"
                        variant="outlined"
                        required
                    >
                    </v-textarea>
                    <v-select
                        v-else-if="field.type === 'select'"
                        v-model="field.model.value"
                        :label="field.label"
                        :placeholder="field.placeholder"
                        :items="field.options"
                        item-title="text"
                        item-value="value"
                        variant="outlined"
                        required
                    >
                    </v-select>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script setup lang="ts">
import { FormField } from "./types";

defineProps<{
    fields: FormField[];
}>();
</script>
