const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const users = new Map();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("A client connected");

    socket.on("typing", (username) => {
      socket.broadcast.emit("typing", username);
    });

    socket.on("stop typing", () => {
      socket.broadcast.emit("stop typing");
    });

    socket.on("user joined", (username) => {
      users.set(socket.id, username);

      io.emit("user joined", username);
      
      io.emit("update users", Array.from(users.values()));
    });

    socket.on("chat message", (msg) => {
      console.log("Message received:", msg);
      io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log("A client disconnected");

      const username = users.get(socket.id);
      users.delete(socket.id);
      
      if (username) {
        io.emit("user left", username);
      }

      io.emit("update users", Array.from(users.values()));
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});