import { defineConfig, devices } from "@playwright/test";

const PORT = 5173;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e/tests",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  // Capped rather than left at the CPU count: a local `vite preview` server
  // is a single Node process, and pushing too many concurrent page loads at
  // it (this machine has 12 logical cores) exhausted local ephemeral ports
  // and made navigations hang instead of actually running faster.
  workers: 2,
  reporter: isCI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  // Only start a dev server automatically when no explicit base URL was
  // given (e.g. pointing tests at the Vercel deployment).
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        // A production preview build serves pre-bundled static assets, so it
        // stays responsive under the concurrent page loads a full parallel
        // test run throws at it - the dev server's per-request transform
        // pipeline does not hold up the same way.
        command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: 120_000,
        // Every test that touches the contact form mocks the EmailJS network
        // call directly (see e2e/utils/emailjs.ts), so these never need to be
        // real - they only need to be non-empty so the app takes the EmailJS
        // code path instead of its no-env-configured mailto fallback. This
        // keeps the suite hermetic: it never depends on a developer's local
        // .env or on real EmailJS credentials being present.
        env: {
          ...process.env,
          VITE_EMAILJS_SERVICE_ID: "test_service",
          VITE_EMAILJS_TEMPLATE_ID: "test_template",
          VITE_EMAILJS_PUBLIC_KEY: "test_public_key",
        },
      },

  projects: [
    {
      name: "chrome",
      // Launches the actual installed Google Chrome instead of Playwright's
      // bundled Chromium - closer to what real visitors run.
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      // Cross-browser check runs only the critical-path subset, not the full suite.
      grep: /@smoke/,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      grep: /@smoke/,
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 7"] },
      testMatch: /responsive\.spec\.ts/,
    },
    {
      name: "Tablet",
      use: { ...devices["iPad Mini"] },
      testMatch: /responsive\.spec\.ts/,
    },
  ],
});
