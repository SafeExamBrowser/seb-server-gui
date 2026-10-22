import * as apiService from "@/services/apiService";

import type {
    AssistantChatContext,
    AssistantChatResponse,
    AssistantFeedback,
    AssistantRole,
} from "./types";

const baseUrl = "/assistant";

export const getAssistantConfig = async (): Promise<{ enabled: boolean }> =>
    (
        await apiService.getRequest({
            url: `${baseUrl}/config`,
            options: {
                _skipErrorToast: true,
            },
        })
    ).data;

export const postAssistantChat = async (payload: {
    messages: { role: AssistantRole; content: string }[];
    context?: AssistantChatContext;
}): Promise<AssistantChatResponse> =>
    (
        await apiService.postRequest({
            url: `${baseUrl}/chat`,
            data: payload,
            options: {
                _authType: "seb",
                _skipErrorToast: true,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        })
    ).data;

export const postAssistantFeedback = async (
    payload: AssistantFeedback,
): Promise<void> => {
    await apiService.postRequest({
        url: `${baseUrl}/feedback`,
        data: payload,
        options: {
            _authType: "seb",
            _skipErrorToast: true,
            headers: {
                "Content-Type": "application/json",
            },
        },
    });
};
