import "driver.js/dist/driver.css";

import { driver } from "driver.js";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import {
    ASSISTANT_GUIDES,
    type AssistantGuideStep,
} from "@/components/assistant/guides";

const waitForElement = async (selector: string) => {
    for (let attempt = 0; attempt < 50; attempt++) {
        if (document.querySelector(selector) !== null) {
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
};

export const useAssistantGuide = () => {
    const router = useRouter();
    const { t } = useI18n();

    const hasGuide = (guideId: string) => guideId in ASSISTANT_GUIDES;

    const ensureStepReachable = async (step: AssistantGuideStep) => {
        if (document.querySelector(step.element) === null) {
            await router.push(step.route);
        }
        await waitForElement(step.element);
    };

    const startGuide = async (guideId: string) => {
        const guide = ASSISTANT_GUIDES[guideId];
        if (guide === undefined) {
            return;
        }

        const guideDriver = driver({
            showProgress: true,
            allowClose: true,
            overlayOpacity: 0.4,
            nextBtnText: t("assistant.guideNext"),
            prevBtnText: t("assistant.guideBack"),
            doneBtnText: t("assistant.guideDone"),
            steps: guide.steps.map((step, index) => ({
                element: step.element,
                popover: {
                    title: `${index + 1} · ${t(step.titleKey)}`,
                    description: t(step.textKey),
                },
            })),
            onNextClick: async () => {
                const activeIndex = guideDriver.getActiveIndex() ?? 0;
                const nextStep = guide.steps[activeIndex + 1];
                if (nextStep === undefined) {
                    guideDriver.destroy();
                    return;
                }
                await ensureStepReachable(nextStep);
                guideDriver.moveNext();
            },
            onPrevClick: async () => {
                const activeIndex = guideDriver.getActiveIndex() ?? 0;
                const previousStep = guide.steps[activeIndex - 1];
                if (previousStep === undefined) {
                    return;
                }
                await ensureStepReachable(previousStep);
                guideDriver.movePrevious();
            },
        });

        await ensureStepReachable(guide.steps[0]);
        guideDriver.drive();
    };

    return { hasGuide, startGuide };
};
