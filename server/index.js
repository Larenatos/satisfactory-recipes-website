import express from "express";

const server = express();
const PORT = 3000;

server.get("/api", (req, res) => {
  res.send("nothing");
});

server.use(express.static("../client"));

server.listen(PORT, () => {
  console.log("Listening to port", PORT);
});
