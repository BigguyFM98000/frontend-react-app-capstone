import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";

const renderNotFoundPage = () =>
  render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>,
  );

describe("NotFoundPage", () => {
  it("renders the not-found message", () => {
    renderNotFoundPage();

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(
      screen.getByText("The page you’re looking for doesn’t exist or may have been moved."),
    ).toBeInTheDocument();
  });

  it("links the user to the login page", () => {
    renderNotFoundPage();

    expect(screen.getByRole("link", { name: "Go to Login" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
