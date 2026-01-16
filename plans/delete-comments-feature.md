# Delete Functionality Implementation Plan

## Overview

Add delete functionality for comments and replies with a trashcan icon in the top-right corner of each comment/reply card.

**Key Requirements:**
- Trashcan icon button in top-right corner of both comments and replies
- Vanilla CSS styling that blends with existing gray/minimal UI
- Backend DELETE endpoints for comments and replies
- Cascade delete: deleting a comment removes all its replies
- Comprehensive tests for all new functionality

---

## Phase 1: Backend Data Layer

### Step 1.1: Add delete functions to data.js

**File:** `server/data/data.js`

Add two new functions to the `data` object:

```javascript
deleteComment: (commentId) => {
  let comments = JSON.parse(readFileSync(DATA_FILE_PATH));
  const commentIndex = comments.findIndex((c) => c.id === commentId);

  if (commentIndex === -1) {
    return null;
  }

  comments = comments.filter((c) => c.id !== commentId);
  writeFileSync(DATA_FILE_PATH, stringify(comments, null, 2, 100));
  return true;
},

deleteReply: (commentId, replyId) => {
  let comments = JSON.parse(readFileSync(DATA_FILE_PATH));
  const comment = comments.find((c) => c.id === commentId);

  if (!comment) {
    return null;
  }

  const replyIndex = comment.replies.findIndex((r) => r.id === replyId);
  if (replyIndex === -1) {
    return null;
  }

  comment.replies = comment.replies.filter((r) => r.id !== replyId);
  comment.replies_count = comment.replies.length;

  writeFileSync(DATA_FILE_PATH, stringify(comments, null, 2, 100));
  return true;
}
```

**Checklist to proceed:**
- [ ] `deleteComment` function added and returns `null` if not found, `true` on success
- [ ] `deleteReply` function added, updates `replies_count`, returns `null`/`true`
- [ ] Both functions use existing `readFileSync`/`writeFileSync` pattern

---

## Phase 2: Backend API Endpoints

### Step 2.1: Add DELETE routes to server.js

**File:** `server/server.js`

Add these routes (before any catch-all or 404 handlers):

```javascript
app.delete("/api/comments/:id", (req, res) => {
  const commentId = req.params.id;
  const result = data.deleteComment(commentId);
  if (result) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Comment not found" });
  }
});

app.delete("/api/comment_replies/:comment_id/:reply_id", (req, res) => {
  const { comment_id, reply_id } = req.params;
  const result = data.deleteReply(comment_id, reply_id);
  if (result) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: "Reply not found" });
  }
});
```

**Checklist to proceed:**
- [ ] DELETE `/api/comments/:id` endpoint returns 204 on success
- [ ] DELETE `/api/comments/:id` endpoint returns 404 if comment not found
- [ ] DELETE `/api/comment_replies/:comment_id/:reply_id` endpoint returns 204 on success
- [ ] DELETE `/api/comment_replies/:comment_id/:reply_id` endpoint returns 404 if not found
- [ ] Test manually with curl or similar tool

---

## Phase 3: Frontend Service Layer

### Step 3.1: Add delete service functions

**File:** `client/src/services/comments.ts`

Add exports:

```typescript
export const deleteComment = async (commentId: string): Promise<void> => {
  await axios.delete(`/api/comments/${commentId}`);
};

export const deleteReply = async (
  commentId: string,
  replyId: string
): Promise<void> => {
  await axios.delete(`/api/comment_replies/${commentId}/${replyId}`);
};
```

**Note:** Use relative URLs (Vite proxy handles them). No Zod validation needed for 204 responses.

**Checklist to proceed:**
- [ ] `deleteComment` function exported
- [ ] `deleteReply` function exported
- [ ] Both use relative URLs (`/api/...`)
- [ ] TypeScript compiles without errors

---

## Phase 4: CSS Styling

### Step 4.1: Add delete button styles

**File:** `client/src/assets/stylesheets/main.css`

Modify existing `.comment` class and add new styles:

```css
.comment {
  padding-bottom: 20px;
  position: relative;
}

.delete-button {
  position: absolute;
  top: 20px;
  right: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #999;
  transition: color 0.2s ease;
}

.delete-button:hover {
  color: #d32f2f;
}

.delete-button:focus {
  outline: 2px solid #5566cc;
  outline-offset: 2px;
}

.delete-button svg {
  display: block;
}
```

