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

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const string = new Array(10)
	.fill(0)
	.map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
	.join('');
const userId =
	Date.now()
		.toString()
		.slice(-6) + string;

// Object of all users
const users = {};
// Object for pressed keys
const keys = {};

const setUser = u => (users[u.id] = Box.serialize(u));

let connected = false;
let points = [];

socket.on('connect', init);
socket.on('addUser', setUser);
socket.on('removeUser', id => delete users[id]);

socket.on('allUsers', allUsers => allUsers.map(setUser));
socket.on('points', p => (points = p));
socket.on('move', setUser);

(function loop() {
	// Clear canvas
	context.clearRect(0, 0, canvas.width, canvas.height);

	if (users[userId]) {
		const newMe = Box.serialize(users[userId]);

		// Change car position according to pressed keys
		if (keysEnum.LEFT in keys && newMe.x > 0) newMe.x -= newMe.speed;
		if (keysEnum.RIGHT in keys && newMe.x < config.width - config.carSize)
			newMe.x += newMe.speed;
		if (keysEnum.UP in keys && newMe.y > 0) newMe.y -= newMe.speed;
		if (keysEnum.DOWN in keys && newMe.y < config.height - config.carSize)
			newMe.y += newMe.speed;

		if (newMe.x != users[userId].x || newMe.y != users[userId].y)
			socket.emit('move', newMe);
		users[userId] = newMe;
	}

	// Draw cars
	Object.values(users).map(box => box.draw(context));

	// draw tack borders
	drawBorder(context, points);
	drawBorder(context, points, -1);
	requestAnimationFrame(loop);
})();

function init() {
	// Handle reconnect
	if (connected) return socket.emit('move', users[userId]);

	// 1st connection
	connected = true;

	initCanvas(canvas);

	// Hande arrow key press
	window.addEventListener('keydown', e => {
		if (Object.values(keysEnum).indexOf(e.key) == -1) return;

		e.preventDefault();
		keys[e.key] = true;
	});

	// Hnadle arrow key release
	window.addEventListener('keyup', e => delete keys[e.key]);

	socket.emit('createUser', userId);
}
