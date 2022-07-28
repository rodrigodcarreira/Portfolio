"use strict";

const DbMixin = require("../mixins/db.mixin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MoleculerClientError } = require("moleculer").Errors;

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: "users",
	mixins: [DbMixin({ collection: "users" })],

	settings: {
		rest: "/users",
		JWT_SECRET: process.env.JWT_SECRET || "JWTBUEDASECRETO",

		fields: [
			"_id",
			"username",
			"fullName",
			"email",
			"phoneNumber",
			"photo",
			"createdAt",
			"verifiedAt",
			//TODO: Add email validation
		],

		entityValidator: {
			username: "string|min:2",
			fullName: "string|min:2",
			password: "string|min:6",
			email: "email",
			//TODO: Check https://github.com/icebob/fastest-validator#custom-validation-for-built-in-rules
			phoneNumber: "string|length:9|pattern:\\d{9}",
			photo: "string|optional",
		},
	},

	hooks: {
		before: {
			update: (ctx) => {
				delete ctx.params.password;
				delete ctx.params.email;
			},
			updateSelf: (ctx) => {
				delete ctx.params.password;
				delete ctx.params.email;
			},
		},
		/* after: {
			"*": (ctx, res) => {
				delete res.password; //Don't show the password to the client
				return res;
			},
		}, */
	},

	actions: {
		async create(ctx) {
			let entity = ctx.params; //Treat the params as a user object
			await this.validateEntity(ctx.params);

			if (entity.username) {
				const found = await this.adapter.findOne({
					username: entity.username,
				});
				if (found)
					throw new MoleculerClientError(
						"Username already exist!", //TODO: Add translated error message
						422,
						"",
						[{ field: "username", message: "is exist" }]
					);
			}

			if (entity.email) {
				const found = await this.adapter.findOne({
					email: entity.email,
				});
				if (found)
					throw new MoleculerClientError("Email in use!", 422, "", [
						{ field: "email", message: "in use" },
					]);
			}

			entity.password = this.hashPassword(entity.password);
			entity.photo = entity.photo || null;
			entity.createdAt = new Date();

			const doc = await this.adapter.insert(entity);
			const user = await this.transformDocuments(ctx, {}, doc);

			const { token } = await ctx.call("tokens.generate", {
				userId: user._id,
			});

			ctx.call("mail.send", {
				to: user.email,
				template: "register",
				locale: "pt", //TODO: Introduce here the local of the user
				data: {
					user,
					token,
				},
			});

			/* await */ this.entityChanged("created", user, ctx); //TODO: Check if needs to be awaited

			return user;
		},

		updateSelf: {
			auth: "required",
			rest: "PUT /user",
			params: {
				username: "string|min:2|optional:true",
				fullName: "string|min:2|optional:true",
				phoneNumber: "string|length:9|pattern:\\d{9}|optional:true",
				photo: "string|optional",
			},
			async handler(ctx) {
				let entity = ctx.params;

				if (entity.verifiedAt == "Deleted") {
					throw new MoleculerClientError("User Deleted!", 422, "", [
						{ field: "verifiedAt", message: "is deleted" },
					]);
				}

				if (entity.username) {
					const found = await this.adapter.findOne({
						username: entity.username,
					});

					if (
						found &&
						found._id.toString() != ctx.meta.user._id.toString()
					)
						throw new MoleculerClientError(
							"Username already exist!", //TODO: Add translated error message
							422,
							"",
							[{ field: "username", message: "is exist" }]
						);
				}

				if (entity.email) {
					const found = await this.adapter.findOne({
						email: entity.email,
					});
					if (
						found &&
						found._id.toString() != ctx.meta.user._id.toString()
					)
						throw new MoleculerClientError(
							"Email in use!",
							422,
							"",
							[{ field: "email", message: "in use" }]
						);
				} //TODO: Send and Check Email Confirmation

				entity.updatedAt = new Date();

				const doc = await this.adapter.updateById(ctx.meta.user._id, {
					$set: entity,
				});
				const user = await this.transformDocuments(ctx, {}, doc);

				//await this.entityChanged("updated", user, ctx); //Check if needs to be awaited

				return user;
			},
		},

		authenticate: {
			rest: "POST /authenticate",
			params: {
				email: "email",
				password: "string|min:1",
			},
			async handler(ctx) {
				const { email, password } = ctx.params;

				const user = await this.adapter.findOne({ email });

				if (!user)
					throw new MoleculerClientError(
						"User not found!", //TODO: Adicionar linguas
						422,
						"",
						[{ field: "email", message: "is not found" }]
					);

				if (user.verifiedAt == "Deleted") {
					throw new MoleculerClientError("User Deleted!", 422, "", [
						{ field: "email", message: "is deleted" },
					]);
				}

				if (!this.comparePassword(password, user.password))
					throw new MoleculerClientError(
						"Wrong password!", //TODO: Adicionar linguas
						422,
						"",
						[{ field: "password", message: "is not correct" }]
					);

				if (user.verifiedAt === null) {
					throw new MoleculerClientError(
						"Not Verified yet", //TODO: Adicionar linguas
						401,
						"",
						[{ field: "email", message: "not verified" }]
					);
				}

				const doc = await this.transformDocuments(ctx, {}, user);
				const token = this.generateToken(doc._id);

				return { user: doc, token };
			},
		},

		me: {
			auth: "required",
			rest: "GET /me",
			async handler(ctx) {
				return {
					token: await this.generateToken(
						ctx.meta.user._id.toString()
					),
					user: await this.transformDocuments(ctx, {}, ctx.meta.user),
				};
			},
		},

		sendConfirmMail: {
			rest: "POST /sendConfirmMail",
			async handler(ctx) {
				const { email } = ctx.params;

				const found = await this.adapter.findOne({
					email: email,
				});
				if (!found)
					throw new MoleculerClientError("User not Found", 404, "", [
						{ field: "email", message: "not found" },
					]);
				if (found.verifiedAt)
					throw new MoleculerClientError("User Invalid", 409, "", [
						{ field: "verifiedAt", message: "invalid" },
					]);

				const user = await this.transformDocuments(ctx, {}, found);
				const { token } = await ctx.call("tokens.generate", {
					userId: user._id,
				});

				ctx.call("mail.send", {
					to: user.email,
					template: "register",
					locale: "pt", //TODO: Introduce here the local of the user
					data: {
						user,
						token,
					},
				});
			},
		},

		search: {
			auth: "required",
			rest: "GET /search/:query",
			params: {
				query: "string|min:2",
			},
			async handler(ctx) {
				const regex = new RegExp(ctx.params.query, "i");
				return await this._list(ctx, {
					query: {
						$or: [
							{ username: regex },
							{ fullName: regex },
							{ email: regex },
						],
						verifiedAt: { $ne: "Deleted" },
					},
				});
			},
		},

		verify: {
			rest: "GET /verify/:token",
			params: {
				token: "string",
			},
			async handler(ctx) {
				const { token } = ctx.params;

				const id = await ctx.call("tokens.verify", {
					token,
					remove: true,
				});

				const doc = await this.adapter.updateById(id, {
					$set: { verifiedAt: new Date() },
				});

				const user = await this.transformDocuments(ctx, {}, doc);
				///* await */ this.entityChanged("updated", user, ctx); //TODO: Check if needs to be awaited

				ctx.meta.$location = "/login"; //Go to login page

				return user;
			},
		},

		resolveToken: {
			cache: {
				keys: ["token"],
				ttl: 60 * 60, //1 hour
			},
			params: {
				token: "string",
			},
			handler(ctx) {
				const decoded = jwt.verify(
					ctx.params.token,
					this.settings.JWT_SECRET
				);

				if (decoded.id) return this.getById(decoded.id);

				return null;
			},
		},

		delete: {
			rest: "DELETE /delete",
			auth: "required",
			async handler(ctx) {
				const found = await this.getById(ctx.meta.user._id);

				if (!found) {
					throw new MoleculerClientError(
						"User not found!",
						404,
						"",
						[{ field: "_id", message: "not found" }]
					);
				}

				found.updatedAt = "";
				found.username = "";
				found.mail = "";
				found.fullName = "";
				found.password = "";
				found.verifiedAt = "Deleted";
				found.createdAt = "";
				found.phoneNumber = "";
				found.photo = "";

				const doc = await this.adapter.updateById(ctx.meta.user._id, {
					$set: found,
				});
				const user = await this.transformDocuments(ctx, {}, doc);

				return user;
			},
		},

		newPassword: {
			rest: "POST /newPassword",
			params: {
				email: "email",
			},
			async handler(ctx) {
				const { email } = ctx.params;

				const user = await this.adapter.findOne({
					email: email,
				});
				if (user == null) {
					throw new MoleculerClientError("Email not found", 404, "", [
						{ field: "email", message: "not found" },
					]);
				}

				const { token } = await ctx.call("tokens.generate", {
					userId: user._id.toString(),
				});

				ctx.call("mail.send", {
					to: user.email,
					template: "password",
					locale: "pt", //TODO: Introduce here the local of the user
					data: {
						user,
						token,
					},
				});
				return { code: 200 };
			},
		},

		resetPassword: {
			rest: "PUT /resetPwd/:token",
			params: {
				token: "string",
				password: "string",
			},
			async handler(ctx) {
				const { password, token } = ctx.params;

				const id = await ctx.call("tokens.verify", {
					token,
					remove: true,
				});

				const found = await this.adapter.findOne({
					_id: id,
				});
				if (found == null) {
					throw new MoleculerClientError("User not found", 404, "", [
						{ field: "_id", message: "not found" },
					]);
				}

				const doc = await this.adapter.updateById(found._id, {
					$set: { password: this.hashPassword(password) },
				});

				return;
			},
		},
	},

	methods: {
		hashPassword(pass) {
			let salt = bcrypt.genSaltSync(10);
			return bcrypt.hashSync(pass, salt);
		},

		generateToken(id) {
			const payload = {
				id: id,
			};
			const options = {
				expiresIn: "8h",
				audience: id,
			};
			return jwt.sign(payload, this.settings.JWT_SECRET, options);
		},

		comparePassword(password, hashedPassword) {
			return bcrypt.compareSync(password, hashedPassword);
		},
	},
};
