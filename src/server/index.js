import SocketIO from 'socket.io';
import express from 'express';
import { join } from 'path';
import http from 'http';

import Box from '../shared/Box';
import c from '../shared/config';
import { generateTrack } from '../shared/canvas';

const PORT = 1234;

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);
const config = c();

const sendFile = file => (_, res) =>
	res.sendFile(file, { root: join(process.cwd(), 'out') });

app.get('/', sendFile('index.html')).get('/client.js', sendFile('client.js'));

server.listen(PORT);

const users = {};
const points = generateTrack();

io.on('connection', socket => {
	socket.emit('allUsers', Object.values(users));
	socket.emit('points', points);

	socket.on('createUser', userId => {
		users[socket.id] = new Box(
			userId,
			points[0].x - config.carSize / 2,
			points[0].y,
			`hsl(${137.5 * Math.floor(Math.random() * 1000)}deg, 80%, 80%)`,
		);
		io.emit('addUser', users[socket.id]);
	});

	socket.on('move', data => {
		users[socket.id] = data;
		socket.broadcast.emit('move', data);
	});
	socket.on('disconnect', () => {
		socket.broadcast.emit('removeUser', users[socket.id].id);
		delete users[socket.id];
	});
});
