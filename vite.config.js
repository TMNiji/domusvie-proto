import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages serves project sites under /<repo>/.
  // This ensures built asset URLs are prefixed correctly.
  base: "/domusvie-proto/",
  plugins: [react()],
  build: {
    // For GitHub Pages "Deploy from a branch", set Pages to main /docs.
    outDir: "docs",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: false
  }
});

