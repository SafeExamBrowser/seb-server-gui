import type { FullConfig } from "@playwright/test";

const SEED_USERNAME = "testmain";
const SEED_PASSWORD = "testmain";

// The suite assumes the seb-server e2e Flyway seed (V200): testmain must be a
// SEB_SERVER_ADMIN. The seed account can drift (e.g. edited through the GUI
// during manual testing), which fails dozens of specs in confusing ways -
// fail fast with a clear message instead.
export default async function globalSetup(config: FullConfig) {
    const baseURL =
        config.projects[0]?.use?.baseURL ?? "http://localhost:8082/";

    const tokenResponse = await fetch(new URL("/api/oauth/token", baseURL), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "password",
            username: SEED_USERNAME,
            password: SEED_PASSWORD,
        }),
    });
    if (!tokenResponse.ok) {
        throw new Error(
            `e2e seed check: login as '${SEED_USERNAME}' failed with HTTP ${tokenResponse.status}. ` +
                "Is the backend running with the e2e Flyway seed (V200)?",
        );
    }

    const { access_token: accessToken } = (await tokenResponse.json()) as {
        access_token: string;
    };
    const meResponse = await fetch(
        new URL("/api/admin-api/v1/useraccount/me", baseURL),
        { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    const me = (await meResponse.json()) as { userRoles?: string[] };

    if (!me.userRoles?.includes("SEB_SERVER_ADMIN")) {
        throw new Error(
            `e2e seed check: '${SEED_USERNAME}' has roles [${(me.userRoles ?? []).join(", ")}] ` +
                "but the suite requires SEB_SERVER_ADMIN (Flyway seed V200 gives it all roles). " +
                "The seed account has drifted - restore its roles (or wipe the DB volume and " +
                "restart the backend for a fresh seed) before running the suite.",
        );
    }
}
