import { Server } from "socket.io";

let io;

export default function handler(req, res) {
  if (!res.socket.server.io) {
    ////console.log("🔌 Socket.io server is starting...");

    io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      //console.log("🟢 Client connected:", socket.id);

      socket.on("createGame", (data) => {
        //console.log("createGame", data);
      });

      socket.on("joinGame", (data) => {
        //console.log("joinGame", data);
      });

      socket.on("disconnect", () => {
        //console.log("🔴 Client disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    //console.log("⚡ Socket.io already running.");
  }

  res.end();
}
