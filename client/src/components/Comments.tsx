import type { CommentWithReplies } from "../types";
import CommentThread from "./CommentThread";

interface CommentsProps {
  comments: CommentWithReplies[];
  onMoreReplies: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
}

const Comments = ({
  comments,
  onMoreReplies,
  onDeleteComment,
  onDeleteReply,
}: CommentsProps) => {
  return (
    <section className="comments-section" aria-labelledby="comments-heading">
      <header className="comments-header">
        <h2 id="comments-heading" className="comments-title">
          Comments
          <span className="comments-count">{comments.length}</span>
        </h2>
      </header>
      <div className="comments-list">
        {comments.map((comment, index) => (
          <CommentThread
            key={comment.id}
            comment={comment}
            onMoreReplies={onMoreReplies}
            onDeleteComment={onDeleteComment}
            onDeleteReply={onDeleteReply}
            animationDelay={index * 50}
          />
        ))}
      </div>
    </section>
  );
};

export default Comments;
