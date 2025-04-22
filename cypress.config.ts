import { clerkSetup } from '@clerk/testing/cypress'
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      if (!config.env.CLERK_SECRET_KEY) {
        process.env.CLERK_SECRET_KEY = config.env.CLERK_SECRET_KEY
        process.env.CLERK_PUBLISHABLE_KEY = config.env.CLERK_PUBLISHABLE_KEY
      }

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