**Design notes:**
- `position: relative` on `.comment` enables absolute positioning of button
- `top: 20px` accounts for the `<hr>` separator above
- Gray (#999) default color, red (#d32f2f) on hover for destructive action
- Focus outline for keyboard accessibility

**Checklist to proceed:**
- [ ] `.comment` has `position: relative` added
- [ ] `.delete-button` styles added
- [ ] Hover and focus states defined

---

## Phase 5: Component Updates

### Step 5.1: Update Comment component

**File:** `client/src/components/Comment.tsx`

Replace entire content with:

```tsx
import moment from "moment";

interface CommentProps {
  id: string;
  author: string;
  body: string;
  postedAt: number;
  onDelete: () => void;
}

const Comment = ({ author, body, postedAt, onDelete }: CommentProps) => {
  return (
    <div className="comment">
      <hr />
      <button
        className="delete-button"
        onClick={onDelete}
        aria-label={`Delete comment by ${author}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
      <div className="image">
        <img src="https://i.postimg.cc/Y0RcrdHp/no-user-image.gif" alt="" />
      </div>
      <div className="header">
        <h3 className="author">{author}</h3>
        <span>{moment(postedAt).fromNow()}</span>
      </div>
      <p>{body}</p>
    </div>
  );
};

export default Comment;
```

**Key changes:**
- Changed from `Pick<CommentType, ...>` to explicit `CommentProps` interface
- Added `id` and `onDelete` props
- Added delete button with inline SVG trashcan icon
- `aria-label` for accessibility

**Checklist to proceed:**
- [ ] `CommentProps` interface includes `id`, `author`, `body`, `postedAt`, `onDelete`
- [ ] Delete button rendered with trashcan SVG
- [ ] `aria-label` set for accessibility
- [ ] `onDelete` callback wired to button click

---

### Step 5.2: Update CommentThread component

**File:** `client/src/components/CommentThread.tsx`

Update props interface:

```typescript
interface CommentThreadProps {
  comment: CommentWithReplies;
  onMoreReplies: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
}
```

Update component to pass delete callbacks:

```tsx
const CommentThread = ({
  comment,
  onMoreReplies,
  onDeleteComment,
  onDeleteReply,
}: CommentThreadProps) => {
  return (
    <div className="parent-comment">
      <Comment
        id={comment.id}
        author={comment.author}
        body={comment.body}
        postedAt={comment.postedAt}
        onDelete={() => onDeleteComment(comment.id)}
      />
      <div className="replies">
        {comment.replies.map((reply) => (
          <Comment
            key={reply.id}
            id={reply.id}
            author={reply.author}
            body={reply.body}
            postedAt={reply.postedAt}
            onDelete={() => onDeleteReply(comment.id, reply.id)}
          />
        ))}
        {comment.replies_count === comment.replies.length ? null : (
          <a
            href="#"
            className="show_more"
            onClick={(e) => {
              e.preventDefault();
              onMoreReplies(comment.id);
            }}
          >
            Show More Replies ({comment.replies_count - comment.replies.length})
          </a>
        )}
      </div>
    </div>
  );
};
```

**Checklist to proceed:**
- [ ] Props interface includes `onDeleteComment` and `onDeleteReply`
- [ ] Parent Comment receives `onDelete={() => onDeleteComment(comment.id)}`
- [ ] Reply Comments receive `onDelete={() => onDeleteReply(comment.id, reply.id)}`
- [ ] All Comment instances receive `id` prop

---

### Step 5.3: Update Comments component

**File:** `client/src/components/Comments.tsx`

Update props interface:

```typescript
interface CommentsProps {
  comments: CommentWithReplies[];
  onMoreReplies: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
}
```

Update to pass callbacks to CommentThread:

```tsx
const Comments = ({
  comments,
  onMoreReplies,
  onDeleteComment,
  onDeleteReply,
}: CommentsProps) => {
  return (
    <div className="comments">
      <h2>Comments ({comments.length})</h2>
      {comments.map((comment) => (
        <CommentThread
          key={comment.id}
          comment={comment}
          onMoreReplies={onMoreReplies}
          onDeleteComment={onDeleteComment}
          onDeleteReply={onDeleteReply}
        />
      ))}
    </div>
  );
};
```

**Checklist to proceed:**
- [ ] Props interface includes `onDeleteComment` and `onDeleteReply`
- [ ] Both callbacks passed to each CommentThread

---

### Step 5.4: Update App component

**File:** `client/src/App.tsx`

Add imports:

```typescript
import {
  createComment,
  deleteComment,
  deleteReply,
  getComments,
  getMoreReplies,
} from "./services/comments.js";
```

Add handler functions:

```typescript
const handleDeleteComment = async (commentId: string) => {
  try {
    await deleteComment(commentId);
    setComments((prevComments) =>
      prevComments.filter((c) => c.id !== commentId)
    );
  } catch (e: unknown) {
    console.log(e);
  }
};

