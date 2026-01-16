import type { CommentWithReplies } from "../types";
import Comment from "./Comment";

interface CommentThreadProps {
  comment: CommentWithReplies;
  onMoreReplies: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
}

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
export default CommentThread;
