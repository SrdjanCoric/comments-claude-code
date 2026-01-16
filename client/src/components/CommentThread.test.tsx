import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import CommentThread from "./CommentThread";

describe("CommentThread", () => {
  const mockComment = {
    id: "4b2d74e6-7d1a-4ba3-9e95-0f52ee8ebc6e",
    author: "Reed Fisher",
    body: "Sint in in sunt amet.",
    postedAt: 1550488214207,
    replies_count: 3,
    replies: [
      {
        id: "116dbd01-d5f3-4dfb-afeb-f822a9264a5e",
        comment_id: "4b2d74e6-7d1a-4ba3-9e95-0f52ee8ebc6e",
        author: "Kathleen Nikolaus",
        body: "Officia suscipit sint sint impedit nemo. Labore aut et quia quasi ut. Eos voluptatibus quidem eius delectus beatae excepturi.",
        postedAt: 1550419941546,
      },
    ],
  };

  const defaultProps = {
    comment: mockComment,
    onMoreReplies: vi.fn(),
    onDeleteComment: vi.fn(),
    onDeleteReply: vi.fn(),
  };

  it("contains how more replies link", () => {
    render(<CommentThread {...defaultProps} />);
    const link = screen.getByRole("link", {
      name: `Show More Replies (${mockComment.replies_count - mockComment.replies.length})`,
    });
    expect(link).toBeInTheDocument();
  });

  it("calls onDeleteComment when parent comment delete is clicked", async () => {
    const onDeleteComment = vi.fn();
    render(<CommentThread {...defaultProps} onDeleteComment={onDeleteComment} />);
    const user = userEvent.setup();
    const deleteButtons = screen.getAllByRole("button", { name: /delete comment/i });

    await user.click(deleteButtons[0]);

    expect(onDeleteComment).toHaveBeenCalledWith(mockComment.id);
  });

  it("calls onDeleteReply when reply delete is clicked", async () => {
    const onDeleteReply = vi.fn();
    render(<CommentThread {...defaultProps} onDeleteReply={onDeleteReply} />);
    const user = userEvent.setup();
    const deleteButtons = screen.getAllByRole("button", { name: /delete comment/i });

    await user.click(deleteButtons[1]);

    expect(onDeleteReply).toHaveBeenCalledWith(mockComment.id, mockComment.replies[0].id);
  });
});
