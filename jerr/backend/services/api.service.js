"use strict";

const ApiGateway = require("moleculer-web");
const SocketIOService = require("moleculer-io");
const i18nextMixin = require("../mixins/i18next.mixin");
const history = require("connect-history-api-fallback");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
	name: "api",
	mixins: [ApiGateway, i18nextMixin(), SocketIOService],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT || 5000,

		// Exposed IP
		ip: "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		cors: "*",

		//Socket IO
		io: {
			namespaces: {
				"/": {
					authorization: true,
					events: {
						call: {
							aliases: {
								"rooms.example": "rooms.socketExample",
								"rooms.join": "rooms.join",
								"rooms.leave": "rooms.leave",
							},
						},
					},
					/* authorization: true,
					events: {
						call: {
							mappingPolicy: "restrict",
							aliases: {
								// addMessage: "rooms.addMessage",
								"rooms.example": "rooms.socketExample",
							},
						},
					}, */
				},
			},
		},

		routes: [
			// moleculer-auto-openapi routes
			{
				path: "/api/openapi",
				aliases: {
					"GET /openapi.json": "openapi.generateDocs", // swagger scheme
					"GET /ui": "openapi.ui", // ui
					"GET /assets/:file": "openapi.assets", // js/css files
				},
			},
			{
				path: "/api",

				whitelist: ["**"],

				cors: "*",
				// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
				use: [],

				// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
				mergeParams: true,

				// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
				authentication: true,

				// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
				authorization: true,

				// The auto-alias feature allows you to declare your route alias directly in your services.
				// The gateway will dynamically build the full routes from service schema.
				autoAliases: true,

				aliases: {},

				/**
				 * Before call hook. You can check the request.
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingRequest} req
				 * @param {ServerResponse} res
				 * @param {Object} data
				 */
				onBeforeCall(ctx, route, req, res) {
					// Set request headers to context meta
					ctx.meta.headers = req.headers;
				},

				/**
				 * After call hook. You can modify the data.
				 * @param {Context} ctx
				 * @param {Object} route
				 * @param {IncomingRequest} req
				 * @param {ServerResponse} res
				 * @param {Object} data
				onAfterCall(ctx, route, req, res, data) {
					// Async function which return with Promise
					return doSomething(ctx, res, data);
				}, */

				// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
				callingOptions: {},

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB",
					},
					urlencoded: {
						extended: true,
						limit: "1MB",
					},
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all", // Available values: "all", "restrict"

				// Enable/disable logging
				logging: true,
			},

			{
				path: "/api/upload",

				// You should disable body parsers
				bodyParsers: {
					json: false,
					urlencoded: false,
				},

				aliases: {
					// File upload from HTML form and overwrite busboy config
					"POST /": {
						type: "multipart",
						// Action level busboy config
						busboyConfig: {
							limits: { files: 1 },
						},
						action: "files.create",
					},
				},

				mappingPolicy: "restrict",
			},
			{
				path: "/assets",
				use: [ApiGateway.serveStatic("assets", {})],
				mappingPolicy: "restrict",
			},
			{
				path: "/",
				use: [history(), ApiGateway.serveStatic("public", {})],

				mappingPolicy: "restrict",
			},
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,

		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		/* assets: {
			folder: "./assets",

			// Options to `server-static` module
			options: {},
		}, */
	},

	methods: {
		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authenticate(ctx, route, req) {
			// Read the token from header
			const auth = req.headers["authorization"];

			if (auth && auth.startsWith("Bearer")) {
				const token = auth.slice(7);

				try {
					return await ctx.call("users.resolveToken", { token });
				} catch (err) {
					// Invalid token
					/* throw new ApiGateway.Errors.UnAuthorizedError(
						ApiGateway.Errors.ERR_INVALID_TOKEN
					); */
					return null;
				}
			} else {
				// No token. Throw an error or do nothing if anonymous access is allowed.
				// throw new E.UnAuthorizedError(E.ERR_NO_TOKEN);
				return null;
			}
		},

		/**
		 * Authorize the request. Check that the authenticated user has right to access the resource.
		 *
		 * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authorize(ctx, route, req) {
			// Get the authenticated user.

			const user = ctx.meta.user;

			// It check the `auth` property in action schema.
			if (req.$action.auth == "required" && !user) {
				// throw new ApiGateway.Errors.UnAuthorizedError("NO_RIGHTS");
				console.log(user);
				throw new ApiGateway.Errors.UnAuthorizedError(
					ApiGateway.Errors.ERR_INVALID_TOKEN
				);
			}
		},

		async socketAuthorize(socket, eventHandler) {
			let token = socket.handshake.query.token.replace(/['"]+/g, ""); // Remover aspas do token "exeploToken" -> exeploToken
			try {
				return await this.broker.call("users.resolveToken", {
					token,
				});
			} catch (err) {
				throw new SocketIOService.Errors.UnAuthorizedError();
			}
		},

		async socketAuthorize(socket, eventHandler) {
			let token = socket.handshake.query.token.replace(/['"]+/g, ""); // Remover aspas do token "exeploToken" -> exeploToken
			try {
				return await this.broker.call("users.resolveToken", {
					token,
				});
			} catch (err) {
				throw new SocketIOService.Errors.UnAuthorizedError();
			}
		},
	},
};
