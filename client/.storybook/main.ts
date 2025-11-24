import type { StorybookConfig } from "@storybook/vue3-vite";

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

    staticDirs: ["../public"],

    viteFinal: async (viteConfig) => {
        viteConfig.base = "/seb-server-gui-storybook/";
        return viteConfig;
    },
};

export default config;
