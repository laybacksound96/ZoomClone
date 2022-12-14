import http from "http";
import socketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app);
const io = socketIO(server);

io.on("connection", (socket) => {
  socket.on("enter_room", (roomName, showMyRoom) => {
    socket.join(roomName);
    showMyRoom();
    socket.to(roomName).emit("welcomeMessage");
    console.log(socket.rooms);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });
  socket.on("send_message", (msg, roomName, done) => {
    socket.to(roomName).emit("send_message", msg);
    done();
  });
});

// wss.on("connection", (Socket) => {
//   sockets.push(Socket);
//   Socket["nickname"] = "ㅇㅇ";
//   console.log("클라이언트와 연결되었습니다.");
//   Socket.on("message", (message) => {
//     const parsedMessage = JSON.parse(message);
//     switch (parsedMessage.type) {
//       case "new_message":
//         sockets.forEach((element) =>
//           element.send(`${Socket.nickname}: ${parsedMessage.payload}`)
//         );
//         break;
//       case "nickname":
//         Socket["nickname"] = parsedMessage.payload;
//         break;
//     }
//   });
// });

server.listen(3000, () => console.log("alert five ready to burn"));
