import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  optimizeDeps: {},
  server: {
    allowedHosts: ["localhost"],
    proxy: {
      "/api/storage": {
        target: "https://paste.maerchen.dev",
        changeOrigin: true,
      },
      "/api": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
    },
  },
});
