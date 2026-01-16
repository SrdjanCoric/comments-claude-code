import axios from "axios";
import { z } from "zod";
import type { NewComment } from "../types";
import { commentWithRepliesSchema, replySchema } from "../types";

const commentsWithRepliesSchema = z.array(commentWithRepliesSchema);
const repliesSchema = z.array(replySchema);

export const getComments = async () => {
  const { data } = await axios.get("http://localhost:3001/api/comments");
  return commentsWithRepliesSchema.parse(data);
};

export const getMoreReplies = async (commentId: string) => {
  const { data } = await axios.get(
    `/api/comment_replies?comment_id=${commentId}`
  );

  return repliesSchema.parse(data);
};

export const createComment = async (newComment: NewComment) => {
  const { data } = await axios.post("/api/comments", { ...newComment });
  return commentWithRepliesSchema.parse(data);
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await axios.delete(`/api/comments/${commentId}`);
};

export const deleteReply = async (
  commentId: string,
  replyId: string
): Promise<void> => {
  await axios.delete(`/api/comment_replies/${commentId}/${replyId}`);
};
