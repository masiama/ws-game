import SocketIO from 'socket.io';
import express from 'express';
import { join } from 'path';
import http from 'http';

const PORT = 1234;

const app = express();
const server = http.createServer(app);
const io = SocketIO(server);

const sendFile = file => (_, res) => res.sendFile(join(`${__dirname}/${file}`));

app.get('/', sendFile('index.html')).get('/client.js', sendFile('client.js'));

server.listen(PORT);

io.on('connection', socket => {
	socket.emit('news', { hello: 'world' });
});
