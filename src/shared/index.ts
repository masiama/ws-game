import { WebSocket as WSWS } from "ws";

type RGB = [number, number, number];

type Config = {
  width: number;
  height: number;
  entryWidth: number;
  entryHeight: number;
  rows: number;
  blockLength: number;
  carSize: number;
  borderColor: RGB;
  carColor: RGB;
  bg: RGB;
  randomCount: number;
};

export type BoxObject = { id: string; x: number; y: number; color: string };

export type Point = { x: number; y: number };

const height = 300;
const entryHeight = 20;

export const config: Config = {
  width: 600,
  height,
  entryWidth: 50,
  entryHeight,
  rows: Math.floor(height / entryHeight),
  blockLength: 3,
  carSize: entryHeight,
  borderColor: [255, 255, 255],
  carColor: [255, 0, 0],
  bg: [0, 0, 0],
  randomCount: 6,
};

export const emit = (socket: WebSocket | WSWS, event: string, data?: any) =>
  socket.send(JSON.stringify({ event, data }));
