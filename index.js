const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});
app.get("/hello", (req, res) => {
  res.send("how are you");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
