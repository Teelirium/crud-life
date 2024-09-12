import * as crypto from 'crypto';
import { Server } from 'socket.io';
import { ChatMessage } from './data/Message/types';

export default function createWsServer(httpServer: any) {
  const { messageStorage } = globalThis;

  const ws = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  function getRooms() {
    const rooms: [string, ChatMessage][] = [...messageStorage.entries()].map(
      ([id, msgArr]) => [id, msgArr[0]],
    );
    return rooms;
  }

  ws.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('getRooms', ({ autojoin }: { autojoin?: boolean }) => {
      console.log('IN getRooms', { autojoin });

      const rooms = getRooms();

      socket.emit('getRooms', rooms);
      console.log('OUT getRooms:', rooms);

      if (autojoin && messageStorage.size > 0) {
        const roomIdxToJoin = 0;
        const [room] = [...messageStorage.entries()][roomIdxToJoin];
        socket.join(room);

        const messages = messageStorage.get(room) ?? [];
        socket.emit('getMessages', messages, roomIdxToJoin);
        console.log('OUT getMessages', messages, roomIdxToJoin);
      }
    });

    socket.on('joinRoom', ({ room }) => {
      console.log('IN joinRoom:', { room });

      socket.join(room);

      const messages = messageStorage.get(room) ?? [];
      socket.emit('getMessages', messages);
      console.log('OUT getMessages', messages);
    });

    socket.on('leaveRoom', ({ room }) => {
      console.log('leaveRoom :', room);
      socket.leave(room);
    });

    socket.on('message', ({ author, content, room }) => {
      console.log({ author, room, content });
      const messages = messageStorage.get(room) ?? [];

      const newMessage: ChatMessage = {
        id: crypto.randomUUID(),
        author,
        content,
      };
      messages.unshift(newMessage);
      messageStorage.set(room, messages);

      ws.to(room).emit('message', newMessage);

      const rooms = getRooms();
      ws.emit('getRooms', rooms);
    });
  });

  return ws;
}
