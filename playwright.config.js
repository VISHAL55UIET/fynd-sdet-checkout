const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './test',
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: true, // tumhara chalta server bhi chalega
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});