import crypto from 'crypto';
import { createServer } from 'http';
import app from './app';
import { ImageObj } from './data/ImageObj/types';
import { ChatMessage } from './data/Message/types';
import createWsServer from './ws';

const port = process.env.PORT || 5000;

declare global {
  var messageStorage: Map<string, ChatMessage[]>;
  var images: ImageObj[];
}

globalThis.messageStorage = new Map<string, ChatMessage[]>();
globalThis.images = [
  'https://images.unsplash.com/photo-1474557157379-8aa74a6ef541?q=80&w=512',
  'https://images.unsplash.com/photo-1503149779833-1de50ebe5f8a?q=80&w=512',
  'https://plus.unsplash.com/premium_photo-1677354136409-068b52c863c3?q=80&w=512',
].map((i) => ({ url: i, id: crypto.randomUUID() }));

const server = createServer(app);
const ws = createWsServer(server);

server.listen(port, () => {
  console.log(`Server listening on: http://localhost:${port}`);
});

server.on('close', () => {
  ws.close();
});
