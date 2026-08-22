import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfilePage from "../pages/ProfilePage";
import { useUserAuth } from "../context/UserAuthContext";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase";

const navigate = vi.fn();

vi.mock("../components/Navbar", () => ({
  default: () => <nav>Navbar</nav>,
}));

vi.mock("../context/UserAuthContext", () => ({
  useUserAuth: vi.fn(),
}));

vi.mock("../firebase", () => ({
  auth: { currentUser: null },
}));

vi.mock("firebase/auth", () => ({
  updateProfile: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigate,
}));

const renderProfilePage = () => render(<ProfilePage />);

const currentUser = {
  uid: "user-123",
  displayName: "Jane Doe",
  email: "jane@example.com",
  photoURL: "https://example.com/jane.jpg",
};

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.currentUser = currentUser;
    useUserAuth.mockReturnValue({ user: currentUser });
    updateProfile.mockResolvedValue(undefined);
  });

  it("renders the user's profile information", async () => {
    renderProfilePage();

    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveValue("Jane");
      expect(screen.getByLabelText("Surname")).toHaveValue("Doe");
      expect(screen.getByLabelText("Email")).toHaveValue("jane@example.com");
    });
    expect(screen.getByRole("heading", { name: "Profile Information" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeDisabled();
  });

  it("updates the user's display name", async () => {
    renderProfilePage();

    await screen.findByDisplayValue("Jane");
    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Janet" },
    });
    fireEvent.change(screen.getByLabelText("Surname"), {
      target: { value: "Smith" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Update Profile" }));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(currentUser, {
        displayName: "Janet Smith",
      });
    });
  });

  it("does not update Firebase when there is no current user", async () => {
    auth.currentUser = null;
    renderProfilePage();

    await screen.findByDisplayValue("Jane");
    fireEvent.click(screen.getByRole("button", { name: "Update Profile" }));

    await waitFor(() => {
      expect(updateProfile).not.toHaveBeenCalled();
    });
  });

  it("navigates to the dashboard when cancelling", async () => {
    renderProfilePage();

    await screen.findByDisplayValue("Jane");
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(navigate).toHaveBeenCalledWith("/dashboard");
  });
});
