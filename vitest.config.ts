import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  resolve: {
    alias: {
      "@scoring": path.resolve(__dirname, "contexts/scoring"),
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    include: ["contexts/**/*.spec.ts"],
    environment: "node",
  },
})
