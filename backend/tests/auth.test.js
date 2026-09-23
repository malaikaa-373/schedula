import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";

// ✅ Test ke baad database connection band karo
afterAll(async () => {
    await mongoose.connection.close();
});

describe("Auth API Tests", () => {

    // ✅ Test 1: Signup with weak password — should fail
    test("POST /api/auth/signup - weak password should fail", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                name: "Test User",
                email: "test@email.com",
                password: "weak",
                role: "superadmin"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    // ✅ Test 2: Login with invalid credentials — should fail
    test("POST /api/auth/login - invalid credentials should fail", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "nonexistent@email.com",
                password: "WrongPass@123"
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    // ✅ Test 3: Signup with missing fields — should fail
    test("POST /api/auth/signup - missing fields should fail", async () => {
        const res = await request(app)
            .post("/api/auth/signup")
            .send({
                email: "test@email.com"
                // name, password missing
            });

        expect(res.statusCode).toBe(400);
    });

});