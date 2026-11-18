// Browser state (localStorage with the auth tokens) of the logged-in server admin.
// Written once per run by auth.setup.ts and loaded by the e2e fixtures.
export const SERVER_ADMIN_STORAGE_STATE = "playwright/.auth/server-admin.json";

export const LOGGED_OUT_STORAGE_STATE = { cookies: [], origins: [] };
