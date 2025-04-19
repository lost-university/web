import { clerkSetup } from '@clerk/testing/cypress'
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    setupNodeEvents(on, config) {
      // implement node event listeners here
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
