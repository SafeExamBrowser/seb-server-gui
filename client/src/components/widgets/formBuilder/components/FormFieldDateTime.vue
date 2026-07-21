<template>
    <v-row>
        <v-col cols="2/3">
            <v-date-input
                v-if="model?.date"
                v-model="model.date"
                v-bind="props.standardProperties"
                append-inner-icon="mdi-calendar"
                density="compact"
                display-date-format="dd.MM.yyyy"
                prepend-icon=""
                variant="outlined"
            />
        </v-col>

        <v-col cols="1/3">
            <v-text-field
                v-if="model?.time"
                :model-value="model.time"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                variant="outlined"
                density="compact"
            >
                <v-menu
                    v-model="showMenu"
                    :close-on-content-click="false"
                    activator="parent"
                    min-width="0"
                >
                    <v-time-picker
                        v-model="model.time"
                        format="24hr"
                    ></v-time-picker>
                </v-menu>
            </v-text-field>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref } from "vue";

import {
    DateTime,
    FormFieldBaseProperties,
} from "@/components/widgets/formBuilder/types";

const model = defineModel<DateTime>();
const showMenu = ref(false);

const props = defineProps<{
    standardProperties: FormFieldBaseProperties;
}>();
</script>
