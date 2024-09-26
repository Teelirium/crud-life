import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import { Accordion } from './components/ui/Accordion';
import { TaskListItem } from './components/ui/TaskListItem';
import { taskStore } from './data/Task/stores/Tasks.store';
import { Task } from './data/Task/types';

const sampleData: Task[] = [
  {
    id: '1',
    title: 'task 1',
    content: 'task 1',
    subtasks: [
      { id: '1.1', title: 'task 1.1', content: 'task 1.1' },
      { id: '1.2', title: 'task 1.2', content: 'task 1.2' },
      { id: '1.3', title: 'task 1.3', content: 'task 1.3' },
      {
        id: '1.4',
        title: 'task 1.4',
        content: 'task 1.4',
        subtasks: [
          { id: '1.4.1', title: 'task 1.4.1', content: 'task 1.4.1' },
          { id: '1.4.2', title: 'task 1.4.2', content: 'task 1.4.2' },
          { id: '1.4.3', title: 'task 1.4.3', content: 'task 1.4.3' },
        ],
      },
    ],
  },
  {
    id: '2',
    title: 'task 2',
    content: 'task 2',
    subtasks: [
      { id: '2.1', title: 'task 2.1', content: 'task 2.1' },
      { id: '2.2', title: 'task 2.2', content: 'task 2.2' },
      { id: '2.3', title: 'task 2.3', content: 'task 2.3' },
      {
        id: '2.4',
        title: 'task 2.4',
        content: 'task 2.4',
        subtasks: [
          { id: '2.4.1', title: 'task 2.4.1', content: 'task 2.4.1' },
          { id: '2.4.2', title: 'task 2.4.2', content: 'task 2.4.2' },
          { id: '2.4.3', title: 'task 2.4.3', content: 'task 2.4.3' },
        ],
      },
    ],
  },
];

export const App = observer(() => {
  return (
    <main className="w-full h-dvh grid grid-cols-2 bg-white dark:bg-black p-2">
      <div className="p-2">
        <Accordion type="multiple">
          {taskStore.tasks.map((t) => (
            <TaskListItem
              key={t.id}
              value={t.id}
              task={t}
              className="font-semibold"
            />
          ))}
        </Accordion>
      </div>
      <div className="p-2 bg-slate-200 dark:bg-slate-600">
        <Outlet />
      </div>
    </main>
  );
});
