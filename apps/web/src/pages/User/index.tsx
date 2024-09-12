import { ArrowLeft, ArrowRight } from '@/components/Icons';
import LoadingSpinner from '@/components/LoadingSpinner';
import ChatBox from '@/components/UserPage/ChatBox';
import ImageView from '@/components/UserPage/ImageView';
import { ImageApiResponse } from '@/data/ImageObj/types';
import { ChatMessage } from '@/data/Message/types';
import { useWebSocket } from '@/hooks/useWebSocket';
import { getName, getNewName } from '@/util/username';
import { useEffect, useState } from 'react';

export default function UserPage() {
  const [images, setImages] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);

  const name = getName();
  const [wsLoading, setWsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { ws } = useWebSocket({
    url: 'http://localhost:5000',
    setupFn(ws) {
      setWsLoading(true);

      ws.emit('joinRoom', { room: name });

      ws.on('getMessages', (messages) => {
        console.log('getMessages:', messages);
        setMessages(messages);
        setWsLoading(false);
      });

      ws.on('message', (msg) => {
        console.log('message:', msg);
        setMessages((prev) => [msg, ...prev]);
      });
    },
  });

  const sendMsg: Parameters<typeof ChatBox>[0]['onSend'] = (data, form) => {
    if (!ws) {
      console.error('Not connected to ws');
      return;
    }
    ws.emit('message', {
      author: name,
      content: data.message,
      room: name,
    });
    form.reset();
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      if (page < images.length) return;
      try {
        setLoading(true);
        const resp = await fetch(
          `http://localhost:5000/api/v1/images?page=${page}`,
          { signal },
        );

        let result = (await resp.json()) as
          | ImageApiResponse
          | { message: string };
        console.log('http getImages:', result);

        if (!resp.ok) {
          result = result as { message: string };
          throw new Error(result.message);
        }

        result = result as ImageApiResponse;
        setImages((prev) => [...prev, ...result.items]);
        setHasMore(result.hasMore);
      } catch (err) {
        if (signal.aborted) {
          console.log('Request aborted');
          return;
        }

        console.error('http getImages:', err);
        //@ts-ignore
        setError(err?.message ?? 'Неизвестная ошибка');
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      controller.abort('Component unmounted');
    };
  }, [page]);

  console.log({ page, length: images.length, images, loading });

  const canGoToNext =
    !error && !loading && (hasMore || page < images.length - 1);

  return (
    <>
      <div className="w-full h-full relative overflow-hidden">
        {/* left */}
        {page !== 0 && (
          <div
            key={images[page - 1]?.id}
            className={`w-[80%] h-[80%] flex items-center justify-center 
            absolute top-1/2 -translate-y-1/2 right-full translate-x-16`}
          >
            <ImageView src={images[page - 1]?.url} />
          </div>
        )}
        {/* center */}
        <div
          key={images[page]?.id}
          className={`w-[80%] h-[80%] flex items-center justify-center 
            absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2
            ${loading ? 'animate-pulse' : ''}`}
        >
          <ImageView src={images[page]?.url} />
        </div>
        {/* right */}
        {canGoToNext && (
          <div
            key={images[page + 1]?.id}
            className={`w-[80%] h-[80%] flex items-center justify-center 
          absolute top-1/2 -translate-y-1/2 left-full -translate-x-16`}
          >
            <ImageView src={images[page + 1]?.url} />
          </div>
        )}
        {error && (
          <span className="absolute text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-red-600 drop-shadow-sm">
            <h2>Произошла ошибка:</h2>"{error}"
          </span>
        )}
        {loading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <LoadingSpinner />
          </div>
        )}
        {page > 0 && (
          <button
            onClick={() => setPage((prev) => prev - 1)}
            className={`absolute left-10 top-1/2 p-3 rounded-full 
                transition-colors bg-slate-50 disabled:opacity-50
                hover:bg-slate-200 active:bg-blue-200 shadow-md`}
          >
            <ArrowLeft />
          </button>
        )}
        {canGoToNext && (
          <button
            disabled={loading}
            onClick={() => setPage((prev) => prev + 1)}
            className={`absolute right-10 top-1/2 p-3 rounded-full 
                transition-colors bg-slate-50 disabled:opacity-50
                hover:bg-slate-200 active:bg-blue-200 shadow-md`}
          >
            <ArrowRight />
          </button>
        )}
      </div>
      <aside className="w-2/5">
        <ChatBox
          name={getName()}
          room={getName()}
          onSend={sendMsg}
          messages={messages}
          loading={wsLoading}
          header={
            <header className="relative flex p-3 justify-between items-center">
              <h2 className="font-semibold">Чат с поддержкой</h2>
              <button
                className={`p-2 px-4 rounded-full 
                transition-colors bg-slate-50 disabled:opacity-50
                hover:bg-slate-200 active:bg-blue-200 shadow-sm
                border`}
                onClick={() => {
                  getNewName();
                  window.location.reload();
                }}
              >
                Сбросить ID
              </button>
            </header>
          }
        />
      </aside>
    </>
  );
}
