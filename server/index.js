import express from "express";

const server = express();
const PORT = 3000;

server.get("/", (req, res) => {
  res.send();
});

server.use(express.static("../client"));

server.listen(PORT, () => {
  console.log("Listening to port", PORT);
});
