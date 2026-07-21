import Fonts from "unplugin-fonts/vite";
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { defineConfig, loadEnv, type ConfigEnv } from "vite";
import { fileURLToPath, URL } from "node:url";
import VueRouter from "vue-router/vite";

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

export default ({ mode, command }: ConfigEnv) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

    return defineConfig({
        resolve: {
            alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
        },

        plugins: [
            VueRouter({
                routesFolder: [
                    {
                        src: "src/pages",
                        filePatterns: ["**/index", "**/\\[*\\]", "**/\\(*\\)"],
                    },
                ],
            }),

            Vue({
                template: { transformAssetUrls },
            }),

            Vuetify({
                autoImport: true,
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
        ],

        define: { "process.env": {} },

        ssr: {
            noExternal: ["vuetify"],
        },

        server: {
            // this allows us to connect to the dev server from containers/VMs that connect over IPv4.
            host: true,
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
