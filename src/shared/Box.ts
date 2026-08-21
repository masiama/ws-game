import { config, type BoxObject } from "./index.ts";

export default class Box {
  id: string;
  x: number;
  y: number;
  color: string;
  speed: number;
  width: number;
  height: number;

  constructor(id: string, x: number, y: number, color: string) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.color = color;

    this.speed = 2;
    this.width = config.carSize / 2;
    this.height = config.carSize / 2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x + this.width, this.y + this.width, this.width, 0, 2 * Math.PI);
    ctx.fill();
  }

  static serialize(obj: BoxObject) {
    return new Box(obj.id, obj.x, obj.y, obj.color);
  }
}
