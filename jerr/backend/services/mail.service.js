"use strict";

const MailService = require("moleculer-mail");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: "mail",
	mixins: [MailService],
	settings: {
		from: "JERR <noreply@jerr.pt>",
		transport: {
			host: process.env.EMAIL_HOST || "smtp.ethereal.email",
			port: process.env.EMAIL_PORT || 587,
			auth: {
				user:
					process.env.EMAIL_USERNAME ||
					"lottie.halvorson47@ethereal.email",
				pass: process.env.EMAIL_PASSWORD || "Xy9Kax7gvGBhhZ3Qdm",
			},
		},
		templateFolder: "./backend/templates/mail",
		i18n: {
			locales: ["en", "pt"],
		},
		data: {
			site: {
				//TODO: Use global settings
				url: process.env.SITE_URL || "http://localhost:3000",
				name: "JERR",
			},
		},
	},
};
