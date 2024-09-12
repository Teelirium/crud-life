import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  src?: string;
}>;

export default function ImageView({ ...props }: Props) {
  return (
    <div className="relative w-full h-full bg-slate-500 bg-opacity-40 shadow-md">
      {props.src !== undefined && (
        <img className="w-full h-full object-cover" src={props.src} />
      )}
    </div>
  );
}
