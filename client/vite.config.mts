import Fonts from "unplugin-fonts/vite";
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { z } from "zod";

export const parseEnv = () => {
    const envResult = z
        .object({
            VITE_DEV_API_SERVER_TARGET: z.url(),
        })
        .safeParse(process.env);

    if (!envResult.success) {
        console.error("Invalid environment variables:");
        console.error(JSON.stringify(z.treeifyError(envResult.error), null, 2));
        process.exit(1);
    }

    return envResult.data;
};

export default ({ mode, command }) => {
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
            ...(command === "serve"
                ? {
                      proxy: {
                          "/api": {
                              target: parseEnv().VITE_DEV_API_SERVER_TARGET,
                          },
                      },
                  }
                : {}),
        },
    });
};
