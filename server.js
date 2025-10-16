import express from "express";
import { WebSocketServer } from "ws";
import http from "http";

const app = express();
const server = http.createServer(app); // обычный HTTP
const wss = new WebSocketServer({ server });

app.use(express.static("."));

const clients = new Set();

wss.on("connection", ws => {
  clients.add(ws);

  ws.on("message", msg => {
    // рассылаем всем клиентам
    for (const client of clients) {
      if (client.readyState === 1) client.send(msg.toString());
    }
  });

  ws.on("close", () => clients.delete(ws));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`💬 Чат запущен на http://localhost:${PORT}`)
);
