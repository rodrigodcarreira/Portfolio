"use strict";

const DbMixin = require("../../mixins/db.mixin");
const { MoleculerClientError } = require("moleculer").Errors;
const { ForbiddenError } = require("moleculer-web").Errors;

module.exports = {
	name: "tasks",
	mixins: [DbMixin({ collection: "tasks", createActions: false })],

	settings: {
		rest: "/tasks",

		fields: [
			"_id",
			"list",
			"title",
			"description",
			"assignees",
			"createdAt",
			"updatedAt",
			"attachments",
		],

		populates: {
			assignees: "users.get",
		},

		entityValidator: {
			title: "string|min:2",
			description: "string|optional",
			assignees: "array|items:string|optional",
			list: "string|min:2",
		},
	},

	actions: {
		create: {
			rest: "POST /",
			auth: "required",
			params: {
				title: "string|min:2",
				description: "string|optional",
				assignees: "array|items:string|optional",
				list: "string|min:2",
			},
			async handler(ctx) {
				let entity = ctx.params;
				if (!entity.assignees) entity.assignees = [];
				entity.attachments = [];
				entity.createdAt = new Date();
				entity.updatedAt = new Date();
				entity.description = entity.description || "";

				let list = await this.broker.call("lists.get", {
					id: entity.list,
				});

				if (!list) throw new ForbiddenError("List does not exist"); //TODO: Check error

				const doc = await this.adapter.insert(entity);
				const task = await this.transformDocuments(
					ctx,
					{ populate: Object.keys(this.settings.populates) },
					doc
				);

				await this.broker.emit("task.created", {
					task,
					list: list._id,
				});

				return task;
			},
		},

		update: {
			rest: "PUT /:id",
			auth: "required",
			params: {
				title: "string|min:2|optional",
				description: "string|optional",
				assignees: "array|items:string|optional",
			},
			async handler(ctx) {
				let newData = ctx.params;

				const task = await this.getById(ctx.params.id);

				if (!task)
					throw new MoleculerClientError("Task not found", 404);

				newData.updatedAt = new Date();

				delete newData._id;

				const doc = await this.adapter.updateById(task._id, {
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

		get: {
			rest: "GET /:id",
			auth: "required",
			async handler(ctx) {
				ctx.params.populate = ["assignees"];
				return this._get(ctx, ctx.params);
			},
		},

		delete: {
			rest: "DELETE /:id",
			auth: "required",
			async handler(ctx) {
				const doc = await this.getById(ctx.params.id);
				const task = await this.transformDocuments(ctx, {}, doc);
				if (!task) return;

				if (!ctx.params.noPropragate)
					await this.broker.emit("task.deleted", { task });

				return await this._remove(ctx, { id: task._id });
			},
		},
	},
};