const handleDeleteReply = async (commentId: string, replyId: string) => {
  try {
    await deleteReply(commentId, replyId);
    setComments((prevComments) =>
      prevComments.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: c.replies.filter((r) => r.id !== replyId),
            replies_count: c.replies_count - 1,
          };
        }
        return c;
      })
    );
  } catch (e: unknown) {
    console.log(e);
  }
};
```

Update JSX:

```tsx
<Comments
  comments={comments}
  onMoreReplies={handleMoreReplies}
  onDeleteComment={handleDeleteComment}
  onDeleteReply={handleDeleteReply}
/>
```

**Checklist to proceed:**
- [ ] `deleteComment` and `deleteReply` imported from services
- [ ] `handleDeleteComment` removes comment from state
- [ ] `handleDeleteReply` removes reply and decrements `replies_count`
- [ ] Both handlers passed to Comments component

---

## Phase 6: Testing

### Step 6.1: Create Comment component tests

**File:** `client/src/components/Comment.test.tsx` (new file)

```typescript
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
```

**Checklist to proceed:**
- [ ] Test file created
- [ ] Tests for delete button rendering
- [ ] Tests for onDelete callback
- [ ] Tests for author and body rendering

---

### Step 6.2: Update CommentThread tests

**File:** `client/src/components/CommentThread.test.tsx`

Update existing tests to include new required props and add delete tests:

```typescript
const defaultProps = {
  comment: mockComment,
  onMoreReplies: vi.fn(),
  onDeleteComment: vi.fn(),
  onDeleteReply: vi.fn(),
};

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
```

**Checklist to proceed:**
- [ ] Existing tests updated with new props
- [ ] Test for `onDeleteComment` callback added
- [ ] Test for `onDeleteReply` callback added

---

### Step 6.3: Update App integration tests

**File:** `client/src/App.test.tsx`

Add mocks and tests:

```typescript
import { deleteComment, deleteReply } from "./services/comments";

const mockedDeleteComment = vi.mocked(deleteComment);
const mockedDeleteReply = vi.mocked(deleteReply);

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
```

**Checklist to proceed:**
- [ ] `deleteComment` and `deleteReply` mocked
- [ ] Integration test for comment deletion added
- [ ] Integration test for reply deletion added

---

## Phase 7: Verification

### Manual Testing Checklist

1. **Backend API:**
   - [ ] `curl -X DELETE http://localhost:3001/api/comments/{id}` returns 204
   - [ ] Deleting non-existent comment returns 404
   - [ ] `curl -X DELETE http://localhost:3001/api/comment_replies/{comment_id}/{reply_id}` returns 204
   - [ ] Verify `comments.json` is updated correctly

2. **Frontend UI:**
   - [ ] Trashcan icon visible in top-right of each comment card
   - [ ] Trashcan icon visible in top-right of each reply card
   - [ ] Icon is gray by default, turns red on hover
   - [ ] Clicking delete on comment removes entire thread from UI
   - [ ] Clicking delete on reply removes only that reply
   - [ ] Comment count in header updates after deletion

3. **Automated Tests:**
   - [ ] Run `cd client && npm test` - all tests pass

4. **Accessibility:**
   - [ ] Delete button is keyboard accessible (can tab to it)
   - [ ] Delete button has proper aria-label

---

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| `server/data/data.js` | Modify | Add `deleteComment` and `deleteReply` functions |
| `server/server.js` | Modify | Add DELETE endpoints |
| `client/src/services/comments.ts` | Modify | Add delete service functions |
| `client/src/assets/stylesheets/main.css` | Modify | Add delete button styles |
| `client/src/components/Comment.tsx` | Modify | Add delete button UI, update props |
| `client/src/components/CommentThread.tsx` | Modify | Add delete callback props |
| `client/src/components/Comments.tsx` | Modify | Add delete callback props |
| `client/src/App.tsx` | Modify | Add delete handlers and wire up |
| `client/src/components/Comment.test.tsx` | Create | New test file |
| `client/src/components/CommentThread.test.tsx` | Modify | Add delete tests |
| `client/src/App.test.tsx` | Modify | Add integration tests |

---

## Implementation Order

1. Backend: `data.js` -> `server.js`
2. Frontend services: `comments.ts`
3. CSS: `main.css`
4. Components: `Comment.tsx` -> `CommentThread.tsx` -> `Comments.tsx` -> `App.tsx`
5. Tests: `Comment.test.tsx` -> `CommentThread.test.tsx` -> `App.test.tsx`
