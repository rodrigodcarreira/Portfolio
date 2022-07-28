"use strict";

const path = require("path");
const mkdir = require("mkdirp").sync;
const DbService = require("moleculer-db");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = function (opts) {
	if (/* process.env.NODE_ENV == "production" && */ process.env.MONGO_URI) {
		// Mongo adapter
		const MongoAdapter = require("moleculer-db-adapter-mongo");

		return {
			mixins: [DbService],
			adapter: new MongoAdapter(process.env.MONGO_URI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}),
			collection: opts.collection,
			actions:
				opts.createActions === false
					? {
							find: { rest: false },
							count: { rest: false },
							list: { rest: false },
							create: { rest: false },
							insert: { rest: false },
							get: { rest: false },
							update: { rest: false },
							remove: { rest: false },
					  }
					: {},
			methods: {
				/* async entityChanged(type, json, ctx) {
					const eventName = `${this.name}.${type}`;
					this.broker.emit(eventName, {
						meta: ctx.meta,
						entity: json,
					});
				}, */
			},
		};
	} else if (process.env.NODE_ENV == "test") {
		mkdir(path.resolve("./data"));

		return {
			mixins: [DbService],
			adapter: new DbService.MemoryAdapter(),
			actions:
				opts.createActions === false
					? {
							find: false,
							count: false,
							list: false,
							create: false,
							insert: false,
							get: false,
							update: false,
							remove: false,
					  }
					: {},
		};
	} else {
		// --- NeDB fallback DB adapter

		// Create data folder
		mkdir(path.resolve("./data"));

		return {
			mixins: [DbService],
			adapter: new DbService.MemoryAdapter({
				filename: `./data/${opts.collection}.db`,
			}),
			actions:
				opts.createActions === false
					? {
							find: false,
							count: false,
							list: false,
							create: false,
							insert: false,
							get: false,
							update: false,
							remove: false,
					  }
					: {},
			methods: {
				async entityChanged(type, json, ctx) {
					const eventName = `${this.name}.${type}`;
					this.broker.emit(eventName, {
						meta: ctx.meta,
						entity: json,
					});
				},
			},
		};
	}
};
