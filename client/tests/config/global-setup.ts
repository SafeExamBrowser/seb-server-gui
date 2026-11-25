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
            `e2e setup: ${baseURL} is not reachable. ` +
                "Check BASE_URL, or unset it so Playwright starts the dev server.",
            { cause: error },
        );
    }
}
