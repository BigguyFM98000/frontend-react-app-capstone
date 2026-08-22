import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UpdateExpensePage from "../pages/UpdateExpensePage";
import { useUserAuth } from "../context/UserAuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "../firebase";

const navigate = vi.fn();
const expenseReference = { name: "expense-reference" };

vi.mock("../components/Navbar", () => ({
  default: () => <nav>Navbar</nav>,
}));

vi.mock("../context/UserAuthContext", () => ({
  useUserAuth: vi.fn(),
}));

vi.mock("../firebase", () => ({
  database: { name: "test-database" },
}));

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(() => expenseReference),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigate,
  useParams: () => ({ id: "expense-1" }),
}));

const renderUpdateExpensePage = () => render(<UpdateExpensePage />);

const ownedExpenseSnapshot = () => ({
  exists: () => true,
  id: "expense-1",
  data: () => ({
    userId: "user-123",
    amount: 25,
    category: "food",
    date: "2026-08-20",
  }),
});

describe("UpdateExpensePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUserAuth.mockReturnValue({ user: { uid: "user-123" } });
    getDoc.mockResolvedValue(ownedExpenseSnapshot());
    updateDoc.mockResolvedValue(undefined);
  });

  it("loads an owned expense into the update form", async () => {
    const { container } = renderUpdateExpensePage();

    expect(await screen.findByRole("heading", { name: "Update Expense Form" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("25")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("food");
    expect(container.querySelector('input[type="date"]')).toHaveValue("2026-08-20");
    expect(doc).toHaveBeenCalledWith(database, "Expenses", "expense-1");
  });

  it("redirects when the expense belongs to another user", async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      id: "expense-1",
      data: () => ({ userId: "another-user", amount: 25, category: "food", date: "2026-08-20" }),
    });
    renderUpdateExpensePage();

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/dashboard", { replace: true });
    });
    expect(screen.queryByRole("button", { name: "Update" })).not.toBeInTheDocument();
  });

  it("updates the owned expense", async () => {
    const { container } = renderUpdateExpensePage();
    await screen.findByRole("button", { name: "Update" });

    fireEvent.change(screen.getByDisplayValue("25"), {
      target: { value: "40" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "transport" },
    });
    fireEvent.change(container.querySelector('input[type="date"]'), {
      target: { value: "2026-08-22" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(expenseReference, {
        amount: "40",
        category: "transport",
        date: "2026-08-22",
      });
      expect(screen.getByText("Expense updated successfully")).toBeInTheDocument();
    });
  });

  it("displays an error when updating fails", async () => {
    updateDoc.mockRejectedValueOnce(new Error("Unable to update expense"));
    const { container } = renderUpdateExpensePage();
    await screen.findByRole("button", { name: "Update" });

    fireEvent.click(screen.getByRole("button", { name: "Update" }));

    await waitFor(() => {
      expect(container.querySelector(".alert-error")).toHaveTextContent("Error while updating:");
    });
  });
});
