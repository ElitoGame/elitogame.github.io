import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import { vritePlugin } from "@vrite/sdk/astro";
import { loadEnv } from "vite";

import tailwind from "@astrojs/tailwind";

const { VRITE_ACCESS_TOKEN, VRITE_CONTENT_GROUP_ID } = loadEnv(
	import.meta.env.MODE,
	process.cwd(),
	""
);

// https://astro.build/config
export default defineConfig({
	site: "https://elitogame.github.io",
	experimental: {
		viewTransitions: true,
	},
	integrations: [
		mdx(),
		sitemap(),
		solidJs(),
		tailwind(),
		vritePlugin({
			accessToken: VRITE_ACCESS_TOKEN,
			contentGroupId: VRITE_CONTENT_GROUP_ID,
		}),
	],
});
