import WebSocket, { WebSocketServer } from "ws";

import Box from "../shared/Box.ts";
import { config, emit } from "../shared/index.ts";
import { generateTrack } from "../shared/canvas.ts";
import { assert } from "../shared/assert.ts";

const PORT = 1234;
const wss = new WebSocketServer({ port: PORT });

let moves: Record<string, { x: number; y: number }> = {};
const users: Record<string, Box> = {};
const points = generateTrack();

wss.on("connection", (ws) => {
  let userId: string;
  emit(ws, "allUsers", Object.values(users));
  emit(ws, "points", points);

  ws.on("message", (message) => {
    const { event: eventName, data } = JSON.parse(message.toString());
    assert(typeof eventName === "string", "Event name is undefined");

    switch (eventName) {
      case "createUser":
        userId = data;
        assert(points[0] !== undefined, "No points generated");
        users[userId] = new Box(
          userId,
          points[0].x - config.carSize / 2,
          points[0].y,
          `hsl(${137.5 * Math.floor(Math.random() * 1000)}deg, 80%, 80%)`,
        );
        broadcast("addUser", users[userId]);
        break;
      case "move":
        const box = users[userId];
        assert(box !== undefined, "User not found");
        box.x = data.x;
        box.y = data.y;
        moves[data.id] = { x: data.x, y: data.y };
        break;
    }
  });

  ws.on("close", () => {
    broadcast("removeUser", userId, ws);
    delete users[userId];
  });
});

setInterval(() => {
  if (!Object.keys(moves).length) return;
  broadcast("moves", moves);
  moves = {};
}, 1000 / 60);

function broadcast(event: string, data: any, exclude?: WebSocket) {
  wss.clients.forEach((client) => {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      emit(client, event, data);
    }
  });
}
