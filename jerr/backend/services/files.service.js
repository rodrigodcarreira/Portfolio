"use strict";
const fs = require("fs");
const crypto = require("crypto");

module.exports = {
	name: "files",
	settings: {
		base_url: "./assets/", //url base de onde se gravam os ficheiros
	},
	actions: {
		exists: {
			params: {
				filename: "string",
			},
			async handler(ctx) {
				return fs.existsSync(ctx.params.filename);
			},
		},
		delete: {
			params: {
				filename: "string",
			},
			async handler(ctx) {
				return fs.unlinkSync(ctx.params.filename);
			},
		},
		getContent: {
			async handler(ctx) {
				return await this.storage.get(
					ctx.params.filename,
					ctx.params.encoding
				);
			},
		},
		create: {
			async handler(ctx) {
				const fileExt = ctx.meta.filename.split(".").pop();
				const fileName = crypto.randomUUID() + "." + fileExt;

				await ctx.params.pipe(
					fs.createWriteStream(this.settings.base_url + fileName)
				);
				return fileName;
			},
		},
	},
};
