import ChatMessageView from '@/components/ChatMessageView';
import LoadingSpinner from '@/components/LoadingSpinner';
import MessageForm from '@/components/MessageForm';
import { ChatMessage } from '@/data/Message/types';
import { ReactNode } from 'react';

type Props = {
  header?: ReactNode;
  name: string;
  room?: string;
  messages: ChatMessage[];
  loading: boolean;
  onSend: Parameters<typeof MessageForm>[0]['onSubmit'];
};

export default function ChatBox(props: Props) {
  const { header, name, room, messages, loading, onSend } = props;

  return (
    <div className="relative w-full h-full border-l border-slate-200 flex flex-col">
      {header}
      {room && (
        <span className="p-1 text-slate-400 text-sm w-full text-center">
          ID Клиента: {room}
        </span>
      )}
      <ul className="relative flex-1 flex flex-col-reverse gap-1 overflow-y-auto bg-slate-100">
        {messages.map((msg, i, _arr) => {
          let authorAvatar: string | undefined = msg.author;

          if (_arr[i - 1] && _arr[i - 1].author === msg.author) {
            authorAvatar = undefined;
          }

          return (
            <ChatMessageView
              key={msg.id}
              content={msg.content}
              author={authorAvatar}
              highlighted={name === msg.author}
            ></ChatMessageView>
          );
        })}
        {room && loading && (
          <div className="absolute invert top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <LoadingSpinner />
          </div>
        )}
        {!room && (
          <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
            Нет сообщений
          </span>
        )}
      </ul>
      <MessageForm onSubmit={onSend} />
    </div>
  );
}
