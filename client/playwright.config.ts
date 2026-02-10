import { defineConfig, devices } from "@playwright/test";

const isCI = !!process.env.CI;

const baseURL = process.env.BASE_URL || "https://ralphina.ethz.ch";

const ignoreHTTPSErrors = process.env.E2E_IGNORE_HTTPS_ERRORS === "true";

const outputDir = process.env.E2E_OUTPUT_DIR || "test-results";
const reportDir = process.env.E2E_REPORT_DIR || "playwright-report";

const reporters = isCI
    ? [["line"], ["html", { outputFolder: reportDir, open: "never" }]]
    : [["html", { outputFolder: reportDir, open: "never" }]];

export default defineConfig({
    testDir: "tests/e2e",
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    workers: isCI ? 1 : undefined,

    reporter: reporters,

    outputDir,

    use: {
        baseURL,
        trace: "on",
        ignoreHTTPSErrors,
        contextOptions: {
            javaScriptEnabled: true,
        },
    },

    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
    ],
});
