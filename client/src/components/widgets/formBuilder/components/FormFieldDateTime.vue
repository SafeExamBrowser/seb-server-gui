<template>
    <v-row>
        <v-col>
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

        <v-col>
            <v-text-field
                v-if="model?.time"
                :model-value="model.time"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                max-width="200"
                variant="outlined"
                density="compact"
                @update:focused="updateValidation"
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
import { DateTime, FormFieldBaseProperties } from "../types";
import { ref } from "vue";

const model = defineModel<DateTime>();
const showMenu = ref(false);

const props = defineProps<{
    standardProperties: FormFieldBaseProperties;
}>();

function updateValidation(focus: boolean) {
    if (!focus) {
        //console.info("****** val:" );
        // TODO @anhefti @ahorner: I would like to get the input reference to the v-date-input here
        //      tryed many things but nothing works!!! Once we have the rev we can call validate on
        //      it to apply date validation also when time is changed
        // if (props.standardProperties.ref) {
        //     const what = props.standardProperties.ref!.valueOf() ;
        //     what.validate();
        // }
        // if (dateInputRef.value) {
        //     const nodeRef = dateInputRef.value as VInput
        //     nodeRef.validate();
        // }
    }
}
</script>
