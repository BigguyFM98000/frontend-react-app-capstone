import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage.jsx";
import { useUserAuth } from "../context/UserAuthContext.jsx";

const navigate = vi.fn();
const signUp = vi.fn();

vi.mock("../context/UserAuthContext.jsx", () => ({
  useUserAuth: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

const renderRegisterPage = () =>
  render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>,
  );

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUserAuth.mockReturnValue({ signUp });
  });

  it("renders the registration form and login link", () => {
    renderRegisterPage();

    expect(screen.getByRole("heading", { name: "Register Form" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("href", "/login");
  });

  it("registers the user and navigates to login", async () => {
    signUp.mockResolvedValueOnce({});
    renderRegisterPage();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "new-user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith("new-user@example.com", "secret123");
      expect(navigate).toHaveBeenCalledWith("/login");
    });
  });

  it("displays the registration error", async () => {
    signUp.mockRejectedValueOnce(new Error("Email already in use"));
    renderRegisterPage();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Register" }));

    expect(await screen.findByText("Email already in use")).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });
});
