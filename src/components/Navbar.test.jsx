import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { useUserAuth } from "../context/UserAuthContext";

const navigate = vi.fn();
const logOut = vi.fn();

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

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  );

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "log").mockImplementation(() => {});
    useUserAuth.mockReturnValue({ logOut, user: { uid: "user-123" } });
    logOut.mockResolvedValue(undefined);
  });

  it("renders the brand and navigation links", () => {
    renderNavbar();

    expect(screen.getByRole("link", { name: "ExpenseTracker" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByRole("link", { name: /Profile/ })).toHaveAttribute(
      "href",
      "/profile",
    );
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByRole("link", { name: "Logout" })).toBeInTheDocument();
  });

  it("navigates to add expense and help pages", () => {
    renderNavbar();

    fireEvent.click(screen.getByRole("button", { name: "Add Expense" }));
    fireEvent.click(screen.getByRole("button", { name: "Get Help" }));

    expect(navigate).toHaveBeenNthCalledWith(1, "/add");
    expect(navigate).toHaveBeenNthCalledWith(2, "/help");
  });

  it("logs out and navigates to login", async () => {
    renderNavbar();

    fireEvent.click(screen.getByRole("link", { name: "Logout" }));

    await waitFor(() => {
      expect(logOut).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith("/login");
    });
  });

  it("does not navigate when logout fails", async () => {
    logOut.mockRejectedValueOnce(new Error("Logout failed"));
    renderNavbar();

    fireEvent.click(screen.getByRole("link", { name: "Logout" }));

    await waitFor(() => {
      expect(logOut).toHaveBeenCalledTimes(1);
    });
    expect(navigate).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Logout failed");
  });
});
