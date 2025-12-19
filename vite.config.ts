import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // For GitHub Pages: set to your repo name like '/repo-name/' or '/' for user/org pages
  const base = mode === "production" ? "/county-hr-dashboard/" : "/";

  return {
    base,
    server: {
      host: "::",
      port: 8080,
    },
    preview: {
      port: 4173,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
