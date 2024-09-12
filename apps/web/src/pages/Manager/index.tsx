import ChatPreview from '@/components/ChatPreview';
import LoadingSpinner from '@/components/LoadingSpinner';
import ChatBox from '@/components/UserPage/ChatBox';
import { ChatMessage } from '@/data/Message/types';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useCallback, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

export default function ManagerPage() {
  const [clientMap, setClientMap] = useState<Map<string, ChatMessage>>(
    new Map(),
  );
  const clientList = [...clientMap.entries()];

  const [listLoading, setListLoading] = useState(false);

  const [currentClientIdx, setCurrentClientIdx] = useState(0);
  const currentClient = clientList[currentClientIdx]
    ? clientList[currentClientIdx]
    : undefined;

  const name = 'Поддержка';
  const [wsLoading, setWsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const setupFn = useCallback(
    function (ws: Socket) {
      setWsLoading(true);
      setListLoading(true);

      ws.emit('getRooms', { autojoin: true });
      console.log('OUT getRooms', { autojoin: true });

      ws.on('getRooms', (rooms: [string, ChatMessage][]) => {
        console.log('IN getRooms:', rooms);

        setClientMap(new Map(rooms));
        setListLoading(false);
      });

      ws.on('getMessages', (messages: [], roomIdxToJoin?: number) => {
        console.log('IN getMessages:', messages);
        setMessages(messages);
        setWsLoading(false);
        if (roomIdxToJoin !== undefined) {
          setCurrentClientIdx(roomIdxToJoin);
        }
      });

      ws.on('message', (msg) => {
        console.log('IN message:', msg);
        setMessages((prev) => [msg, ...prev]);
      });
    },
    [currentClientIdx],
  );

  const { ws } = useWebSocket({
    url: 'http://localhost:5000',
    setupFn,
  });

  const sendMsg: Parameters<typeof ChatBox>[0]['onSend'] = (data, form) => {
    if (!ws) {
      throw new Error('Not connected to ws');
    }
    const msg = {
      author: name,
      content: data.message,
      room: currentClient ? currentClient[0] : undefined,
    };
    ws.emit('message', msg);
    console.log('OUT message:', msg);
    form.reset();
  };

  return (
    <>
      <aside className="relative w-2/5">
        {listLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <LoadingSpinner />
          </div>
        )}
        <ul className="w-full h-full overflow-y-auto flex flex-col">
          {[...clientMap.entries()].map(([client, msg], i) => (
            <ChatPreview
              key={client}
              client={client}
              msg={msg}
              active={client === currentClient![0]}
              onClick={() => {
                if (client === currentClient![0]) {
                  return;
                }
                if (!ws) {
                  console.error('Not connected to websocket');
                  return;
                }
                setCurrentClientIdx(i);
                setMessages([]);
                setWsLoading(true);
                ws.emit('leaveRoom', { room: currentClient![0] });
                console.log('OUT leaveRoom:', currentClient![0]);
                ws.emit('joinRoom', { room: client });
                console.log('OUT joinRoom', client);
              }}
            />
          ))}
        </ul>
      </aside>
      <ChatBox
        name={name}
        room={currentClient ? currentClient[0] : undefined}
        loading={wsLoading}
        messages={messages}
        onSend={sendMsg}
      />
    </>
  );
}
