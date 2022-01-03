const bodyParser = require("body-parser");
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const passportjwt = require("./config/passport-jwt-strategy");
const app = express();

const path = require("path");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "build")));

const db = require("./config/mongoose");
// app.use(
//   cors({
//     origin: ["https://apoorv-14200.github.io", "http://localhost:4000"],
//     credentials: true,
//   })
// );
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/api", require("./routes/api"));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/", function (req, res) {
  return res.render("home.ejs");
});

app.post("/", function (req, res) {
  console.log(req.body);
  res.end("<h1>Submitted form</h1>");
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

app.listen(port, () => console.log(`listening on port ${port}`));
