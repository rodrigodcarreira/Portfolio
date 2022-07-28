const DbMixin = require("../mixins/db.mixin");
const crypto = require("crypto");
const { MoleculerClientError } = require("moleculer").Errors;

module.exports = {
	name: "tokens",
	mixins: [DbMixin({ createActions: false, collection: "tokens" })],
	settings: {
		fields: ["userId", "token"],
	},
	actions: {
		generate: {
			params: {
				userId: "string",
			},
			async handler(ctx) {
				const token = this.randomToken();
				return await this.adapter.insert({
					userId: ctx.params.userId,
					token,
				});
			},
		},
		verify: {
			params: {
				token: "string",
				remove: "boolean",
			},
			async handler(ctx) {
				const { token, remove } = ctx.params;

				let doc = await this.adapter.findOne({ token });

				if (!doc) {
					return new MoleculerClientError("Token inválido!"); //TODO: Check translation
				}

				if (remove) await this.adapter.removeById(doc._id);

				return doc.userId;
			},
		},
	},
	events: {},
	methods: {
		randomToken() {
			return crypto.randomBytes(48).toString("hex");
		},
	},
};
