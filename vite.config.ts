import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://tasks.aidevs.pl",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/qdrant": {
        target:
          "https://f55763e0-c61c-4948-a3a3-1b7a41cf466b.us-east4-0.gcp.cloud.qdrant.io:6333",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/qdrant/, ""),
      },
    },
  },
});
