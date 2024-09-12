import { ChatMessage } from '@/data/Message/types';
import Avatar from '../Avatar';

type Props = {
  msg: ChatMessage;
  client: string;
  active: boolean;
  onClick: () => void;
};

export default function ChatPreview(props: Props) {
  const { msg, client, active, onClick } = props;
  return (
    <li
      className={`${active ? 'bg-blue-100 hover:bg-blue-200 active:bg-blue-300' : 'bg-white hover:bg-slate-200 active:bg-blue-300'}`}
    >
      <div
        className="w-full h-full p-2 flex gap-1 items-center"
        onClick={onClick}
      >
        <Avatar
          name={client}
          className="w-14 h-14 bg-slate-100 flex-shrink-0"
        />
        <div className="flex flex-col items-start text-start flex-1 overflow-hidden">
          <span className="w-full font-bold whitespace-nowrap overflow-hidden text-ellipsis max-h-[1.5em]">
            {client}
          </span>
          <span className="w-full whitespace-nowrap overflow-hidden text-ellipsis max-h-[1.5em]">
            {msg.content}
          </span>
        </div>
      </div>
    </li>
  );
}
