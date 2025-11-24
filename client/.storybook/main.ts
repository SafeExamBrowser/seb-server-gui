import type { StorybookConfig } from "@storybook/vue3-vite";

//changed to work on docker
const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@chromatic-com/storybook",
        "@storybook/addon-docs",
        "@storybook/addon-onboarding",
        "@storybook/addon-a11y",
    ],
    framework: {
        name: "@storybook/vue3-vite",
        options: {},
    },
};

export default config;
