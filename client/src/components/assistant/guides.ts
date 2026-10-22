import { typedTo } from "@/router/typedTo";

export type AssistantGuideStep = {
    element: string;
    titleKey: string;
    textKey: string;
    // route that must be open before this step's element exists
    route: ReturnType<typeof typedTo>;
};

export type AssistantGuide = {
    id: string;
    steps: AssistantGuideStep[];
};

const examListRoute = typedTo({ name: "/(app)/exam/" });
const examCreateRoute = typedTo({ name: "/(app)/exam/create/" });
const navigationOverviewRoute = typedTo({
    name: "/(app)/navigation-overview/",
});
const assessmentToolListRoute = typedTo({ name: "/(app)/assessment-tool/" });
const assessmentToolCreateRoute = typedTo({
    name: "/(app)/assessment-tool/create/",
});

export const ASSISTANT_GUIDES: Record<string, AssistantGuide> = {
    "create-exam": {
        id: "create-exam",
        steps: [
            {
                element: '[data-testid="layout-exam-button"]',
                titleKey: "assistant.guideCreateExam.step1Title",
                textKey: "assistant.guideCreateExam.step1Text",
                route: examListRoute,
            },
            {
                element: '[data-testid="exams-add-button"]',
                titleKey: "assistant.guideCreateExam.step2Title",
                textKey: "assistant.guideCreateExam.step2Text",
                route: examListRoute,
            },
            {
                element: '[data-testid="create-exam-assessment-tool-select"]',
                titleKey: "assistant.guideCreateExam.step3Title",
                textKey: "assistant.guideCreateExam.step3Text",
                route: examCreateRoute,
            },
            {
                element: '[data-testid="stepper-next-button"]',
                titleKey: "assistant.guideCreateExam.step4Title",
                textKey: "assistant.guideCreateExam.step4Text",
                route: examCreateRoute,
            },
        ],
    },
    "connect-moodle": {
        id: "connect-moodle",
        steps: [
            {
                element: '[data-testid="layout-navOverview-toggle"]',
                titleKey: "assistant.guideConnectMoodle.step1Title",
                textKey: "assistant.guideConnectMoodle.step1Text",
                route: navigationOverviewRoute,
            },
            {
                element: '[data-testid="assessmentTools-add-button"]',
                titleKey: "assistant.guideConnectMoodle.step2Title",
                textKey: "assistant.guideConnectMoodle.step2Text",
                route: assessmentToolListRoute,
            },
            {
                element:
                    '[data-testid="createAssessmentTool-main-form-field-lmsType"]',
                titleKey: "assistant.guideConnectMoodle.step3Title",
                textKey: "assistant.guideConnectMoodle.step3Text",
                route: assessmentToolCreateRoute,
            },
            {
                element: '[data-testid="createAssessmentTool-save-button"]',
                titleKey: "assistant.guideConnectMoodle.step4Title",
                textKey: "assistant.guideConnectMoodle.step4Text",
                route: assessmentToolCreateRoute,
            },
        ],
    },
};
