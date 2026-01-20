import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "https://online-video-player-frontend-171j.vercel.app",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
