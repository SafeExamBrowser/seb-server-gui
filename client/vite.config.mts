import Fonts from "unplugin-fonts/vite";
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        resolve: {
            alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
        },

        plugins: [
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
        ],

        define: { "process.env": {} },

        ssr: {
            noExternal: ["vuetify"],
        },

        server: {
            port: 8082,
            proxy: {
                "/api": {
                    target: "http://localhost:3001",
                    changeOrigin: true, // TODO @alain: this may not be needed?
                },
            },
        },
    });
};
