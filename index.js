const bodyParser = require("body-parser");
const express = require("express");
const passport = require("passport");
const cors = require("cors");
const passportjwt = require("./config/passport-jwt-strategy");
const app = express();
const Like = require("./models/like");
const Post = require("./models/post");
const Comment = require("./models/comment");
const Friendship = require("./models/friendship");
const User = require("./models/user");
const Conversation = require("./models/conversation");
const Message = require("./models/message");

// let socket_port = process.env.SOCKET;
// if (socket_port == "" || socket_port == null) {
//   socket_port = 8000;
// }

// const server = require("http").createServer(app);
// const io = require("socket.io")(server, {
//   cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
// }).listen(socket_port);

// io.on("connection", function (socket) {
//   console.log(socket.id);
//   socket.on("join_room", (room) => {
//     socket.join(room);
//   });
//   socket.on("send-message", async function (message, roomid) {
//     console.log(message, roomid);
//     let conv = await Conversation.findOne({ friendship: roomid });
//     let newmsg = await Message.create({
//       user: message.user._id,
//       content: message.content,
//     });
//     conv.messages.push(newmsg);
//     conv.save();
//     io.to(roomid).emit("receive-message", message);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });

const path = require("path");

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.json());
app.use(express.urlencoded());
app.use(passport.initialize());

const db = require("./config/mongoose");
app.use(
  cors({
    origin: ["https://apoorv-14200.github.io", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "build")));

app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/api", require("./routes/api"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

app.listen(port, () => console.log(`listening on port ${port}`));
