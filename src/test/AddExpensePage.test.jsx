import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddExpensePage from "../pages/AddExpensePage";
import { useUserAuth } from "../context/UserAuthContext";
import { addDoc, collection } from "firebase/firestore";
import { auth, database } from "../firebase";

vi.mock("../components/Navbar", () => ({
  default: () => <nav>Navbar</nav>,
}));

vi.mock("../context/UserAuthContext", () => ({
  useUserAuth: vi.fn(),
}));

vi.mock("../firebase", () => ({
  auth: { currentUser: { uid: "user-123" } },
  database: { name: "test-database" },
}));

vi.mock("firebase/firestore", () => ({
  addDoc: vi.fn(),
  collection: vi.fn((database, collectionName) => ({ database, collectionName })),
}));

const renderAddExpensePage = () => render(<AddExpensePage />);

describe("AddExpensePage", () => {
  const logOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    auth.currentUser = { uid: "user-123" };
    useUserAuth.mockReturnValue({ LogOut: logOut });
    addDoc.mockResolvedValueOnce({ id: "expense-1" });
  });

  it("renders the expense form", () => {
    renderAddExpensePage();

    expect(screen.getByRole("heading", { name: "Add Expense Form" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0.00")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("saves an expense for the authenticated user", async () => {
    const { container } = renderAddExpensePage();

    fireEvent.change(screen.getByPlaceholderText("0.00"), {
      target: { value: "42.50" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "food" },
    });
    fireEvent.change(container.querySelector('input[type="date"]'), {
      target: { value: "2026-08-22" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(collection).toHaveBeenCalledWith(database, "Expenses");
      expect(addDoc).toHaveBeenCalledWith(
        { database, collectionName: "Expenses" },
        {
          userId: "user-123",
          amount: 42.5,
          category: "food",
          date: "2026-08-22",
        },
      );
      expect(screen.getByText("Expense saved successfully")).toBeInTheDocument();
    });
  });

  it("logs out and does not save when no user is authenticated", async () => {
    auth.currentUser = null;
    renderAddExpensePage();

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(screen.getByText("User not signed in, please sign in")).toBeInTheDocument();
      expect(logOut).toHaveBeenCalledTimes(1);
      expect(addDoc).not.toHaveBeenCalled();
    });
  });

  it("displays a Firestore error when saving fails", async () => {
    addDoc.mockReset();
    addDoc.mockRejectedValueOnce(new Error("Unable to save expense"));
    renderAddExpensePage();

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Unable to save expense")).toBeInTheDocument();
  });
});
