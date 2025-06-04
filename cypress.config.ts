import { clerkSetup } from '@clerk/testing/cypress'
import { defineConfig } from "cypress";

export default defineConfig({
  defaultCommandTimeout: 15000,
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      if (!process.env.CLERK_SECRET_KEY) {
        process.env.CLERK_SECRET_KEY = config.env.CLERK_SECRET_KEY
        process.env.CLERK_PUBLISHABLE_KEY = config.env.CLERK_PUBLISHABLE_KEY
      }

      // Firefox has stricter cookie policies than the other browsers. This settings is only needed
      // because we are not using https in the tests which has an impact on clerk cookies.
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'firefox') {
          launchOptions.preferences['network.cookie.sameSite.noneRequiresSecure'] = false;
          launchOptions.preferences['network.cookie.sameSite.laxByDefault'] = false;
          return launchOptions;
        }
      });

      return clerkSetup({ config })
    },
  },
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
