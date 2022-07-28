"use strict";

const C = require("../constants");
const DbMixin = require("../mixins/db.mixin");
const { MoleculerClientError } = require("moleculer").Errors;
const { ForbiddenError } = require("moleculer-web").Errors;

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: "teams",
	mixins: [DbMixin({ collection: "teams" })],

	settings: {
		rest: "/teams",
		fields: ["_id", "name", "members", "owner"],

		populates: {
			members: "users.get",
			owner: "users.get",
		},

		entityValidator: {
			name: "string|min:3",
			members: "array",
		},
	},

	hooks: {},

	actions: {
		create: {
			auth: "required",
			params: {
				name: "string|min:3",
				members: {
					type: "array",
				},
			},
			async handler(ctx) {
				let entity = ctx.params;
				entity.owner = ctx.meta.user._id.toString();

				await this.validateEntity(ctx.params);

				const found = await this.adapter.findOne({
					name: entity.name,
					owner: entity.owner,
				});

				if (found) {
					throw new MoleculerClientError("team already exist", 422, [
						{ field: "name", message: "already exist" },
					]);
				}

				const doc = await this.adapter.insert(entity);
				const team = await this.transformDocuments(
					ctx,
					{ populate: Object.keys(this.settings.populates) },
					doc
				);
				return team;
			},
		},

		update: {
			rest: "PUT /:id",
			auth: "required",
			params: {
				name: "string|min:2|optional",
				members: "array|items:object|optional",
			},
			async handler(ctx) {
				let newData = ctx.params;

				const team = await this.getById(ctx.params.id);

				if (!team)
					throw new MoleculerClientError("Team not found", 404);

				if (team.owner._id !== ctx.meta.user._id.toString())
					throw new ForbiddenError();

				const found = await this.adapter.findOne({
					name: newData.name,
					owner: ctx.meta.user._id.toString(),
				});

				if (found && found._id.toString() != ctx.params.id.toString())
					throw new MoleculerClientError(
						"Team already exists",
						422,
						"ERR_TEAM_EXISTS",
						[{ field: "name", message: "alreadyInUse" }]
					);

				const doc = await this.adapter.updateById(team._id, {
					$set: newData,
				});
				const entity = await this.transformDocuments(
					ctx,
					{ populate: Object.keys(this.settings.populates) },
					doc
				);

				return entity;
			},
		},

		list: {
			rest: "GET /list",
			auth: "required",
			async handler(ctx) {
				const entities = await this.adapter.find({
					query: {
						owner: ctx.meta.user._id.toString(),
					},
				});

				return await this.transformDocuments(
					ctx,
					{ populate: Object.keys(this.settings.populates) },
					entities
				);
			},
		},

		listAsMember: {
			rest: "GET /membership",
			auth: "required",
			async handler(ctx) {
				const entities = await this.adapter.find({
					query: {
						members: ctx.meta.user._id.toString(),
					},
				});

				return await this.transformDocuments(ctx, {}, entities);
			},
		},

		get: {
			auth: "required",
			async handler(ctx) {
				const teams = await this.getById(ctx.params.id);

				if (!teams)
					throw new MoleculerClientError("Project not found", 404);

				if (
					!teams.members.includes({
						id: ctx.meta.user._id.toString(),
					})
				)
					throw new ForbiddenError();

				return await this.transformDocuments(ctx, {}, teams);
			},
		},

		delete: {
			auth: "required",
			async handler(ctx) {
				return await this.adapter.removeMany({
					id: ctx.params.id,
					owner: ctx.meta.user._id.toString(),
				});
			},
		},
	},

	methods: {},
};
