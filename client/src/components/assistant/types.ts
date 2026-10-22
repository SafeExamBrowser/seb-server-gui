export type AssistantRole = "user" | "assistant";

export type AssistantChatContext = {
    pageTestId?: string;
    pageTitle?: string;
    roles?: string[];
};

export type AssistantChatResponse = {
    answer: string;
    sources: string[];
    guide?: string;
    calls: string[];
};

export type AssistantEntry = {
    id: number;
    role: AssistantRole;
    text: string;
    sources: string[];
    calls: string[];
    guide?: string;
    feedback?: "up" | "down";
};

export type AssistantFeedback = {
    rating: "up" | "down";
    question: string;
    answer: string;
    sources: string[];
};
