import { ChatMessage } from '@/data/Message/types';
import { createContext, useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

// type Data = {};

// const WebSocketContext = createContext<Data | null>(null);

// export function WebSocketProvider() {}

export function useWebSocket(params: {
  url: string;
  setupFn: (ws: Socket) => void;
}) {
  const { url, setupFn } = params;

  const ws = useRef<Socket | null>(null);

  useEffect(() => {
    if (ws.current) {
      console.log('Already connected');
      return;
    }

    const wsCurrent = io(url);

    setupFn(wsCurrent);

    ws.current = wsCurrent;
    return () => {
      wsCurrent.close();
      ws.current = null;
    };
  }, []);

  return {
    ws: ws.current,
  };
}
