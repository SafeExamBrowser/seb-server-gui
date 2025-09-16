<!-- TODO: consider moving this somewhere up in the component hierarchy so it can be reused on other pages -->
<template>
    <div class="fill-height d-flex flex-column">
        <v-row class="flex-grow-0">
            <v-col>
                <Breadcrumb
                    :items="[
                        {
                            label: $t('titles.createTemplate'),
                            link: constants.CREATE_EXAM_TEMPLATE_ROUTE,
                        },
                        { label: stepName },
                    ]"
                />
            </v-col>
        </v-row>
        <v-row class="flex-grow-0">
            <v-col>
                <PageTitle :title="$t('titles.createTemplateExam')" />
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
import * as constants from "@/utils/constants";

defineProps<{
    stepName: string;
}>();
</script>
