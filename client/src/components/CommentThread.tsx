import type { CommentWithReplies } from "../types";
import Comment from "./Comment";

interface CommentThreadProps {
  comment: CommentWithReplies;
  onMoreReplies: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
  animationDelay?: number;
}

const CommentThread = ({
  comment,
  onMoreReplies,
  onDeleteComment,
  onDeleteReply,
  animationDelay = 0,
}: CommentThreadProps) => {
  const remainingReplies = comment.replies_count - comment.replies.length;

  return (
    <article
      className="comment-thread"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <Comment
        id={comment.id}
        author={comment.author}
        body={comment.body}
        postedAt={comment.postedAt}
        onDelete={() => onDeleteComment(comment.id)}
        isParent={true}
      />

      {comment.replies.length > 0 && (
        <div className="replies-container">
          <div className="replies-connector" aria-hidden="true" />
          <div className="replies-list">
            {comment.replies.map((reply) => (
              <Comment
                key={reply.id}
                id={reply.id}
                author={reply.author}
                body={reply.body}
                postedAt={reply.postedAt}
                onDelete={() => onDeleteReply(comment.id, reply.id)}
                isParent={false}
              />
            ))}
          </div>
        </div>
      )}

      {remainingReplies > 0 && (
        <button
          className="show-more-button"
          onClick={() => onMoreReplies(comment.id)}
          aria-expanded="false"
        >
          <span className="show-more-icon" aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </span>
          <span>
            Show {remainingReplies} more{" "}
            {remainingReplies === 1 ? "reply" : "replies"}
          </span>
        </button>
      )}
    </article>
  );
};
export default CommentThread;
