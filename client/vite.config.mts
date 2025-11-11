import Components from "unplugin-vue-components/vite";
import Fonts from "unplugin-fonts/vite";
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { createHtmlPlugin } from "vite-plugin-html";

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },

        plugins: [
            Components({
                dts: "src/components.d.ts",
            }),

            Vue({
                template: { transformAssetUrls },
            }),

            Vuetify({
                autoImport: true,
                styles: {
                    configFile: "src/styles/settings.scss",
                },
            }),

            Fonts({
                google: {
                    families: [
                        {
                            name: "Roboto",
                            styles: "wght@100;300;400;500;700;900",
                        },
                    ],
                },
            }),

            VueI18nPlugin({
                include: fileURLToPath(
                    new URL("./src/i18n/locales/**", import.meta.url),
                ),
            }),

            createHtmlPlugin({
                inject: {
                    data: {
                        VITE_SUB_PATH:
                            mode === "development"
                                ? ""
                                : process.env.VITE_SUB_PATH,
                    },
                },
            }),
        ],

        define: { "process.env": {} },

        ssr: {
            noExternal: ["vuetify"],
        },

        server: {
            port: 8082,
        },

        base: getSubPath(),
    });

    function getSubPath() {
        if (
            process.env.VITE_SUB_PATH == null ||
            process.env.VITE_SUB_PATH === ""
        ) {
            return "/";
        }

        return process.env.VITE_SUB_PATH;
    }
};
