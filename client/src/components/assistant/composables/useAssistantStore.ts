import { defineStore } from "pinia";
import { ref } from "vue";

import {
    getAssistantConfig,
    postAssistantChat,
    postAssistantFeedback,
} from "@/components/assistant/assistantService";
import type {
    AssistantChatContext,
    AssistantEntry,
} from "@/components/assistant/types";

export const useAssistantStore = defineStore("assistant", () => {
    const enabled = ref(false);
    const isOpen = ref(false);
    const isLoading = ref(false);
    const hasError = ref(false);
    const messages = ref<AssistantEntry[]>([]);

    let configLoaded = false;
    let nextEntryId = 0;

    const loadConfig = async () => {
        if (configLoaded) {
            return;
        }
        configLoaded = true;
        try {
            enabled.value = (await getAssistantConfig()).enabled;
        } catch {
            // feature flag off (404) or gateway unreachable: stay hidden
            enabled.value = false;
        }
    };

    const open = () => {
        isOpen.value = true;
    };

    const close = () => {
        isOpen.value = false;
    };

    const toggle = () => {
        isOpen.value = !isOpen.value;
    };

    const resetConversation = () => {
        messages.value = [];
        hasError.value = false;
        isLoading.value = false;
    };

    const ask = async (question: string, context?: AssistantChatContext) => {
        if (isLoading.value || question.trim().length === 0) {
            return;
        }
        hasError.value = false;
        messages.value.push({
            id: nextEntryId++,
            role: "user",
            text: question.trim(),
            sources: [],
            calls: [],
        });
        isLoading.value = true;
        try {
            const response = await postAssistantChat({
                messages: messages.value.slice(-6).map((entry) => ({
                    role: entry.role,
                    content: entry.text,
                })),
                context,
            });
            messages.value.push({
                id: nextEntryId++,
                role: "assistant",
                text: response.answer,
                sources: response.sources,
                calls: response.calls,
                guide: response.guide,
            });
        } catch {
            hasError.value = true;
        } finally {
            isLoading.value = false;
        }
    };

    const sendFeedback = async (entryId: number, rating: "up" | "down") => {
        const entry = messages.value.find(
            (candidate) => candidate.id === entryId,
        );
        if (entry === undefined || entry.feedback !== undefined) {
            return;
        }
        entry.feedback = rating;
        const question =
            messages.value.findLast(
                (candidate) =>
                    candidate.role === "user" && candidate.id < entryId,
            )?.text ?? "";
        try {
            await postAssistantFeedback({
                rating,
                question,
                answer: entry.text,
                sources: entry.sources,
            });
        } catch {
            // feedback is best effort; the thanks state stays either way
        }
    };

    return {
        enabled,
        isOpen,
        isLoading,
        hasError,
        messages,
        loadConfig,
        open,
        close,
        toggle,
        resetConversation,
        ask,
        sendFeedback,
    };
});
