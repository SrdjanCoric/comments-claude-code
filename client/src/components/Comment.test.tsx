import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import Comment from "./Comment";

describe("Comment", () => {
  const defaultProps = {
    id: "test-id",
    author: "John Doe",
    body: "Test comment body",
    postedAt: Date.now(),
    onDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the delete button", () => {
    render(<Comment {...defaultProps} />);
    const deleteButton = screen.getByRole("button", {
      name: /delete comment by john doe/i,
    });
    expect(deleteButton).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", async () => {
    const onDelete = vi.fn();
    render(<Comment {...defaultProps} onDelete={onDelete} />);
    const user = userEvent.setup();
    const deleteButton = screen.getByRole("button", {
      name: /delete comment/i,
    });

    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("renders author name", () => {
    render(<Comment {...defaultProps} />);
    expect(screen.getByRole("heading", { name: /john doe/i })).toBeInTheDocument();
  });

  it("renders comment body", () => {
    render(<Comment {...defaultProps} />);
    expect(screen.getByText("Test comment body")).toBeInTheDocument();
  });
});
