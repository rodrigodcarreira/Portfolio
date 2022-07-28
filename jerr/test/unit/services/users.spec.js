"use strict";

const { ServiceBroker, Context } = require("moleculer");
const TestService = require("../../../backend/services/users.service");
const TokenService = require("../../../backend/services/tokens.service");
const MailService = require("../../../backend/services/mail.service");
const { MoleculerClientError, ValidationError } = require("moleculer").Errors;
describe("Test 'users' service", () => {
	const broker = new ServiceBroker({ logger: false });
	const service = broker.createService(TestService);
	const serviceToken = broker.createService(TokenService);
	const serviceMail = broker.createService(MailService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test: Create a User 'users.create'", () => {
		const record = {
			fullName: "yo",
			username: "yo",
			email: "yo@yo.com",
			password: "yoooooo",
			phoneNumber: "922222222",
		};

		let res;

		it("should create the user", async () => {
			res = await broker.call("users.create", record);
			const result = { ...record };
			delete result.password;

			expect(res).toMatchObject(result);
		});

		it("the user should have an _id", () => {
			expect(res).toHaveProperty("_id");
		});

		it("username should be unique", async () => {
			let record = {
				fullName: "yo2",
				username: "yo",
				email: "yo2@yo.com",
				password: "yoooooo",
				phoneNumber: "922222223",
			};

			await expect(() =>
				broker.call("users.create", record)
			).rejects.toThrow(MoleculerClientError);

			record = {
				fullName: "yo2",
				username: "yo2",
				email: "yo2@yo.com",
				password: "yoooooo",
				phoneNumber: "922222223",
			};

			await expect(() => broker.call("users.create", record)).not.toThrow(
				MoleculerClientError
			);
		});

		it("email should be unique", async () => {
			let record = {
				fullName: "yo3",
				username: "yo3",
				email: "yo@yo.com",
				password: "yoooooo",
				phoneNumber: "922222224",
			};

			await expect(() =>
				broker.call("users.create", record)
			).rejects.toThrow(MoleculerClientError);

			record = {
				fullName: "yo3",
				username: "yo3",
				email: "yo3@yo.com",
				password: "yoooooo",
				phoneNumber: "922222224",
			};

			await expect(() => broker.call("users.create", record)).not.toThrow(
				MoleculerClientError
			);
		});

		it("email should have a correct sintax", async () => {
			let record = {
				fullName: "yo4",
				username: "yo4",
				email: "yoyo.com",
				password: "yoooooo",
				phoneNumber: "922222225",
			};

			await expect(() =>
				broker.call("users.create", record)
			).rejects.toThrow(MoleculerClientError);

			record = {
				fullName: "yo4",
				username: "yo4",
				email: "yo4@yocom",
				password: "yoooooo",
				phoneNumber: "922222225",
			};

			await expect(() =>
				broker.call("users.create", record)
			).rejects.toThrow(MoleculerClientError);

			record = {
				fullName: "yo4",
				username: "yo4",
				email: "yo4yocom",
				password: "yoooooo",
				phoneNumber: "922222225",
			};
			await expect(() =>
				broker.call("users.create", record)
			).rejects.toThrow(MoleculerClientError);

			record = {
				fullName: "yo4",
				username: "yo4",
				email: "yo4@yo.com",
				password: "yoooooo",
				phoneNumber: "922222225",
			};

			await expect(() => broker.call("users.create", record)).not.toThrow(
				MoleculerClientError
			);
		});

		it("phoneNumber should have a correct sintax", async () => {
			let record = {
				fullName: "yo5",
				username: "yo5",
				email: "yo5@yo.com",
				password: "yoooooo",
				phoneNumber: "9222",
			};

			await expect(() =>
				broker.call("users.create", record)
			).rejects.toThrow(ValidationError);

			record = {
				fullName: "yo5",
				username: "yo5",
				email: "yo5@yo.com",
				password: "yoooooo",
				phoneNumber: "92222223123123",
			};

			await expect(() =>
				broker.call("users.create", record)
			).rejects.toThrow(ValidationError);

			record = {
				fullName: "yo5",
				username: "yo5",
				email: "yo5@yo.com",
				password: "yoooooo",
				phoneNumber: "daisudau",
			};

			await expect(() =>
				broker.call("users.create", record)
			).rejects.toThrow(ValidationError);
		});
	});

	describe("Test: Authenticate a user 'users.authenticate'", () => {
		it("login, should return a token and a user", async () => {
			let record = {
				email: "yo5yo.com",
				password: "yoooooo",
			};

			await expect(() =>
				broker.call("users.authenticate", record)
			).rejects.toThrow(ValidationError);

			record = {
				email: "yo5dontexist@yo.com",
				password: "yoooooo",
			};

			await expect(() =>
				broker.call("users.authenticate", record)
			).rejects.toThrow(MoleculerClientError);

			record = {
				email: "yo5@yo.com",
				password: "yoohuhuoooo",
			};

			await expect(() =>
				broker.call("users.authenticate", record)
			).rejects.toThrow(MoleculerClientError);

			record = {
				email: "yo@yo.com",
				password: "yoooooo",
			};

			let res = await broker.call("users.authenticate", record);

			expect(res).toHaveProperty("user");
		});
	});

	describe("Test: Verify a user 'users.verify'", () => {
		it("verify user", async () => {
			let record = {
				email: "yo@yo.com",
				password: "yoooooo",
			};

			let sol = await broker.call("users.authenticate", record);
			let params = {
				token: sol.token,
			};
			let res = await broker.call("users.verify", params);

			expect(res).toBeUndefined();

			params = {
				token: "sol.user._id",
			};

			res = await broker.call("users.verify", params);

			expect(res).toBeUndefined();
		});
	});
});
