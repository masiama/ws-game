import Box from "../shared/Box.ts";
import { config, emit, type BoxObject, type Point } from "../shared/index.ts";
import { drawBorder, initCanvas } from "../shared/canvas.ts";
import { assert } from "../shared/assert.ts";

const socket = new WebSocket(`http://${document.location.hostname}:1234`);
const canvas = document.querySelector("canvas");
assert(canvas !== null, "Canvas element not found");
const context = canvas.getContext("2d");
assert(context !== null, "Canvas context not found");

const keysEnum = {
  LEFT: "ArrowLeft",
  RIGHT: "ArrowRight",
  UP: "ArrowUp",
  DOWN: "ArrowDown",
};

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const string = Array.from({ length: 10 })
  .fill(0)
  .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
  .join("");
const userId = Date.now().toString().slice(-6) + string;

// Object of all users
const users: Record<string, Box> = {};
// Object for pressed keys
const keys: Record<string, boolean> = {};

const setUser = (u: BoxObject) => (users[u.id] = Box.serialize(u));

let connected = false;
let points: Point[] = [];

socket.addEventListener("open", init);

socket.addEventListener("message", (event) => {
  const { event: eventName, data } = JSON.parse(event.data);
  assert(typeof eventName === "string", "Event name is undefined");

  switch (eventName) {
    case "allUsers":
      data.forEach(setUser);
      break;
    case "points":
      points = data;
      break;
    case "addUser":
      setUser(data);
      break;
    case "removeUser":
      delete users[data];
      break;
    case "moves":
      for (const id in data) {
        if (users[id]) {
          users[id].x = data[id].x;
          users[id].y = data[id].y;
        }
      }
      break;
    default:
      console.log(`Unknown event: ${eventName}`);
  }
});

(function loop() {
  // Clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (users[userId]) {
    const newMe = Box.serialize(users[userId]);

    // Change car position according to pressed keys
    if (keysEnum.LEFT in keys && newMe.x > 0) newMe.x -= newMe.speed;
    if (keysEnum.RIGHT in keys && newMe.x < config.width - config.carSize) newMe.x += newMe.speed;
    if (keysEnum.UP in keys && newMe.y > 0) newMe.y -= newMe.speed;
    if (keysEnum.DOWN in keys && newMe.y < config.height - config.carSize) newMe.y += newMe.speed;

    if (newMe.x != users[userId].x || newMe.y != users[userId].y)
      emit(socket, "move", { id: userId, x: newMe.x, y: newMe.y });
    users[userId] = newMe;
  }

  // Draw cars
  Object.values(users).map((box) => box.draw(context));

  // draw tack borders
  drawBorder(context, points);
  drawBorder(context, points, -1);
  requestAnimationFrame(loop);
})();

function init() {
  assert(canvas !== null, "Canvas element not found");
  // Handle reconnect
  if (connected) return emit(socket, "move", users[userId]);

  // 1st connection
  connected = true;

  initCanvas(canvas);

  // Hande arrow key press
  window.addEventListener("keydown", (e) => {
    if (Object.values(keysEnum).indexOf(e.key) == -1) return;

    e.preventDefault();
    keys[e.key] = true;
  });

  // Hnadle arrow key release
  window.addEventListener("keyup", (e) => delete keys[e.key]);

  emit(socket, "createUser", userId);
}
