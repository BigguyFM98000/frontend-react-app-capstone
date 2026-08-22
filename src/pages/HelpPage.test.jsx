import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HelpPage from "./HelpPage";
import emailjs from "@emailjs/browser";

vi.mock("../components/Navbar", () => ({
  default: () => <nav>Navbar</nav>,
}));

vi.mock("@emailjs/browser", () => ({
  default: {
    sendForm: vi.fn(),
  },
}));

const renderHelpPage = () => render(<HelpPage />);

describe("HelpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("renders the help contact form", () => {
    renderHelpPage();

    expect(screen.getByRole("heading", { name: "Help Contact Form" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send Email" })).toBeInTheDocument();
  });

  it("sends the completed contact form and displays success", async () => {
    emailjs.sendForm.mockResolvedValueOnce({});
    renderHelpPage();

    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your email address"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your message"), {
      target: { value: "I need help with my account." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send Email" }));

    await waitFor(() => {
      expect(emailjs.sendForm).toHaveBeenCalledTimes(1);
      expect(emailjs.sendForm.mock.calls[0][0]).toBe(import.meta.env.VITE_SERVICE_ID);
      expect(emailjs.sendForm.mock.calls[0][1]).toBe(import.meta.env.VITE_TEMPLATE_ID);
      expect(emailjs.sendForm.mock.calls[0][2]).toBeInstanceOf(HTMLFormElement);
      expect(emailjs.sendForm.mock.calls[0][3]).toEqual({
        publicKey: import.meta.env.VITE_PUBLIC_KEY,
      });
      expect(screen.getByText("Email Sent Successfully!")).toBeInTheDocument();
    });
  });

  it("displays the EmailJS error when sending fails", async () => {
    emailjs.sendForm.mockRejectedValueOnce({ text: "Unable to send message" });
    renderHelpPage();

    fireEvent.click(screen.getByRole("button", { name: "Send Email" }));

    expect(await screen.findByText("Unable to send message")).toBeInTheDocument();
  });
});
