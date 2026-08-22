import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DashboardPage from "../pages/DashboardPage";
import { useUserAuth } from "../context/UserAuthContext";
import {
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const navigate = vi.fn();

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
  collection: vi.fn((database, collectionName) => ({ database, collectionName })),
  deleteDoc: vi.fn(),
  doc: vi.fn((database, collectionName, documentId) => ({
    database,
    collectionName,
    documentId,
  })),
  getDocs: vi.fn(),
  query: vi.fn((collectionReference, condition) => ({
    collectionReference,
    condition,
  })),
  where: vi.fn((field, operator, value) => ({ field, operator, value })),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigate,
}));

const renderDashboardPage = () => render(<DashboardPage />);

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUserAuth.mockReturnValue({ user: { uid: "user-123" } });
    getDocs.mockResolvedValue({ docs: [] });
    deleteDoc.mockResolvedValue(undefined);
  });

  it("shows the default message while expenses are loading", () => {
    getDocs.mockReturnValueOnce(new Promise(() => {}));
    renderDashboardPage();

    expect(
      screen.getByText("No expenses added. Click Add Expense to add an expense"),
    ).toBeInTheDocument();
  });

  it("shows the default message when the user has no expenses", async () => {
    renderDashboardPage();

    expect(
      await screen.findByText("No expenses added. Click Add Expense to add an expense"),
    ).toBeInTheDocument();
  });

  it("loads only expenses belonging to the logged-in user", async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: "expense-1",
          data: () => ({ userId: "user-123", category: "food", amount: 25 }),
        },
      ],
    });
    renderDashboardPage();

    expect(await screen.findByText("food")).toBeInTheDocument();
    expect(where).toHaveBeenCalledWith("userId", "==", "user-123");
    expect(query).toHaveBeenCalled();
    expect(getDocs).toHaveBeenCalledTimes(1);
  });

  it("navigates to an expense update page", async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: "expense-1",
          data: () => ({ userId: "user-123", category: "food", amount: 25 }),
        },
      ],
    });
    renderDashboardPage();

    fireEvent.click(await screen.findByRole("button", { name: "Update" }));

    expect(navigate).toHaveBeenCalledWith("/update/expense-1");
  });

  it("deletes the selected expense", async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        {
          id: "expense-1",
          data: () => ({ userId: "user-123", category: "food", amount: 25 }),
        },
      ],
    });
    renderDashboardPage();

    fireEvent.click(await screen.findByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(doc).toHaveBeenCalledWith(
        { name: "test-database" },
        "Expenses",
        "expense-1",
      );
      expect(deleteDoc).toHaveBeenCalledWith({
        database: { name: "test-database" },
        collectionName: "Expenses",
        documentId: "expense-1",
      });
    });
  });

  it("shows no expenses when there is no logged-in user", async () => {
    useUserAuth.mockReturnValue({ user: null });
    renderDashboardPage();

    expect(
      await screen.findByText("No expenses added. Click Add Expense to add an expense"),
    ).toBeInTheDocument();
    expect(getDocs).not.toHaveBeenCalled();
  });
});
