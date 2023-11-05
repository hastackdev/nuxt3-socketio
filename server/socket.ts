import { Server, type ServerOptions } from 'socket.io';
import type { H3Event } from 'h3';

const options: Partial<ServerOptions> = {
  path: '/api/socket.io',
  serveClient: false
};

export const io = new Server(options);

export function initSocket(event: H3Event) {
  // @ts-ignore
  io.attach(event.node.res.socket?.server);
  io.of('/chat').on('connection', (socket) => {
    socket.emit('connected', { message: 'Connection established.' });
    socket.on('chat', (text: string) => {
      io.of('/chat').emit('chat', { id: socket.id, text });
    });
  });
}
