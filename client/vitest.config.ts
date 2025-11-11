import { defineConfig, mergeConfig } from "vitest/config";
import { UserConfig } from "vite";

export default (async () => {
    const viteConfigExport = await import("./vite.config.mts");
    const baseViteConfig: UserConfig =
        typeof viteConfigExport.default === "function"
            ? viteConfigExport.default({ mode: "test" })
            : viteConfigExport.default;

    return mergeConfig(
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
})();
