import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
    input: "./src/api/seb-server/openapi/seb-server.openapi.json",
    output: {
        clean: true,
        path: "./src/api/seb-server/generated/hey-api",
    },
    plugins: [
        "@hey-api/typescript",
        "@hey-api/sdk",
        {
            name: "@hey-api/client-axios",
            throwOnError: true,
        },
        {
            name: "@tanstack/vue-query",
            getQueryData: true,
            queryKeys: {
                tags: true,
            },
            setQueryData: true,
        },
        {
            name: "zod",
            compatibilityVersion: 4,
        },
    ],
});
