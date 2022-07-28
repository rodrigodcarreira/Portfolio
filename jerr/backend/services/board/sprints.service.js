"use strict";

const DbMixin = require("../../mixins/db.mixin");
const { MoleculerClientError } = require("moleculer").Errors;
const { ForbiddenError } = require("moleculer-web").Errors;

module.exports = {
	name: "sprints",
	mixins: [DbMixin({ collection: "sprints", createActions: false })],
	settings: {
		rest: "/sprints",
		fields: [
			"_id",
			"idProject",
			"title",
			"createdAt",
			"finishedAt",
			"startAt",
			"endAt",
			"updateAt",
			"lists",
		],
		populates: {
			lists: "lists.get",
		},
		entityValidator: {
			title: "string|min:2",
		},
		defaultLists: ["Por Fazer", "Em Andamento", "Concluído"],
	},
	actions: {
		create: {
			rest: "POST /",
			auth: "required",
			params: {
				title: "string|min:2",
				idProject: "string|min:1", //não tenho a certeza se deve estar aqui
				startAt: "date|convert:true",
				endAt: "date|convert:true",
			},
			async handler(ctx) {
				let entity = ctx.params;

				await this.validateEntity(ctx.params);

				const project = await this.broker.call(
					"projects.getProjetById",
					{
						id: entity.idProject, //TODO verificar seguranca o user tem de ter permissões para criar um sprint em um projecto
					}
				);

				if (!project)
					throw new MoleculerClientError(
						"Project not exist!",
						422,
						"",
						[
							{ field: "_id", message: "not exist" }, //TODO in use vai ser chave do erro
						]
					);

				const found = await this.adapter.findOne({
					title: entity.title,
					idProject: entity.idProject,
				});

				if (found)
					throw new MoleculerClientError(
						"Title already in use!",
						422,
						"",
						[
							{ field: "title", message: "in use" }, //in use vai ser chave do erro
						]
					);

				entity.createdAt = new Date();
				entity.updatedAt = new Date();

				entity.lists = [];

				const doc = await this.adapter.insert(entity);
				const oldSprint = await this.transformDocuments(ctx, {}, doc);
				const updatedDoc = await this.createDefultLists(oldSprint);
				/*
				console.log("updated", updatedDoc);
				const sprint = await this.transformDocuments(
					ctx,
					{ populate: Object.keys(this.settings.populates) },
					updatedDoc
				);
 */
				return updatedDoc;
			},
		},
		update: {
			rest: "PUT /:id",
			auth: "required",
			params: {
				title: "string|min:2",
				lists: "array",
			},
			async handler(ctx) {
				let entity = ctx.params;

				await this.validateEntity(ctx.params);

				entity.updatedAt = new Date();

				const doc = await this._update(ctx.params.id, entity);

				const sprint = await this.transformDocuments(
					ctx,
					{ populate: Object.keys(this.settings.populates) },
					doc
				);

				return sprint;
			},
		},
		finish: {
			rest: "PUT /:id/finish",
			auth: "required",
			async handler(ctx) {
				const doc = await this.adapter.updateById(ctx.params.id, {
					$set: { finishedAt: new Date() },
				});

				const sprint = await this.transformDocuments(
					ctx,
					{ populate: Object.keys(this.settings.populates) },
					doc
				);

				return sprint;
			},
		},
		remove: {
			rest: "DELETE /:id",
			auth: "required",
			async handler(ctx) {
				await this.adapter.removeById(ctx.params.id);
				return {};
			},
		},

		gett: {
			rest: "GET /:id",
			auth: "required",
			async handler(ctx) {
				const doc = await this.adapter.findById(ctx.params.id);
				const sprint = await this.transformDocuments(
					ctx,
					{
						populate: Object.keys(this.settings.populates),
					},
					doc
				);

				return sprint;
			},
		},
		addList: {
			async handler(ctx) {
				const sprint = await this.adapter.findById(ctx.params.sprint);
				if (!sprint) return;
				sprint.lists.push(ctx.params._id);
				await this.adapter.updateById(ctx.params.sprint, {
					$set: sprint,
				});
			},
		},

		removeList: {
			async handler(ctx) {
				const sprint = await this.adapter.findById(ctx.params.sprint);
				if (!sprint) return;
				sprint.lists = sprint.lists.filter(
					(list) => list.toString() !== ctx.params._id.toString()
				);
				await this.adapter.updateById(ctx.params.sprint, {
					$set: sprint,
				});
			},
		},
	},
	methods: {
		async createDefultLists(sprint) {
			for (let i = 0; i < this.settings.defaultLists.length; i++) {
				const list = await this.broker.call("lists.create", {
					title: this.settings.defaultLists[i],
					tasks: [],
					sprint: sprint._id,
				});
				sprint.lists.push(list._id);
			}
			return await this.adapter.updateById(sprint._id, {
				$set: {
					lists: sprint.lists,
				},
			});
		},
	},
};
