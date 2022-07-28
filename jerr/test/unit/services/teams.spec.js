"use strict";

const { ServiceBroker, Context } = require("moleculer");
const TestService = require("../../../backend/services/teams.service");
const UserService = require("../../../backend/services/users.service");
const TokenService = require("../../../backend/services/tokens.service");
const MailService = require("../../../backend/services/mail.service");
const { MoleculerClientError, ValidationError } = require("moleculer").Errors;

describe("Test 'teams' service", () => {
	const broker = new ServiceBroker({ logger: false });
	const service = broker.createService(TestService);
	const serviceUser = broker.createService(UserService);
	const serviceToken = broker.createService(TokenService);
	const serviceMail = broker.createService(MailService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test: Create a Team 'teams.create'", () => {
		it("should be created successfully", async () => {
			const record = {
				name: "team1",
				members: [],
			};

			const userRecord = {
				fullName: "yo",
				username: "yo",
				email: "yo@yo.com",
				password: "yoooooo",
				phoneNumber: "922222222",
			};

			const auth = {
				email: "yo@yo.com",
				password: "yoooooo",
			};

			let user = await broker.call("users.create", userRecord);
			delete user.password;

			let response = await broker.call("users.authenticate", auth);

			const res = await broker.call("teams.create", record, {
				meta: { user: response.user },
			});
			const result = { ...record };

			expect(res).toMatchObject(result);
		});

		it("should create the team with some users", async () => {
			const auth = {
				email: "yo@yo.com",
				password: "yoooooo",
			};

			let response = await broker.call("users.authenticate", auth);

			const record = {
				name: "team2",
				members: [
					{
						id: response.user._id,
						perm: "edit",
					},
				],
			};

			const res = await broker.call("teams.create", record, {
				meta: { user: response.user },
			});
			const result = { ...record };

			expect(res).toMatchObject(result);
		});

		it("should not create(name is unique for each owner)", async () => {
			const record = {
				name: "team1",
				members: [],
			};

			const auth = {
				email: "yo@yo.com",
				password: "yoooooo",
			};

			let response = await broker.call("users.authenticate", auth);

			await expect(() =>
				broker.call("teams.create", record, {
					meta: { user: response.user },
				})
			).rejects.toThrow(MoleculerClientError);
		});

		it("should not create the team(permissions dont exist)", async () => {
			const auth = {
				email: "yo@yo.com",
				password: "yoooooo",
			};

			let response = await broker.call("users.authenticate", auth);

			const record = {
				name: "team3",
				members: [
					{
						id: response.user._id,
						perm: "ediasdt",
					},
				],
			};
			await expect(() =>
				broker.call("teams.create", record, {
					meta: { user: response.user },
				})
			).rejects.toThrow(MoleculerClientError);
		});

		it("should not create the team(user dont exist)", async () => {
			const auth = {
				email: "yo@yo.com",
				password: "yoooooo",
			};

			let response = await broker.call("users.authenticate", auth);

			const record = {
				name: "team4",
				members: [
					{
						id: "response.user._id",
						perm: "ediasdt",
					},
				],
			};
			await expect(() =>
				broker.call("teams.create", record, {
					meta: { user: response.user },
				})
			).rejects.toThrow(MoleculerClientError);
		});
	});
});
