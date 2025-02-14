const { createServer } = require("http");
const { parse } = require("url");
const next = require("./node_modules/next");
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

    socket.on("user joined", (username) => {
      users.set(socket.id, username);
      io.emit("update users", Array.from(users.values()));
    })

    socket.on("chat message", (msg) => {
      console.log("Message received: ", msg);
      const messageWithTimestamp = {
        ...msg,
        timestamp: msg.timestamp || new Date(),
      }
      io.emit("chat message", messageWithTimestamp);
    })

    socket.on("disconnect", () => {
      console.log("A client disconnected");
      users.delete(socket.id);
      io.emit("update users", Array.from(users.values()));
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  })
});

