import {
  CirclePlus,
  Dices,
  LayoutList,
  ListChecks,
  Trash2,
} from 'lucide-react';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Accordion } from './components/ui/Accordion';
import { Button } from './components/ui/Button';
import {
  TaskListItem,
  TaskListItemContextProvider,
} from './components/ui/TaskListItem';
import {
  sampleChildren,
  sampleParents,
  sampleTasks,
} from './data/Task/stores/sampleTaskData';
import { taskStore } from './data/Task/stores/Tasks.store';
import { ID } from './data/Task/types';

export const App = observer(() => {
  const [openItems, setOpenItems] = useState<ID[]>([]);
  const openAccordionItem = useCallback((id: string) => {
    setOpenItems((prev) => {
      if (prev.includes(id)) {
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const { taskId } = useParams();
  const navigate = useNavigate();

  const isCurrent = useCallback(
    (id: string) => {
      return id === taskId;
    },
    [taskId]
  );

  const topLevelTasks = [...taskStore.tasks.values()].filter(
    (t) => !taskStore.parentMap.has(t.id)
  );

  useEffect(() => {
    taskStore.loadStore();
  }, []);

  return (
    <main className="w-full h-dvh overflow-hidden grid grid-cols-2 bg-slate-50 dark:bg-slate-800 p-2">
      <div className="p-2 overflow-y-auto flex flex-col gap-2">
        <div className="flex items-center justify-end gap-2 p-2 rounded-md bg-inherit shadow-md">
          <Button
            variant={'default'}
            size={'icon'}
            onClick={() => {
              const newTask = taskStore.addTask({
                title: `Task - ${new Date().toLocaleString()}`,
                content: '',
              });
              navigate(`/${newTask.id}`);
            }}
          >
            <CirclePlus />
          </Button>

          <Button
            variant={'secondary'}
            size={'icon'}
            onClick={() => {
              taskStore.selectAll();
            }}
          >
            <ListChecks />
          </Button>

          <Button
            variant={'secondary'}
            size={'icon'}
            onClick={() => {
              taskStore.deselectAll();
            }}
          >
            <LayoutList />
          </Button>

          <Button
            variant={'secondary'}
            size={'icon'}
            onClick={() => {
              runInAction(() => {
                taskStore.tasks = new Map(sampleTasks);
                taskStore.childrenMap = new Map(sampleChildren);
                taskStore.parentMap = new Map(sampleParents);
                taskStore.saveStore();
              });
            }}
          >
            <Dices />
          </Button>

          <Button
            key={'deleteBtn'}
            variant={taskStore.selected.size > 0 ? 'secondary' : 'ghost'}
            disabled={taskStore.selected.size === 0}
            size={'icon'}
            onClick={() => {
              const selectedTasks = [...taskStore.selected.values()];
              for (const task of selectedTasks) {
                if (taskStore.isSelected(task)) {
                  taskStore.deleteTask(task);
                }
              }
              taskStore.saveStore();
            }}
          >
            <Trash2 />
          </Button>
        </div>
        <Accordion
          type="multiple"
          className="shadow-md rounded-md overflow-clip"
          value={openItems}
          onValueChange={setOpenItems}
        >
          <TaskListItemContextProvider
            value={{ checkIfCurrent: isCurrent, openAccordionItem }}
          >
            {topLevelTasks.map((t) => (
              <TaskListItem
                key={t.id}
                value={t.id}
                task={t}
                className="font-semibold"
              />
            ))}
          </TaskListItemContextProvider>
        </Accordion>
      </div>
      <div className="p-6 overflow-hidden rounded-md text-slate-900 dark:text-slate-100 bg-slate-200 dark:bg-slate-600 flex flex-col gap-2">
        <Outlet />
      </div>
    </main>
  );
});
