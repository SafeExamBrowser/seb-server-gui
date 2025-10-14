<template>
    <v-container class="ma-0 pa-0">
        <!-- TODO @alain: i18n (subtitle) -->
        <v-row>
            <v-col>
                <SectionSubtitle name="SPS settings" />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <Form :fields="formFields" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { useFormFields } from "./composables/useFormFields";

const { formFields } = useFormFields();
</script>
