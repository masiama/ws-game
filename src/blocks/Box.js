import c from '../config';
const config = c();

export default class Box {
	constructor(id, x, y, color) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.color = color;

		this.speed = 2;
		this.width = config.carSize / 2;
		this.height = config.carSize / 2;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.arc(this.x, this.y + this.width, this.width, 0, 2 * Math.PI);
		ctx.fill();
	}

	static serialize(obj) {
		return new Box(obj.id, obj.x, obj.y, obj.color);
	}
}
