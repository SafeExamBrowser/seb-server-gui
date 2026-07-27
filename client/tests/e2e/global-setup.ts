import type { FullConfig } from "@playwright/test";

// The suite runs against a fully mocked backend (see shared/mocks/mock-backend.ts),
// so the only real dependency is the dev server that serves the SPA itself.
export default async function globalSetup(config: FullConfig) {
    const baseURL =
        config.projects[0]?.use?.baseURL ?? "http://localhost:8082/";

    try {
        const response = await fetch(baseURL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
    } catch (error) {
        throw new Error(
            `e2e setup: the dev server at ${baseURL} is not reachable. ` +
                "Start it with `npm run dev` before running the e2e suite.",
            { cause: error },
        );
    }
}
