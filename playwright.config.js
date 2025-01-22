const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 30000, // Global timeout for tests
  retries: 0, // Retry failed tests
  use: {
    headless: process.env.CI === 'true' ? true : false, // Set headless mode based on ci environment github/local
    viewport: { width: 1280, height: 720 }, // Default viewport
    ignoreHTTPSErrors: true, // Ignore HTTPS errors
    screenshot: 'only-on-failure', // Take screenshots only on test failure
    video: 'retain-on-failure', // Record videos on failure
  },
  projects: [
    {
      name: 'Chromium',
      use: { browserName: 'chromium' },
    },
    /* Uncomment if you want to include other browsers
    {
      name: 'Firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'WebKit',
      use: { browserName: 'webkit' },
    }, */
  ],
  reporter: [
    ['list'], // Default console reporter
    ['allure-playwright'], // Enable Allure reporting
  ],
});
