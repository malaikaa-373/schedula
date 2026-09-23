import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";

let adminToken = "";
let businessId = "";
let serviceId = "";
let staffId = "";

// jest.setTimeout(30000);  
// ✅ Test ke baad database connection band karo
afterAll(async () => {
    await mongoose.connection.close();
    // process.exit(0);
});

describe("Booking API Tests", () => {

    // ✅ Before All — Login karo aur IDs lo
    beforeAll(async () => {
        // 1. Login as admin
        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({
                email: "malaikaa373@gmail.com",
                password: "password123"
            });

        if (loginRes.statusCode === 200) {
            adminToken = loginRes.body.data.accessToken;
            businessId = loginRes.body.data.user.businessId;
        }

        // 2. Get services
        if (adminToken) {
            const servicesRes = await request(app)
                .get("/api/services")
                .set("Authorization", `Bearer ${adminToken}`);

            const services = servicesRes.body.services || servicesRes.body.Services || [];
            if (services.length > 0) {
                serviceId = services[0]._id;
                staffId = services[0].assignedStaffIds?.[0];
            }
        }
    });

    // ✅ Test 1: Booking create without token — should fail
    test("POST /api/booking - should fail without auth", async () => {
        const res = await request(app)
            .post("/api/booking")
            .send({
                serviceId: "someid",
                staffId: "someid",
                clientName: "Test",
                clientEmail: "test@email.com",
                startTime: "2026-10-01T10:00:00.000Z",
                endTime: "2026-10-01T10:30:00.000Z",
            });

        expect(res.statusCode).toBe(401);
    });

    // ✅ Test 2: Booking with missing fields — should fail
    test("POST /api/booking - should fail with missing fields", async () => {
        const res = await request(app)
            .post("/api/booking")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                clientName: "Test",
                // serviceId, staffId missing
            });

        expect(res.statusCode).toBe(400);
    });

    // ✅ Test 3: Booking creation — conflict prevention
    test("POST /api/booking - should prevent double booking", async () => {
        // Agar IDs nahi mile — skip
        if (!serviceId || !staffId || !businessId) {
            console.log("Skipping: IDs not available");
            return;
        }

        const bookingData = {
            serviceId,
            staffId,
            clientName: "Test Client",
            clientEmail: "test@email.com",
            startTime: "2026-10-01T10:00:00.000Z",
            endTime: "2026-10-01T10:30:00.000Z",
            businessId,
        };

        // 1. Pehli booking
        const res1 = await request(app)
            .post("/api/booking")
            .set("Authorization", `Bearer ${adminToken}`)
            .send(bookingData);

        // Pehli booking success ya conflict — dono possible
        expect([201, 409]).toContain(res1.statusCode);

        // 2. Doosri booking — same slot
        const res2 = await request(app)
            .post("/api/booking")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                ...bookingData,
                clientName: "Test Client 2",
                clientEmail: "test2@email.com",
            });

        // ✅ Conflict prevention — 409 aana chahiye
        expect(res2.statusCode).toBe(409);
    });

});