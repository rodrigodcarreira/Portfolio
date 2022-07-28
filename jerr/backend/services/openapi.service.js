const Openapi = require("moleculer-auto-openapi");

module.exports = {
	name: "openapi",
	mixins: [Openapi],
	settings: {
		port: process.env.PORT || 5000,
		// all setting optional
		openapi: {
			info: {
				description: "API documentation for the JERR software",
				title: "JERR API Documentation",
			},
			tags: [
				// you tags
				//{ name: "auth", description: "My custom name" },
			],
			components: {
				// you auth
				securitySchemes: {
					BearerAuth: {
						type: "http",
						scheme: "bearer",
					},
				},
			},
		},
	},
};
