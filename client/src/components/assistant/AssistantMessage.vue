<template>
    <div
        v-if="entry.role === 'user'"
        class="align-self-end bg-primary rounded-lg pa-3 text-body-medium"
        :style="{ maxWidth: '90%', whiteSpace: 'pre-line' }"
    >
        {{ entry.text }}
    </div>

    <div
        v-else
        class="align-self-start bg-surface border-sm rounded-lg pa-3 w-100"
        data-testid="assistant-answer"
    >
        <div class="text-body-medium" :style="{ whiteSpace: 'pre-line' }">
            {{ entry.text }}
        </div>

        <v-btn
            v-if="entry.guide !== undefined && hasGuide(entry.guide)"
            class="text-none mt-2"
            color="primary"
            data-testid="assistant-show-me-button"
            prepend-icon="mdi-cursor-default-click-outline"
            size="small"
            variant="tonal"
            @click="handleShowMe"
        >
            {{ $t("assistant.showMe") }}
        </v-btn>

        <div v-if="entry.sources.length > 0" class="mt-2">
            <div class="text-body-small text-medium-emphasis">
                {{ $t("assistant.sources") }}
            </div>
            <div class="d-flex flex-wrap ga-1 mt-1">
                <v-chip
                    v-for="source in entry.sources"
                    :key="source"
                    data-testid="assistant-source-chip"
                    density="comfortable"
                    size="x-small"
                >
                    {{ source }}
                </v-chip>
            </div>
        </div>

        <div v-if="entry.calls.length > 0" class="mt-2">
            <div class="text-body-small text-medium-emphasis">
                {{ $t("assistant.calls") }}
            </div>
            <div
                v-for="call in entry.calls"
                :key="call"
                class="text-body-small font-weight-medium"
            >
                {{ call }}
            </div>
        </div>

        <div class="d-flex align-center ga-1 mt-2">
            <template v-if="entry.feedback === undefined">
                <v-btn
                    :aria-label="$t('assistant.thumbsUp')"
                    data-testid="assistant-thumbs-up"
                    density="comfortable"
                    icon="mdi-thumb-up-outline"
                    size="x-small"
                    variant="text"
                    @click="handleThumbsUp"
                />
                <v-btn
                    :aria-label="$t('assistant.thumbsDown')"
                    data-testid="assistant-thumbs-down"
                    density="comfortable"
                    icon="mdi-thumb-down-outline"
                    size="x-small"
                    variant="text"
                    @click="handleThumbsDown"
                />
            </template>
            <span
                v-else
                class="text-body-small text-medium-emphasis"
                data-testid="assistant-feedback-thanks"
            >
                {{ $t("assistant.feedbackThanks") }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { VBtn, VChip } from "vuetify/components";

import { useAssistantGuide } from "./composables/useAssistantGuide";
import { useAssistantStore } from "./composables/useAssistantStore";
import type { AssistantEntry } from "./types";

const props = defineProps<{
    entry: AssistantEntry;
}>();

const assistantStore = useAssistantStore();
const { hasGuide, startGuide } = useAssistantGuide();

async function handleShowMe() {
    if (props.entry.guide !== undefined) {
        await startGuide(props.entry.guide);
    }
}

async function handleThumbsUp() {
    await assistantStore.sendFeedback(props.entry.id, "up");
}

async function handleThumbsDown() {
    await assistantStore.sendFeedback(props.entry.id, "down");
}
</script>
