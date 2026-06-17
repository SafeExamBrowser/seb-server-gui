<template>
    <v-sheet
        color="surface"
        class="d-flex align-center ga-2 px-4 py-2 border-t"
    >
        <template v-if="!ask?.tag">
            <v-text-field
                v-model="model"
                class="flex-grow-1"
                variant="outlined"
                density="compact"
                hide-details
                :placeholder="
                    $t(
                        'monitoringDetails.monitoringASKDialog.grantKeyPlaceholder',
                    )
                "
                :aria-label="
                    $t(
                        'monitoringDetails.monitoringASKDialog.grantKeyPlaceholder',
                    )
                "
                data-testid="aks-grantKey-input"
            />
            <v-btn
                color="primary"
                variant="flat"
                data-testid="aks-grantKey-button"
                @click="emit('grant')"
            >
                {{ $t("monitoringDetails.monitoringASKDialog.grantKeyButton") }}
            </v-btn>
        </template>

        <v-btn
            v-else
            color="error"
            variant="outlined"
            data-testid="aks-removeGrant-button"
            @click="emit('remove')"
        >
            {{ $t("monitoringDetails.monitoringASKDialog.removeGrantButton") }}
        </v-btn>
    </v-sheet>
</template>

<script setup lang="ts">
import { EnrichedAsk } from "./types.ts";

defineProps<{
    ask: EnrichedAsk | undefined;
}>();

const model = defineModel<string>({ required: true });

const emit = defineEmits<{
    grant: [];
    remove: [];
}>();
</script>
