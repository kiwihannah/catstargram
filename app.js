const express = require("express");

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi!");
});
app.use("/api", express.json(), router);

app.listen(8080, () => {
  console.log("Server has been connected");
});