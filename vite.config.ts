import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      // Symlinked public/data points outside the project root; allow it.
      allow: [".."],
    },
  },
});
