import App from "./App";
import { render, screen } from "@testing-library/react";
import { deleteComment, deleteReply, getComments, getMoreReplies } from "./services/comments";
import userEvent from "@testing-library/user-event";
// import * as commentService from "./services/comments"

vi.mock("./services/comments.ts");

const mockedGetComments = vi.mocked(getComments);
const mockedGetMoreReplies = vi.mocked(getMoreReplies);
const mockedDeleteComment = vi.mocked(deleteComment);
const mockedDeleteReply = vi.mocked(deleteReply);

afterEach(() => {
  vi.resetAllMocks();
});

it("renders authors name", async () => {
  const mockedComments = [
    {
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
    },
  ];
  mockedGetComments.mockResolvedValue(mockedComments);
  render(<App />);

  const author = await screen.findByRole("heading", { name: /Reed/ });
  expect(author).toBeInTheDocument();
});

it("removes show more button when all replies are loaded", async () => {
  const mockedComments = [
    {
      id: "4b2d74e6-7d1a-4ba3-9e95-0f52ee8ebc6e",
      author: "Reed Fisher",
      body: "Sint in in sunt amet.",
      postedAt: 1550488214207,
      replies_count: 2,
      replies: [
        {
          id: "116dbd01-d5f3-4dfb-afeb-f822a9264a5e",
          comment_id: "4b2d74e6-7d1a-4ba3-9e95-0f52ee8ebc6e",
          author: "Kathleen Nikolaus",
          body: "Officia suscipit sint sint impedit nemo. Labore aut et quia quasi ut. Eos voluptatibus quidem eius delectus beatae excepturi.",
          postedAt: 1550419941546,
        },
      ],
    },
  ];
  const mockedReplies = [
    {
      id: "116dbd01-d5f3-4dfb-afeb-f822a9262343214",
      comment_id: "4b2d74e6-7d1a-4ba3-9e95-0f52ee8ebc6e",
      author: "John Doe",
      body: "Some comment",
      postedAt: 1550419941549,
    },
  ];

  mockedGetComments.mockResolvedValue(mockedComments);
  mockedGetMoreReplies.mockResolvedValue(mockedReplies);
  render(<App />);
  const showMoreButton = await screen.findByRole("button", { name: /Show.*more.*reply/i });
  const user = userEvent.setup();
  expect(showMoreButton).toBeInTheDocument();

  await user.click(showMoreButton);

  const removedButton = screen.queryByRole("button", { name: /Show.*more.*reply/i });
  expect(removedButton).not.toBeInTheDocument();
});

it("removes comment from list when delete button is clicked", async () => {
  const mockedComments = [
    {
      id: "comment-1",
      author: "Reed Fisher",
      body: "First comment",
      postedAt: 1550488214207,
      replies_count: 0,
      replies: [],
    },
    {
      id: "comment-2",
      author: "Jane Doe",
      body: "Second comment",
      postedAt: 1550488214208,
      replies_count: 0,
      replies: [],
    },
  ];
  mockedGetComments.mockResolvedValue(mockedComments);
  mockedDeleteComment.mockResolvedValue(undefined);

  render(<App />);
  const user = userEvent.setup();

  await screen.findByRole("heading", { name: /Reed Fisher/i });
  const deleteButtons = screen.getAllByRole("button", { name: /delete comment/i });

  await user.click(deleteButtons[0]);

  expect(mockedDeleteComment).toHaveBeenCalledWith("comment-1");
  expect(screen.queryByRole("heading", { name: /Reed Fisher/i })).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /Jane Doe/i })).toBeInTheDocument();
});

it("removes reply from list when delete button is clicked", async () => {
  const mockedComments = [
    {
      id: "comment-1",
      author: "Reed Fisher",
      body: "Parent comment",
      postedAt: 1550488214207,
      replies_count: 1,
      replies: [
        {
          id: "reply-1",
          comment_id: "comment-1",
          author: "Kathleen Nikolaus",
          body: "Reply text",
          postedAt: 1550419941546,
        },
      ],
    },
  ];
  mockedGetComments.mockResolvedValue(mockedComments);
  mockedDeleteReply.mockResolvedValue(undefined);

  render(<App />);
  const user = userEvent.setup();

  await screen.findByRole("heading", { name: /Kathleen Nikolaus/i });
  const deleteButtons = screen.getAllByRole("button", { name: /delete comment/i });

  await user.click(deleteButtons[1]);

  expect(mockedDeleteReply).toHaveBeenCalledWith("comment-1", "reply-1");
  expect(screen.queryByRole("heading", { name: /Kathleen Nikolaus/i })).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /Reed Fisher/i })).toBeInTheDocument();
});
