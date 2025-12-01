import type { StorybookConfig } from "@storybook/vue3-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
    framework: {
        name: "@storybook/vue3-vite",
        options: {},
    },
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@chromatic-com/storybook",
        "@storybook/addon-docs",
        "@storybook/addon-onboarding",
        "@storybook/addon-a11y",
    ],
    core: {
        builder: "@storybook/builder-vite",
    },
    async viteFinal(config_) {
        return mergeConfig(config_, {
            base: "/storybook/",
        });
    },
};

export default config;
