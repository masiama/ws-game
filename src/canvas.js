import c from './config';
const config = c();

const random = () => new Array(config.randomCount).fill(0).map(_ => Math.random()).reduce((a, v) => a + v, 0) / config.randomCount;
const r = (min, max) => Math.round(random() * (max - min) + min);

let start = 0;
let end = config.width - config.entryWidth / 2;

let previousEntry;

const getTurn = () => {
	const turnDeterminator = Math.random();
	return turnDeterminator < 1 / 3 ? -1 : turnDeterminator < 2 / 3 ? 0 : 1;
}

const generateBlock = (i) => {
	const turn = getTurn();
	const points = [];
	for (let j = 0; j < config.blockLength; j++) {
		const y = (i * config.blockLength + j) * config.entryHeight;
		if (y > config.height) break;

		const entry = r(start, end);

		if (!previousEntry) points.push({ x: entry, y: y });
		points.push({ x: entry, y: y + config.entryHeight });

		previousEntry = entry;

		if (turn == -1) {
			start = Math.max(0, entry - config.entryWidth / 2);
			end = Math.min(entry, config.width - config.entryWidth);
		}
		if (turn == 0) {
			start = Math.max(0, entry - config.entryWidth / 2);
			end = Math.min(entry + config.entryWidth / 2, config.width - config.entryWidth);
		}
		if (turn == 1) {
			start = Math.max(0, entry);
			end = Math.min(entry + config.entryWidth / 2, config.width - config.entryWidth);
		}
	}
	return points;
}


export function generateTrack() {
	let points = [];
	for (let i = 0; i <= Math.round(config.rows / config.blockLength); i++) points = points.concat(generateBlock(i));
	return points;
}

export function drawBorder(ctx, points, modifier = 1) {
	if (points.length < 3) return;
	ctx.beginPath();
	ctx.strokeStyle = `rgb(${config.borderColor.join(',')})`;

	const offset = config.entryWidth / 2 * modifier;

	ctx.moveTo(points[0].x + offset, points[0].y);

	let k = 1;

	for (; k < points.length - 2; k++) {
		const xc = (points[k].x + points[k + 1].x) / 2 + offset;
		const yc = (points[k].y + points[k + 1].y) / 2;
		ctx.quadraticCurveTo(points[k].x + offset, points[k].y, xc, yc);
	}

	ctx.quadraticCurveTo(points[k].x + offset, points[k].y, points[k + 1].x + offset, points[k + 1].y);

	ctx.stroke();
}

export function initCanvas(canvas) {
	canvas.width = config.width;
	canvas.height = config.height;
	canvas.style.background = `rgb(${config.bg.join(',')})`;
}
