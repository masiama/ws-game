import SocketIO from 'socket.io';
import express from 'express';
import { join } from 'path';
import http from 'http';
import { generateTrack } from '../shared/canvas';

const PORT = 1234;

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

const sendFile = file => (_, res) => res.sendFile(file, { root: join(process.cwd(), 'out') });

app.get('/', sendFile('index.html')).get('/client.js', sendFile('client.js'));

server.listen(PORT);

const users = {};
const points = generateTrack();

io.on('connection', socket => {
	socket.emit('allUsers', Object.values(users));
	socket.emit('points', points);
	socket.on('added', data => {
		users[data.id] = data;
		socket.broadcast.emit('addUser', data);
	});
	socket.on('move', data => {
		users[data.id] = data;
		socket.broadcast.emit('move', data);
	});
	socket.on('disconnect', () => {
		delete users[socket.id];
		socket.broadcast.emit('removeUser', socket.id);
	});
});
