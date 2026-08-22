import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import { useUserAuth } from "../context/UserAuthContext";

const navigate = vi.fn();
const logIn = vi.fn();
const googleSignIn = vi.fn();

vi.mock("../context/UserAuthContext", () => ({
  useUserAuth: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

const renderLoginPage = () =>
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUserAuth.mockReturnValue({ logIn, googleSignIn });
  });

  it("renders the login form and authentication links", () => {
    renderLoginPage();

    expect(screen.getByRole("heading", { name: "Login Form" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Forgot Password?" })).toHaveAttribute("href", "/reset");
    expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute("href", "/register");
  });

  it("logs in with email and password and navigates to the dashboard", async () => {
    logIn.mockResolvedValueOnce({});
    renderLoginPage();

    fireEvent.change(screen.getByPlaceholderText("Enter your email address"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(logIn).toHaveBeenCalledWith("user@example.com", "secret123");
      expect(navigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays an email login error without navigating", async () => {
    logIn.mockRejectedValueOnce(new Error("Invalid credentials"));
    renderLoginPage();

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("signs in with Google and navigates to the dashboard", async () => {
    googleSignIn.mockResolvedValueOnce({});
    renderLoginPage();

    fireEvent.click(screen.getByRole("button", { name: "Sign in with Google" }));

    await waitFor(() => {
      expect(googleSignIn).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays a Google sign-in error without navigating", async () => {
    googleSignIn.mockRejectedValueOnce(new Error("Google sign-in failed"));
    renderLoginPage();

    fireEvent.click(screen.getByRole("button", { name: "Sign in with Google" }));

    expect(await screen.findByText("Google sign-in failed")).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });

  it("navigates back to the welcome page", () => {
    renderLoginPage();

    fireEvent.click(screen.getByText("Back to welcome"));

    expect(navigate).toHaveBeenCalledWith("/");
  });
});
