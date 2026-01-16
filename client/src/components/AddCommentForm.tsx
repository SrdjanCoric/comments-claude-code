import React from "react";
import type { NewComment } from "../types";

interface AddCommentFormProps {
  onSubmit: (newComment: NewComment, callback?: () => void) => void;
}

const AddCommentForm = ({ onSubmit }: AddCommentFormProps) => {
  const [author, setAuthor] = React.useState("");
  const [body, setBody] = React.useState("");

  const handleReset = () => {
    setAuthor("");
    setBody("");
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onSubmit({ author, body }, handleReset);
  };

  const isFormValid = author.trim() && body.trim();

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <header className="comment-form__header">
        <h2 className="comment-form__title">Share Your Thoughts</h2>
        <p className="comment-form__subtitle">Join the discussion below</p>
      </header>

      <div className="comment-form__body">
        <div className="form-field">
          <label htmlFor="author" className="form-field__label">
            Your Name
          </label>
          <input
            id="author"
            type="text"
            name="author"
            className="form-field__input"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="body" className="form-field__label">
            Your Comment
          </label>
          <textarea
            id="body"
            name="body"
            className="form-field__textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            required
          />
        </div>
      </div>

      <footer className="comment-form__footer">
        <button type="submit" className="btn btn--primary" disabled={!isFormValid}>
          <span>Post Comment</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </footer>
    </form>
  );
};

export default AddCommentForm;
