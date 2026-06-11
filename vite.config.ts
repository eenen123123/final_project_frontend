import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.BACKEND_URL || "http://localhost:8081";

  console.log("Backend URL:", backendUrl);

  return {
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
        "/api/test/kakao-pay": {
          target: backendUrl,
          changeOrigin: true,
        },
        "/api": {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
  };
});
