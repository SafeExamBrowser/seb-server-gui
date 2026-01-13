import type { StorybookConfig } from "@storybook/vue3-vite";

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

    async viteFinal(config) {
        return config;
    },
};

export default config;
