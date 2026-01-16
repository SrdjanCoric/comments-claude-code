const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const data = require("./data/data");

const app = express();

app.use(cors());

app.set("port", process.env.API_PORT || 3001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/comments", (req, res) => {
  res.json(data.getCommentsWithOneReply());
});

app.get("/api/comment_replies", (req, res) => {
  const comment_id = req.query.comment_id;
  res.json(data.getRepliesForComment(comment_id));
});

app.post("/api/comments", (req, res) => {
  const comment = req.body;
  const newComment = data.saveComment(comment);
  if (newComment) {
    res.json(newComment);
  } else {
    res.status(401).json({ error: "Please check your inputs" });
  }
});

app.post("/api/comment_replies", (req, res) => {
  const comment_id = +req.params.comment_id;

  const { comment_reply } = req.params;
  const newReply = data.saveReplyToComment(comment_id, reply);
  if (newReply) {
    res.json(newReply);
  } else {
    res.status(401).json({ error: "Please check your inputs" });
  }
});

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

app.use((req, res) => {
  res.status(404).send({ error: "Not found" });
});

module.exports = app;
