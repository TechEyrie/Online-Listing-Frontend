const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 20000,
    requestTimeout: 30000,
    pageLoadTimeout: 60000,
    viewportWidth: 1440,
    viewportHeight: 900,
    retries: { runMode: 1, openMode: 0 },
    env: {
      API_URL: process.env.CYPRESS_API_URL || 'http://127.0.0.1:5000/api',
    },
  },
});
