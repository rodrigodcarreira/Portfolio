"use strict";

//Creditos obtido em: https://github.com/icebob/kantab/blob/master/backend/mixins/i18next.mixin.js

const _ = require("lodash");
const path = require("path");

const i18next = require("i18next");
const i18nextFs = require("i18next-fs-backend");

function setPath(object, path, newValue) {
	let stack;
	if (typeof path !== "string") stack = [].concat(path);
	if (typeof path === "string") stack = path.split(".");

	while (stack.length > 1) {
		let key = stack.shift();
		if (key.indexOf("###") > -1) key = key.replace(/###/g, ".");
		if (!object[key]) object[key] = {};
		object = object[key];
	}

	let key = stack.shift();
	if (key.indexOf("###") > -1) key = key.replace(/###/g, ".");
	object[key] = newValue;
}

module.exports = function (mixinOptions) {
	mixinOptions = _.defaultsDeep(mixinOptions, {
		folder: "./locales",
		routerPath: "/locales",
	});

	i18next
		.use(i18nextFs)
		.init({
			//debug: true,
			fallbackLng: "en",
			whitelist: ["en", "pt"],
			ns: ["common", "errors"],
			defaultNS: "common",
			load: "all",
			saveMissing: true,
			saveMissingTo: "all",

			backend: {
				loadPath: path.join(mixinOptions.folder, "{{lng}}/{{ns}}.json"),

				addPath: path.join(
					mixinOptions.folder,
					"{{lng}}/{{ns}}.missing.json"
				),

				jsonIndent: 4,
			},
		})
		.catch((err) => console.warn(err));

	return {
		created() {
			const route = {
				path: mixinOptions.routerPath,

				aliases: {
					"GET /": (req, res) => {
						let resources = {};

						let languages = req.query["lng"]
							? req.query["lng"].split(" ")
							: [];
						let namespaces = req.query["ns"]
							? req.query["ns"].split(" ")
							: [];

						// extend ns
						namespaces.forEach((ns) => {
							if (
								i18next.options.ns &&
								i18next.options.ns.indexOf(ns) < 0
							)
								i18next.options.ns.push(ns);
						});

						i18next.services.backendConnector.load(
							languages,
							namespaces,
							function () {
								languages.forEach((lng) =>
									namespaces.forEach((ns) =>
										setPath(
											resources,
											[lng, ns],
											i18next.getResourceBundle(lng, ns)
										)
									)
								);

								res.setHeader(
									"Content-Type",
									"application/json; charset=utf-8"
								);
								res.end(JSON.stringify(resources));
							}
						);
					},

					"POST /": (req, res) => {
						let lng = req.query["lng"];
						let ns = req.query["ns"];

						for (let m in req.body) {
							if (m != "_t")
								i18next.services.backendConnector.saveMissing(
									[lng],
									ns,
									m,
									req.body[m]
								);
						}
						res.end("ok");
					},
				},

				mappingPolicy: "restrict",

				bodyParsers: {
					urlencoded: { extended: true },
				},
			};

			this.settings.routes.unshift(route);
		},
	};
};
