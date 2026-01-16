const { readFileSync, writeFileSync } = require('fs');
const {v4: uuidv4} = require('uuid');
const path = require('path');
const stringify = require('json-beautify');
const DATA_FILE_PATH = path.join(__dirname, 'comments.json');

const data = {
  getCommentsWithOneReply: () => {
    const comments = JSON.parse(readFileSync(DATA_FILE_PATH));
    return comments.map((c) => Object.assign({}, c, {replies: c.replies.slice(0, 1)}));
  },

  getRepliesForComment: (id) => {
    const comments = JSON.parse(readFileSync(DATA_FILE_PATH));
    return comments.find((c) => c.id === id).replies.slice(1);
  },

  saveComment: (commentFields) => {
    const newComment = Object.assign(
                        {},
                        commentFields,
                        {
                          id: uuidv4(),
                          postedAt: +Date.now(),
                          replies_count: 0,
                          replies: []
                        }
    );

    let comments = JSON.parse(readFileSync(DATA_FILE_PATH));
    comments = comments.concat(newComment);
    writeFileSync(DATA_FILE_PATH, stringify(comments, null, 2, 100));
    return newComment;
  },

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
}

module.exports = data;