const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  if (type === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated") {
    const { id, content, postId } = data;

    const post = posts[postId];
    post.comments.push({ id, content });
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  console.log(posts);

  res.send({});
});

const port = 4002;

app.listen(port, async () => {
  console.log(`Listening on port ${port}`);

  const res = await axios.get("http://localhost:4005/events");

  for (let event of res.data) {
    console.log(event.type);
    handleEvent(event.type, event.data);
  }
});
