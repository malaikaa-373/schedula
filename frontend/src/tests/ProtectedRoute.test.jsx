import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// ✅ Test Component — ProtectedRoute ke andar render hoga
const TestComponent = () => <div>Protected Content</div>;

// ✅ Login Page — agar access block ho toh yahan aayega
const LoginPage = () => <div>Login Page</div>;

describe("ProtectedRoute Component", () => {

    // ✅ Har test se pehle localStorage clear karo
    beforeEach(() => {
        localStorage.clear();
    });

    // ✅ Test 1: Without token — should redirect to login
    it("should redirect to login when no token", () => {
        render(
            <MemoryRouter initialEntries={["/protected"]}>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <TestComponent />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        // ✅ Protected content nahi dikhna chahiye
        expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    // ✅ Test 2: With token — should render protected content
    it("should render children when token exists", () => {
        // ✅ localStorage mein token set karo
        localStorage.setItem(
            "auth-storage",
            JSON.stringify({
                state: {
                    token: "test_token_123",
                    user: { name: "Test User", role: "admin" },
                },
                version: 0,
            })
        );

        render(
            <MemoryRouter initialEntries={["/protected"]}>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route
                        path="/protected"
                        element={
                            <ProtectedRoute>
                                <TestComponent />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        // ✅ Protected content dikhna chahiye
        expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

});