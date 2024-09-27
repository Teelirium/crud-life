import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { Accordion } from './components/ui/Accordion';
import { TaskListItem } from './components/ui/TaskListItem';
import { taskStore } from './data/Task/stores/Tasks.store';

export const App = observer(() => {
  const { taskId } = useParams();

  const isCurrent = useCallback(
    (id: string) => {
      return id === taskId;
    },
    [taskId]
  );

  const topLevelTasks = [...taskStore.tasks.values()].filter(
    (t) => !taskStore.parentMap.has(t.id)
  );

  return (
    <main className="w-full h-dvh overflow-hidden grid grid-cols-2 bg-white dark:bg-black p-2">
      <div className="p-2 overflow-y-auto">
        <Accordion type="multiple">
          {topLevelTasks.map((t) => (
            <TaskListItem
              key={t.id}
              value={t.id}
              task={t}
              checkIfCurrent={isCurrent}
              className="font-semibold"
            />
          ))}
        </Accordion>
      </div>
      <div className="p-6 overflow-hidden bg-slate-200 dark:bg-slate-600 flex flex-col gap-2">
        <Outlet />
      </div>
    </main>
  );
});
