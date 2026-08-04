<template>
    <BoxActionButton
        icon="mdi-pencil"
        :label="$t('examDetail.boxes.sebKeys.edit')"
        @click="handleButtonEditClick"
    />

    <v-dialog v-model="dialogOpen" :max-width="thresholds.sm">
        <v-card>
            <v-card-title>
                {{ $t("examDetail.boxes.sebKeys.edit") }}
            </v-card-title>
            <!-- TODO @alain: replace the placeholder with the actual SEB keys editing UI once they are available -->
            <v-card-text>Not implemented yet</v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn @click="handleButtonCloseClick">
                    {{ $t("general.closeButton") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import {
    VBtn,
    VCard,
    VCardActions,
    VCardText,
    VCardTitle,
    VDialog,
    VSpacer,
} from "vuetify/components";

import BoxActionButton from "@/components/widgets/BoxActionButton.vue";

const { thresholds: thresholdsRef } = useDisplay();
const thresholds = computed(() => thresholdsRef.value);

const dialogOpen = ref(false);

const handleButtonEditClick = () => {
    dialogOpen.value = true;
};

const handleButtonCloseClick = () => {
    dialogOpen.value = false;
};
</script>
