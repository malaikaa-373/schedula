import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";

// jest.setTimeout(30000);

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Webhook API Tests", () => {
    test("POST /api/webhook - endpoint exists", async () => {
        const res = await request(app)
            .post("/api/webhook")
            .send({});

        expect(res.statusCode).not.toBe(404);
    });
});