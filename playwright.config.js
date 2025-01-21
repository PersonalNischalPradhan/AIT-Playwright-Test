const { defineConfig } = require ('@playwright/test');

module.exports = defineConfig({
  timeout: 30000, // Global timeout for tests
  retries: 0,     // Retry failed tests
  use: {
    headless: false,        // Run tests in headless mode
    viewport: { width: 1280, height: 720 }, // Default viewport
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
    screenshot: 'only-on-failure', // Take screenshots only on test failure
    video: 'retain-on-failure',   // Record videos on failure
  },
  projects: [
    {
      name: 'Chromium',
      use: { browserName: 'chromium' },
    },
  /*  {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'WebKit',
      use: { browserName: 'webkit' },
    }, */
  ],
});
