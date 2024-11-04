export default defineNuxtConfig({
	devtools: { enabled: false },
	ssr: false,
	modules: ["@nuxt/ui"],

	css: ["@/assets/main.css"],
	app: {
		head: {
			title: "My Nuxt App",
			meta: [
				{
					name: "description",
					content: "Awesome Nuxt app",
				},
				{
					name: "viewport",
					content:
						"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
				},
			],
		},
	},
});
