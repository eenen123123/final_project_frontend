import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.env": "({})",
    "process": '({ env: { NODE_ENV: "production" }, browser: true })',
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/editor-entry.tsx"),
      name: "TipTapEditor",
      fileName: "tiptap-editor",
      formats: ["iife"],
    },
    outDir: "dist-editor",
  },
});
