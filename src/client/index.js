import Box from '../shared/Box';
import c from '../shared/config';
import { drawBorder, initCanvas } from '../shared/canvas';

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

	if (me) {
		const newMe = Box.serialize(users[me.id]);

		// Change car position according to pressed keys
		if (keysEnum.LEFT in keys && newMe.x > 0) newMe.x -= newMe.speed;
		if (keysEnum.RIGHT in keys && newMe.x < config.width - config.carSize)
			newMe.x += newMe.speed;
		if (keysEnum.UP in keys && newMe.y > 0) newMe.y -= newMe.speed;
		if (keysEnum.DOWN in keys && newMe.y < config.height - config.carSize)
			newMe.y += newMe.speed;

		if (newMe.x != me.x || newMe.y != me.y) socket.emit('move', newMe);
		users[me.id] = newMe;
	}

	// Draw cars
	Object.values(users).map(box => box.draw(context));

	// draw tack borders
	drawBorder(context, points);
	drawBorder(context, points, -1);
	requestAnimationFrame(loop);
})();

function init() {
	if (connected) {
		// Handle reconnect
		me.id = socket.id;
		users[me.id] = me;
		return socket.emit('move', me);
	}

	// 1st connection
	connected = true;

	initCanvas(canvas);
	me = users[socket.id];

	// Hande arrow key press
	window.addEventListener('keydown', e => {
		if (Object.values(keysEnum).indexOf(e.key) == -1) return;

		e.preventDefault();
		keys[e.key] = true;
	});

	// Hnadle arrow key release
	window.addEventListener('keyup', e => delete keys[e.key]);
}
