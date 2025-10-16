import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static("."));
const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);
  ws.on("message", (msg) => {
    for (const client of clients) {
      if (client.readyState === 1) client.send(msg.toString());
    }
  });
  ws.on("close", () => clients.delete(ws));
});

server.listen(3000, () =>
  console.log("💬 Сервер чата запущен: http://localhost:3000")
);
