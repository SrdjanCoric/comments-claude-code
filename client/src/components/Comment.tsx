import moment from "moment";

interface CommentProps {
  id: string;
  author: string;
  body: string;
  postedAt: number;
  onDelete: () => void;
  isParent?: boolean;
}

const Comment = ({
  author,
  body,
  postedAt,
  onDelete,
  isParent = true,
}: CommentProps) => {
  const initials = author
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const avatarColorIndex = (author.charCodeAt(0) % 5) + 1;

  return (
    <div
      className={`comment-card ${isParent ? "comment-card--parent" : "comment-card--reply"}`}
    >
      <div className="comment-avatar" data-color={avatarColorIndex}>
        <span>{initials}</span>
      </div>

      <div className="comment-content">
        <header className="comment-header">
          <h3 className="comment-author">{author}</h3>
          <time
            className="comment-time"
            dateTime={new Date(postedAt).toISOString()}
          >
            {moment(postedAt).fromNow()}
          </time>
        </header>

        <div className="comment-body">
          <p>{body}</p>
        </div>
      </div>

      <button
        className="comment-delete"
        onClick={onDelete}
        aria-label={`Delete comment by ${author}`}
        title="Delete comment"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  );
};

export default Comment;
