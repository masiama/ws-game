import Box from './blocks/Box';
import c from '../shared/config';
import { generateTrack, drawBorder, initCanvas } from '../shared/canvas';

const config = c();
const socket = io('http://localhost:1234');
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

// Enumeration of arrow keys
const keysEnum = Object.freeze({
	LEFT: 'ArrowLeft',
	RIGHT: 'ArrowRight',
	UP: 'ArrowUp',
	DOWN: 'ArrowDown',
});

// Object of all users
const users = {};
// Object for pressed keys
const keys = {};

const setUser = u => (users[u.id] = Box.serialize(u));

let me;
let connected = false;
let points = [];

socket.on('addUser', setUser);
socket.on('removeUser', id => delete users[id]);

socket.on('allUsers', allUsers => allUsers.map(setUser));
socket.on('points', p => {
	points = p;
	init();
});
socket.on('move', setUser);

(function loop() {
	// Clear canvas
	context.clearRect(0, 0, canvas.width, canvas.height);
	// Draw cars
	Object.values(users).map(box => box.draw(context));

	// draw tack borders
	drawBorder(context, points);
	drawBorder(context, points, -1);
	requestAnimationFrame(loop);
})();

function init() {
	if (connected) return socket.emit('move', me);
	connected = true;

	initCanvas(canvas);

	me = new Box(
		socket.id,
		points[0].x,
		points[0].y,
		`hsl(${137.5 * Math.floor(Math.random() * 1000)}deg, 80%, 80%)`,
	);
	users[me.id] = me;

	// Hande arrow key press
	addEventListener('keydown', e => {
		if (Object.values(keysEnum).indexOf(e.key) == -1) return;

		e.preventDefault();
		keys[e.key] = true;

		// Change car position according to pressed keys
		if (keysEnum.LEFT in keys && me.x > 0) me.x -= me.speed;
		if (keysEnum.RIGHT in keys && me.x < config.width - config.carSize)
			me.x += me.speed;
		if (keysEnum.UP in keys && me.y > 0) me.y -= me.speed;
		if (keysEnum.DOWN in keys && me.y < config.height - config.carSize)
			me.y += me.speed;

		socket.emit('move', me);
	});

	// Hnadle arrow key release
	addEventListener('keyup', e => delete keys[e.key]);

	socket.emit('added', me);
}
