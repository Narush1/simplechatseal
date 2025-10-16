import express from "express";
import { WebSocketServer } from "ws";
import https from "https";
import fs from "fs";

const app = express();

// Путь к сертификатам
const server = https.createServer({
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem")
}, app);

const wss = new WebSocketServer({ server });

app.use(express.static("."));

const clients = new Set();

wss.on("connection", ws => {
  clients.add(ws);
  ws.on("message", msg => {
    for (const client of clients) {
      if (client.readyState === 1) client.send(msg.toString());
    }
  });
  ws.on("close", () => clients.delete(ws));
});

server.listen(3443, () =>
  console.log("💬 HTTPS чат запущен: https://localhost:3443")
);
