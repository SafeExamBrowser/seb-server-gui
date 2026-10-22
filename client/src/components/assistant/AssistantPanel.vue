<template>
    <v-card
        class="d-flex flex-column rounded-lg h-100"
        data-testid="assistant-panel"
        elevation="1"
    >
        <div class="d-flex align-center pa-4 pb-2 ga-2">
            <v-icon color="primary" icon="mdi-creation" size="small" />
            <span class="text-title-medium font-weight-bold">
                {{ $t("assistant.title") }}
            </span>
            <v-chip color="primary" density="comfortable" size="x-small">
                {{ $t("assistant.aiChip") }}
            </v-chip>
            <v-spacer />
            <v-btn
                :aria-label="$t('assistant.newConversation')"
                data-testid="assistant-new-conversation-button"
                density="comfortable"
                icon="mdi-chat-plus-outline"
                size="small"
                variant="text"
                @click="handleNewConversation"
            />
            <v-btn
                :aria-label="$t('assistant.close')"
                data-testid="assistant-close-button"
                density="comfortable"
                icon="mdi-close"
                size="small"
                variant="text"
                @click="handleClose"
            />
        </div>

        <div class="px-4 pb-2 text-body-small text-medium-emphasis">
            {{ contextLine }}
        </div>

        <v-divider />

        <div
            ref="messageListElement"
            class="flex-1-1-0 overflow-y-auto pa-4 d-flex flex-column ga-3"
            :style="{ minHeight: 0 }"
        >
            <template v-if="assistantStore.messages.length === 0">
                <div
                    class="bg-surface border-sm rounded-lg pa-3"
                    data-testid="assistant-welcome"
                >
                    <div class="text-body-medium font-weight-bold">
                        {{ $t("assistant.welcomeNotice") }}
                    </div>
                    <div class="text-body-small text-medium-emphasis mt-1">
                        {{ $t("assistant.welcomeHint") }}
                    </div>
                </div>
                <v-btn
                    v-for="suggestion in suggestions"
                    :key="suggestion"
                    class="text-none justify-start"
                    data-testid="assistant-suggestion"
                    size="small"
                    variant="outlined"
                    @click="handleSuggestion(suggestion)"
                >
                    {{ suggestion }}
                </v-btn>
            </template>

            <AssistantMessage
                v-for="entry in assistantStore.messages"
                :key="entry.id"
                :entry="entry"
            />

            <div
                v-if="assistantStore.isLoading"
                class="d-flex align-center ga-2 text-body-small text-medium-emphasis"
                data-testid="assistant-working"
            >
                <v-progress-circular indeterminate size="16" width="2" />
                {{ $t("assistant.working") }}
            </div>

            <div
                v-if="assistantStore.hasError"
                class="text-body-small text-error"
                data-testid="assistant-error"
            >
                {{ $t("assistant.error") }}
            </div>
        </div>

        <v-divider />

        <div class="pa-3">
            <div class="d-flex align-end ga-2">
                <v-textarea
                    v-model="draft"
                    auto-grow
                    density="compact"
                    data-testid="assistant-input"
                    hide-details
                    max-rows="4"
                    :placeholder="$t('assistant.inputPlaceholder')"
                    rows="1"
                    variant="outlined"
                    @keydown.enter.exact.prevent="handleSend"
                />
                <v-btn
                    :aria-label="$t('assistant.send')"
                    color="primary"
                    data-testid="assistant-send-button"
                    :disabled="assistantStore.isLoading"
                    icon="mdi-send"
                    size="small"
                    @click="handleSend"
                />
            </div>
            <div class="text-body-small text-medium-emphasis mt-2">
                {{ $t("assistant.disclaimer") }}
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import {
    VBtn,
    VCard,
    VChip,
    VDivider,
    VIcon,
    VProgressCircular,
    VSpacer,
    VTextarea,
} from "vuetify/components";

import { useCurrentUserQuery } from "@/composables/useCurrentUser";

import AssistantMessage from "./AssistantMessage.vue";
import { useAssistantStore } from "./composables/useAssistantStore";

const { t } = useI18n();
const route = useRoute();
const assistantStore = useAssistantStore();
const { data: currentUser } = useCurrentUserQuery();

const draft = ref("");
const messageListElement = ref<HTMLElement>();

const suggestions = computed(() => [
    t("assistant.suggestedQuitPassword"),
    t("assistant.suggestedRunningExams"),
    t("assistant.suggestedCreateExam"),
]);

const pageTitle = computed(() => {
    const titleKey = route.meta.titleKey;
    return titleKey === undefined ? route.path : t(titleKey);
});

const contextLine = computed(() =>
    t("assistant.context", {
        page: pageTitle.value,
        roles: (currentUser.value?.userRoles ?? []).join(", "),
    }),
);

const chatContext = () => ({
    pageTestId: route.meta.pageTestId,
    pageTitle: pageTitle.value,
    roles: currentUser.value?.userRoles ?? [],
});

watch(
    () => [assistantStore.messages.length, assistantStore.isLoading],
    async () => {
        await nextTick();
        messageListElement.value?.scrollTo({
            top: messageListElement.value.scrollHeight,
        });
    },
);

async function handleSend() {
    const question = draft.value;
    draft.value = "";
    await assistantStore.ask(question, chatContext());
}

async function handleSuggestion(suggestion: string) {
    await assistantStore.ask(suggestion, chatContext());
}

function handleNewConversation() {
    assistantStore.resetConversation();
}

function handleClose() {
    assistantStore.close();
}
</script>
