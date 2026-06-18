/* global console, process */
// Validated environment for the OpenAPI codegen scripts, modeled on the
// fe-server's env.ts. Only `npm run openapi:*` needs these variables — the
// built app (e.g. running via Docker) never does.

import { z } from "zod";

const envSchema = z.object({
    SEB_SERVER_OPENAPI_URL: z.url(),
});

export const parseEnv = () => {
    try {
        process.loadEnvFile();
    } catch {
        // no .env file — fall back to the shell environment
    }

    const envResult = envSchema.safeParse(process.env);

    if (!envResult.success) {
        console.error(
            "Invalid environment variables (set them in client/.env, see .env.example):",
        );
        console.error(JSON.stringify(z.treeifyError(envResult.error), null, 2));
        process.exit(1);
    }

    return envResult.data;
};
