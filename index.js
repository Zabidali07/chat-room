const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./server/routes/routes");
const chatroomRoutes = require("./server/routes/chatroom");
const app = express();
const path = require("path");

require("dotenv").config();
const { DATABASE_URL, NODE_PORT, NODE_ENV } = process.env;

const PORT = NODE_PORT || 8000;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
// app.use(express.static(path.join(__dirname, "/client/build"))); //neded to be changed
app.use(express.static("client/build"));
app.use("/api", routes);
app.use("/api/chatroom", chatroomRoutes);

if (NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}
mongoose
  .connect(DATABASE_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log("DB COnnected");
  })
  .catch((err) => console.log(`DB connection failed ${err}`));

const server = app.listen(8000, () => {
  console.log("Server listening on port 8000");
});

const io = require("socket.io")(server);
const jwt = require("jsonwebtoken");

const User = require("./server/models/user");
const Message = require("./server/models/message");

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const payload = await jwt.verify(token, process.env.SECRET_KEY);
    socket.userId = payload.id;
    next();
  } catch (err) {
    if (err) console.log(err);
  }
});

io.on("connection", (socket) => {
  console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

  // socket.on("joinRoom", ({ chatroomId }) => {
  //   socket.join(chatroomId);
  //   console.log("A user joined chatroom: " + chatroomId);
  // });

  // socket.on("leaveRoom", ({ chatroomId }) => {
  //   socket.leave(chatroomId);
  //   console.log("A user left chatroom: " + chatroomId);
  // });

  socket.on("chatroomMessage", async ({ fromId, toId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId });
      const newMessage = new Message({
        fromUser: fromId,
        toUser: toId,
        message: message,
      });
      io.emit("newMessage", {
        message,
        name: user.name,
        userId: socket.userId,
      });
      await newMessage.save();
    }
  });
});
