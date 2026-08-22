import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

const navigate = vi.fn();

vi.mock("firebase/auth", () => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("../firebase", () => ({
  auth: { name: "test-auth" },
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

const renderForgotPasswordPage = () =>
  render(
    <MemoryRouter>
      <ForgotPasswordPage />
    </MemoryRouter>,
  );

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("renders the reset password form", () => {
    renderForgotPasswordPage();

    expect(screen.getByRole("heading", { name: "Reset Password Form" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email address")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send Email Reset Link" })).toBeInTheDocument();
  });

  it("sends a reset email, shows the confirmation alert, and navigates to login", async () => {
    sendPasswordResetEmail.mockResolvedValueOnce({});
    renderForgotPasswordPage();

    fireEvent.change(screen.getByPlaceholderText("Enter your email address"), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Email Reset Link" }));

    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(auth, "user@example.com");
      expect(window.alert).toHaveBeenCalledWith("Check your email for reset link");
      expect(navigate).toHaveBeenCalledWith("/login");
    });
  });

  it("displays the reset error without navigating", async () => {
    sendPasswordResetEmail.mockRejectedValueOnce(new Error("User not found"));
    renderForgotPasswordPage();

    fireEvent.change(screen.getByPlaceholderText("Enter your email address"), {
      target: { value: "missing@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Email Reset Link" }));

    expect(await screen.findByText("User not found")).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("navigates back to the login page", () => {
    renderForgotPasswordPage();

    fireEvent.click(screen.getByText("Back to Login"));

    expect(navigate).toHaveBeenCalledWith("/login");
  });
});
