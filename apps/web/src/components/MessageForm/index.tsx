import { PropsWithChildren, useRef } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { SendIcon } from '../Icons';

type Data = { message: string };

type Props = PropsWithChildren<{
  onSubmit: (data: Data, form: UseFormReturn<Data, any, undefined>) => void;
}>;

export default function MessageForm(props: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const messageForm = useForm<Data>();

  const sendMessage = messageForm.handleSubmit((data) => {
    props.onSubmit(data, messageForm);
  });

  return (
    <form
      onSubmit={sendMessage}
      className="bg-white h-max flex items-end p-1 px-2"
    >
      <textarea
        className="w-full max-h-48 transition-all outline-none resize-none self-center"
        style={{ scrollbarWidth: 'thin', scrollbarGutter: 'stable' }}
        rows={1}
        placeholder="Написать сообщение..."
        onInput={(ev) => {
          ev.currentTarget.style.height = 'auto';
          ev.currentTarget.style.height = ev.currentTarget.scrollHeight + 'px';
        }}
        onReset={(ev) => {
          ev.currentTarget.style.height = 'auto';
          ev.currentTarget.style.height = ev.currentTarget.scrollHeight + 'px';
        }}
        onKeyDown={(ev) => {
          if (ev.key === 'Enter' && !ev.shiftKey) {
            ev.preventDefault();
            btnRef.current?.click();
          }
        }}
        {...messageForm.register('message', { required: true })}
      />
      <button
        ref={btnRef}
        type="submit"
        className="w-8 h-8 transition-colors hover:bg-slate-200 active:bg-blue-200 text-slate-500 rounded-full"
      >
        <SendIcon />
      </button>
    </form>
  );
}
