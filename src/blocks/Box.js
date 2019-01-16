export default class Box {
	constructor(id, x, y, width, height, color) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.speed = 2;
	}

	draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	static serialize(obj) {
		return new Box(obj.id, obj.x, obj.y, obj.width, obj.height, obj.color);
	}
}
