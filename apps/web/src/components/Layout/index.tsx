import { PropsWithChildren } from 'react';
import Navigation from '../Navigation';

type Props = PropsWithChildren<{
  headerText: string;
}>;

export default function Layout(props: Props) {
  return (
    <div className="w-full h-full flex flex-col">
      <header className="p-3 px-8 text-lg font-bold border-b border-slate-200">
        <h1>{props.headerText}</h1>
      </header>
      <main className="w-full h-full overflow-hidden flex flex-1">
        {props.children}
      </main>
      <Navigation />
    </div>
  );
}
