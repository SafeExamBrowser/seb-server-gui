import {
    defineConfig,
    devices,
    type ReporterDescription,
} from "@playwright/test";

const isCI = !!process.env.CI;

const baseURL = process.env.BASE_URL || "http://localhost:8082/";

// Without BASE_URL, Playwright starts the app itself: locally the dev server (or reuses one that's
// already running), on CI a production build served by vite preview, which loads pages much faster
// and tests what ships. The build skips the typecheck, the client job runs it. The backend is
// mocked, so the proxy target only has to be a valid URL.
const webServer = process.env.BASE_URL
    ? undefined
    : {
          command: isCI
              ? "npx vite build --sourcemap && npx vite preview --port 8082 --strictPort"
              : "npm run dev",
          url: baseURL,
          reuseExistingServer: !isCI,
          env: { VITE_DEV_API_SERVER_TARGET: "http://localhost:3001" },
      };

const ignoreHTTPSErrors = process.env.E2E_IGNORE_HTTPS_ERRORS === "true";

const outputDir = process.env.E2E_OUTPUT_DIR || "test-results";
const reportDir = process.env.E2E_REPORT_DIR || "playwright-report";

const reporters: ReporterDescription[] = isCI
    ? [["line"], ["html", { outputFolder: reportDir, open: "never" }]]
    : [["html", { outputFolder: reportDir, open: "never" }]];

export default defineConfig({
    testDir: "tests",
    globalSetup: "./tests/config/global-setup.ts",
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    workers: isCI ? 4 : undefined, // the runners have 4 vCPUs, and vite preview needs almost none

    // timeout: 10_000,

    reporter: reporters,

    webServer,

    outputDir,

    use: {
        baseURL,
        trace: "on-first-retry",
        ignoreHTTPSErrors,
        contextOptions: {
            javaScriptEnabled: true,
        },
    },

    // Chromium only, locally and in CI.
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"] }},
        { name: "setup", testMatch: /auth\.setup\.ts/ },
    ]
    ,
});
