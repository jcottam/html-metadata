import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    // Mock fetch for Node.js environment
    setupFiles: ["./tests/setup.ts"],
  },
})
