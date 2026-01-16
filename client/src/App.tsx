import React from "react";
import AddCommentForm from "./components/AddCommentForm";
import Comments from "./components/Comments";
import { type CommentWithReplies, type NewComment } from "./types/index.js";
import {
  createComment,
  deleteComment,
  deleteReply,
  getComments,
  getMoreReplies,
} from "./services/comments.js";
import { ZodError } from "zod";

const App = () => {
  const [comments, setComments] = React.useState<CommentWithReplies[]>([]);

  React.useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments();
        setComments(data);
      } catch (e: unknown) {
        if (e instanceof ZodError) {
          console.log(e);
        }
        console.log(e);
      }
    };
    fetchComments();
  }, []);

  // Name handleSomething when you are defining it

  // Name onSomething when you are passing it as a prop

  const handleMoreReplies = async (commentId: string) => {
    try {
      const data = await getMoreReplies(commentId);

      setComments((prevComments) => {
        return prevComments.map((c) => {
          if (c.id === commentId) {
            return { ...c, replies: c.replies.concat(data) };
          } else {
            return c;
          }
        });
      });
    } catch (e: unknown) {
      console.log(e);
    }
  };

  const handleSubmit = async (
    newComment: NewComment,
    callback?: () => void
  ) => {
    try {
      const data = await createComment(newComment);
      setComments((prevComments) => prevComments.concat(data));
      if (callback) {
        callback();
      }
    } catch (e: unknown) {
      console.log(e);
    }
  };

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

  return (
    <div className="app">
      <header className="page-header">
        <h1 className="page-title">Discussion</h1>
        <p className="page-subtitle">Join the conversation</p>
      </header>
      <main className="main-content">
        <AddCommentForm onSubmit={handleSubmit} />
        <Comments
          comments={comments}
          onMoreReplies={handleMoreReplies}
          onDeleteComment={handleDeleteComment}
          onDeleteReply={handleDeleteReply}
        />
      </main>
    </div>
  );
};

export default App;
