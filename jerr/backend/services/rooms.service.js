const DbMixins = require("../mixins/db.mixin");
const { ValidationError, MoleculerClientError } = require("moleculer").Errors;
const E = require("moleculer-web").Errors;

module.exports = {
	name: "rooms",
	mixins: [DbMixins({ collection: "rooms", createActions: false })],

	settings: {
		rest: "/rooms",
		fields: [
			"_id",
			"name",
			// "messages",
			"projectId",
			"createdAt",
			"updatedAt",
		],
	},

	actions: {
		create: {
			auth: "required",
			rest: "POST /:projectId",
			params: {
				name: "string",
			},
			async handler(ctx) {
				const { name, projectId } = ctx.params;

				const project = await ctx.call("projects.get", {
					id: projectId,
				});

				if (!project)
					throw new MoleculerClientError(
						"Project not found!", //TODO: Add translated error message
						422,
						"",
						[{ field: "project", message: "not found" }]
					);

				if (project.ownerId !== ctx.meta.userId) {
					//TOOD: Check who can create rooms
					throw new E.UnAuthorizedError(
						"You are not part of this project" //TODO: Check what error to throw
					);
				}

				const roomFound = await this.adapter.findOne({
					name,
					projectId,
				});

				if (roomFound)
					throw new MoleculerClientError(
						"Name already in use!", //TODO: Add translated error message
						422,
						"",
						[{ field: "name", message: "in use" }]
					);

				const room = await this.adapter.insert({
					name,
					projectId,
					messages: [],
					createdAt: new Date(),
					updatedAt: new Date(),
				});

				return room;
			},
		},

		getAll: {
			auth: "required",
			rest: "GET /:projectId",
			handler(ctx) {
				const { projectId } = ctx.params;
				return this.adapter.find({ query: { projectId } });
			},
		},

		getMessages: {
			auth: "required",
			rest: "GET /messages/:id",
			handler(ctx) {
				const { id } = ctx.params;

				return this.adapter.findById(id, { fields: ["messages"] });
			},
		},

		addMessage: {
			rest: "POST /messages/:id",
			params: {
				message: "string",
			},
			async handler(ctx) {
				const room = await this.adapter.findById(ctx.params.id, {
					fields: ["messages"],
				});

				if (!room) {
					throw new ValidationError("Invalid Room"); //TODO: Check what error to throw
				}

				const message = {
					message: ctx.params.message,
					user: ctx.meta.user._id,
					createdAt: new Date(),
					updatedAt: new Date(),
				};

				room.messages.push(message);

				this.broker.emit("message.added", {
					message,
					roomId: room._id,
				});

				return this._update(room._id, room); //TODO: Transform document to add population to messages
			},
		},

		join: {
			rest: false,
			params: {
				roomId: "string",
			},
			async handler(ctx) {
				ctx.meta.$join = "chat-" + ctx.params.roomId;
			},
		},

		leave: {
			rest: false,
			params: {
				roomId: "string",
			},
			async handler(ctx) {
				ctx.meta.$leave = "chat-" + ctx.params.roomId;
			},
		},
	},

	events: {
		"message.added": {
			params: {
				message: "object",
				roomId: "string",
			},
			async handler(ctx) {
				this.broker.call("api.broadcast", {
					event: "room.message",
					args: [ctx.params.message],
					rooms: ["chat-" + ctx.params.roomId],
				});
			},
		},
	},
};
