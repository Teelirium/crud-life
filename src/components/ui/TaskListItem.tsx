import { taskStore } from '@/data/Task/stores/Tasks.store';
import { Task } from '@/data/Task/types';
import { cn } from '@/lib/utils';
import { CirclePlus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { createContext, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';
import { Button } from './Button';
import { Checkbox } from './Checkbox';

const TaskListItemContext = createContext<{
  checkIfCurrent?: (id: string) => boolean;
  openAccordionItem?: (id: string) => void;
}>({});

export const TaskListItemContextProvider = TaskListItemContext.Provider;

type TaskListItemProps = React.ComponentProps<typeof AccordionItem> & {
  task: Task;
  parent?: string;
};

export const TaskListItem: React.FC<TaskListItemProps> = observer(
  ({ task, ...props }) => {
    const { checkIfCurrent, openAccordionItem } =
      useContext(TaskListItemContext);

    const navigate = useNavigate();

    // const hasSubtasks = task.subtasks !== undefined && task.subtasks.length > 0;
    const children = taskStore.childrenMap.get(task.id);
    const hasChildren = children !== undefined && children.length > 0;

    const current = checkIfCurrent ? checkIfCurrent(task.id) : false;

    return (
      <AccordionItem {...props}>
        <AccordionTrigger
          disabled={!hasChildren}
          className={cn(current ? 'bg-blue-100 hover:bg-blue-200' : '', 'flex')}
        >
          <Link
            to={`/${task.id}`}
            className="h-full flex-1 flex items-center overflow-hidden text-ellipsis whitespace-nowrap"
          >
            {task.title}
          </Link>
          <div className="flex items-center p-2 gap-4">
            <Checkbox
              checked={taskStore.isSelected(task.id)}
              onClick={() => {
                if (taskStore.isSelected(task.id)) {
                  taskStore.deselectTask(task.id);
                } else {
                  taskStore.selectTask(task.id);
                }
              }}
            />
            <Button
              variant={'secondary'}
              size={'icon'}
              onClick={() => {
                const newTask = taskStore.addTask(
                  {
                    title: `Task - ${new Date().toLocaleString()}`,
                    content: '',
                  },
                  task.id
                );
                navigate(`/${newTask.id}`);
                if (openAccordionItem) {
                  openAccordionItem(task.id);
                }
              }}
            >
              <CirclePlus />
            </Button>
          </div>
        </AccordionTrigger>
        {hasChildren && (
          <AccordionContent className="pl-2">
            {children.map((id) => {
              const child = taskStore.tasks.get(id)!;
              return (
                <TaskListItem
                  key={child.id}
                  value={child.id}
                  task={child}
                  parent={task.id}
                  className="font-normal"
                />
              );
            })}
          </AccordionContent>
        )}
      </AccordionItem>
    );
  }
);
