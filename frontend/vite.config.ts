import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import tscPlugin from "vite-plugin-tsc";

// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
	const configBase = {
		// This changes the out put dir from dist to build
		// comment this out if that isn't relevant for your project
		build: {
			outDir: "build",
		},
		plugins: [
			react(),
			svgrPlugin({
				svgrOptions: {
					icon: true,
					// ...svgr options (https://react-svgr.com/docs/options/)
				},
			}),
		],
		server: {
			proxy: {
				"/socket.io": {
					target: "ws://localhost:8080",
					changeOrigin: true,
					ws: true,
				},
			},
		},
		clearScreen: false,
	};
	if (command === "serve") {
		configBase.plugins.push(
			tscPlugin({ tscCommand: "tsc --watch --preserveWatchOutput" })
		);
		return configBase;
	} else {
		// command === 'build'
		return configBase;
	}
});
