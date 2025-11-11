import { defineConfig, mergeConfig } from "vitest/config";
import viteConfigExport from "./vite.config.mts";
import { UserConfig } from "vite";

const baseViteConfig: UserConfig =
    typeof viteConfigExport === "function"
        ? viteConfigExport({ mode: "test" })
        : (viteConfigExport as UserConfig);

export default mergeConfig(
    baseViteConfig,
    defineConfig({
        test: {
            name: "unit",
            environment: "jsdom",
            globals: true,
            include: ["tests/unit/**/*.{test,spec}.{ts,tsx,js}"],
            exclude: ["node_modules", "dist", "**/*.stories.*"],
        },
    }),
);
