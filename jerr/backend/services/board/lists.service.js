"use strict";

const DbMixin = require("../../mixins/db.mixin");

module.exports = {
	name: "lists",
	mixins: [DbMixin({ collection: "lists", createActions: false })],

	settings: {
		rest: "/lists",

		fields: ["_id", "title", "tasks", "createdAt", "updatedAt", "sprint"],

		populates: {
			tasks: "tasks.get",
		},

		entityValidator: {
			title: "string|min:2",
			tasks: "array|items:string|optional",
		},
	},

	actions: {
		create: {
			rest: "POST /",
			auth: "required",
			params: {
				title: "string|min:2",
				tasks: "array|items:string|optional",
				sprint: "string|min:2",
			},
			async handler(ctx) {
				let entity = ctx.params;
				if (!entity.tasks) entity.tasks = [];

				entity.createdAt = new Date();
				entity.updatedAt = new Date();

				const doc = await this.adapter.insert(entity);
				const list = await this.transformDocuments(
					ctx,
					{ populate: Object.keys(this.settings.populates) },
					doc
				);

				await this.broker.call("sprints.addList", list);

				return list;
			},
		},

		update: {
			rest: "PUT /:id",
			auth: "required",
			params: {
				title: "string|min:2",
				tasks: "array|items:string|optional",
				sprint: "string|min:2",
			},
			async handler(ctx) {
				let entity = ctx.params;

				entity.updatedAt = new Date();

				const doc = await this._update(ctx.params.id, entity);
				const list = await this.transformDocuments(
					ctx,
					{ populate: Object.keys(this.settings.populates) },
					doc
				);

				return list;
			},
		},

		get: {
			rest: "GET /:id",
			auth: "required",
			async handler(ctx) {
				ctx.params.populate = ["tasks"];
				return this._get(ctx, ctx.params);
			},
		},

		delete: {
			rest: "DELETE /:id",
			auth: "required",
			async handler(ctx) {
				const list = await this._get(ctx, ctx.params);
				if (!list) return;

				for (let task of list.tasks) {
					await this.broker.call("tasks.delete", {
						id: task._id,
						noPropragate: true,
					});
				}

				await this.broker.call("sprints.removeList", list);
				return this._remove(ctx, ctx.params);
			},
		},
	},
	events: {
		"task.created": {
			async handler({ task, list }) {
				let oldList = await this.getById(list);
				oldList.tasks.push(task._id);

				await this._update(list._id, oldList);
			},
		},
		"task.deleted": {
			async handler({ task }) {
				const doc = await this.getById(task.list);
				const list = await this.transformDocuments(null, {}, doc);
				list.tasks = list.tasks.filter((id) => id !== task._id);
				await this._update(list._id, list);
			},
		},
	},
};
