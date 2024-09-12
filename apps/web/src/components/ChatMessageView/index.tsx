import { PropsWithChildren } from 'react';
import Avatar from '../Avatar';

type Props = PropsWithChildren<{
  content: string;
  author?: string;
  highlighted?: boolean;
}>;

export default function ChatMessageView(props: Props) {
  const { content, author, highlighted } = props;

  return (
    <li className="w-full max-w-lg p-2 py-1 flex gap-1 items-end">
      <Avatar
        name={author ?? ''}
        className={`w-10 h-10
        ${highlighted ? 'bg-blue-200' : 'bg-slate-200'}
        ${author ? '' : 'opacity-0'}`}
      />
      <div
        className={`relative 
        ${highlighted ? 'bg-blue-200' : 'bg-slate-200'}
        rounded-md p-2 flex-1 
        flex h-max`}
      >
        <span
          className={`w-full max-h-[6em] overflow-y-auto`}
          style={{ overflowWrap: 'anywhere', scrollbarWidth: 'thin' }}
        >
          {content}
        </span>
        <div
          className={`absolute h-1 w-0 -left-1.5 bottom-0
          bg-transparent border-transparent 
          ${highlighted ? 'border-b-blue-200' : 'border-b-slate-200'}
          border-b-blue-200 
          border-8 border-t-0
          ${author ? '' : 'opacity-0'}`}
        />
      </div>
    </li>
  );
}
