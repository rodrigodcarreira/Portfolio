"use strict";

const DbMixin = require("../mixins/db.mixin");
const { MoleculerClientError } = require("moleculer").Errors;
const { ForbiddenError } = require("moleculer-web").Errors;

module.exports = {
	name: "projects",
	mixins: [DbMixin({ collection: "projects" })],

	settings: {
		rest: "/projects",

		fields: [
			"_id",
			"name",
			"description",
			"owner",
			"members",
			"sprints",
			"createdAt",
			"updatedAt",
		],

		populates: {
			owner: "users.get",
			members: "users.get",
		},

		entityValidator: {
			name: "string|min:2",
			description: "string|optional",
			members: "array|items:string|optional",
			owner: "string|optional",
		},
	},

	actions: {
		create: {
			rest: "POST /",
			auth: "required",
			params: {
				name: "string|min:2",
				description: "string|optional",
				members: "array|items:string|optional",
			},
			async handler(ctx) {
				let entity = ctx.params;
				entity.owner = ctx.meta.user._id.toString();
				if (!entity.members) entity.members = [];
				entity.members = [entity.owner, ...entity.members];
				entity.sprints = [];

				await this.validateEntity(ctx.params);

				const found = await this.adapter.findOne({
					name: entity.name,
					owner: entity.owner,
				});

				if (found)
					throw new MoleculerClientError(
						"Project already exists",
						422,
						"ERR_PROJECT_EXISTS",
						[{ field: "name", message: "alreadyInUse" }]
					);

				entity.createdAt = new Date();
				entity.updatedAt = new Date();

				const doc = await this.adapter.insert(entity);
				const project = await this.transformDocuments(
					ctx,
					{ populate: Object.keys(this.settings.populates) },
					doc
				);

				return project;
			},
		},

		createSprint: {
			rest: "POST /:id/sprints",
			auth: "required",
			params: {
				title: "string|min:2",
				startAt: "date|convert:true|optional",
				endAt: "date|convert:true|optional",
			},
			async handler(ctx) {
				const project = await this.adapter.findById(ctx.params.id);
				if (!project)
					throw new ForbiddenError("Project not found", 404);

				const sprint = await this.broker.call(
					"sprints.create",
					{
						idProject: ctx.params.id,
						title: ctx.params.title,
						startAt: ctx.params.startAt,
						endAt: ctx.params.endAt,
					},
					{ meta: ctx.meta }
				);

				if (!project.sprints) project.sprints = [];
				project.sprints.push(sprint._id);

				await this.adapter.updateById(ctx.params.id, {
					$set: { sprints: project.sprints },
				});

				return sprint;
			},
		},

		update: {
			rest: "PUT /:id",
			auth: "required",
			params: {
				name: "string|min:2|optional",
				description: "string|optional",
				members: "array|items:string|optional",
			},
			async handler(ctx) {
				let newData = ctx.params;

				const project = await this.getById(ctx.params.id);

				if (!project)
					throw new MoleculerClientError("Project not found", 404);

				if (project.owner !== ctx.meta.user._id.toString())
					throw new ForbiddenError();

				const found = await this.adapter.findOne({
					name: newData.name,
					owner: ctx.meta.user._id,
				});

				if (found && found._id.toString() != ctx.params.id.toString())
					throw new MoleculerClientError(
						"Project already exists",
						422,
						"ERR_PROJECT_EXISTS",
						[{ field: "name", message: "alreadyInUse" }]
					);

				newData.updatedAt = new Date();

				const doc = await this.adapter.updateById(project._id, {
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
			auth: "required",
			async handler(ctx) {
				const entities = await this.adapter.find({
					query: {
						members: ctx.meta.user._id.toString(),
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

				return await this.transformDocuments(
					ctx,
					{ populate: Object.keys(this.settings.populates) },
					entities
				);
			},
		},

		get: {
			auth: "required",
			async handler(ctx) {
				const project = await this.getById(ctx.params.id);

				if (!project)
					throw new MoleculerClientError("Project not found", 404);

				if (
					project.owner !== ctx.meta.user._id.toString() &&
					!project.members.includes(ctx.meta.user._id.toString())
				)
					throw new ForbiddenError();

				return await this.transformDocuments(
					ctx,
					{ populate: Object.keys(this.settings.populates) },
					project
				);
			},
		},

		getSprints: {
			rest: "GET /:id/sprints",
			auth: "required",
			async handler(ctx) {
				const project = await this.getById(ctx.params.id);

				if (!project)
					throw new MoleculerClientError("Project not found", 404);

				if (
					project.owner !== ctx.meta.user._id.toString() &&
					!project.members.includes(ctx.meta.user._id.toString())
				)
					throw new ForbiddenError();

				if (!project.sprints) project.sprints = [];

				const sprints = await this.broker.call(
					"sprints.get",
					{ id: project.sprints.map((sprint) => sprint.toString()) },
					{ meta: ctx.meta }
				);

				return sprints;
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
		getProjetById: {
			rest: false,
			async handler(ctx) {
				return await this.getById(ctx.params.id);
			},
		},
	},
};
