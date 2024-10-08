import {defineConfig} from "vite";
import {resolve} from "path";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    plugins: [react(), svgr(
        {
            svgrOptions: {exportType: "default", ref: true, svgo: false, titleProp: true, icon: true},
            include: "**/*.svg",
        }
    )],

    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        watch: {
            // 3. tell vite to ignore watching `src-tauri`
            ignored: ["**/src-tauri/**"],
        },

        build: {
            rollupOptions: {
                input: {
                    main: resolve(__dirname, 'index.html'),
                    nested: resolve(__dirname, 'index_simulation.html'),
                },
            },
        },
    },
}));
