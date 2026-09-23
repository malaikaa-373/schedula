import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login";

describe("Login Form", () => {
    it("should render login form", () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // ✅ Email input check
        const emailInput = screen.getByPlaceholderText(/email/i);
        expect(emailInput).toBeInTheDocument();

        // ✅ Password input check
        const passwordInput = screen.getByPlaceholderText(/password/i);
        expect(passwordInput).toBeInTheDocument();

        // ✅ Login button check
        const loginBtn = screen.getByRole("button", { name: /login/i });
        expect(loginBtn).toBeInTheDocument();
    });
});