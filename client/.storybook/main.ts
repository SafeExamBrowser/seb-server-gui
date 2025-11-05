// /client/.storybook/main.ts
import { fileURLToPath, URL } from "node:url";
import vuetify from "vite-plugin-vuetify";
import type { StorybookConfig } from "@storybook/vue3-vite";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@chromatic-com/storybook",
        "@storybook/addon-docs",
        "@storybook/addon-onboarding",
        "@storybook/addon-a11y",
        "@storybook/addon-vitest",
    ],
    framework: { name: "@storybook/vue3-vite", options: {} },
    viteFinal: async (viteConfig) => {
        viteConfig.resolve ??= {};
        viteConfig.resolve.alias = {
            ...(viteConfig.resolve.alias || {}),
            "@": fileURLToPath(new URL("../src", import.meta.url)),
        };
        viteConfig.plugins = [...(viteConfig.plugins ?? []), vuetify()];
        return viteConfig;
    },
};
export default config;
