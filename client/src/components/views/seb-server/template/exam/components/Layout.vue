<!-- TODO: consider moving this somewhere up in the component hierarchy so it can be reused on other pages -->
<template>
    <div class="fill-height d-flex flex-column">
        <v-row class="flex-grow-0">
            <v-col>
                <!-- TODO: create a reusable breadcrumb component -->
                Home > Create Exam > {{ stepName }}
            </v-col>
        </v-row>
        <v-row class="flex-grow-0">
            <v-col>
                <!-- TODO: create a reusable title component -->
                <h2 class="primary-text-color text-h4 font-weight-bold">
                    {{ translate("titles.createTemplateExam") }}
                </h2>
            </v-col>
        </v-row>
        <v-row class="flex-grow-1">
            <v-col cols="9">
                <v-card elevation="4" rounded="lg" class="fill-height">
                    <slot name="PanelMain"></slot>
                </v-card>
            </v-col>
            <v-col cols="3">
                <v-card elevation="4" rounded="lg" class="fill-height">
                    <slot name="PanelAside"></slot>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils";

defineProps<{
    stepName: string;
}>();
</script>
