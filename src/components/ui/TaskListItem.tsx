import { taskStore } from '@/data/Task/stores/Tasks.store';
import { Task } from '@/data/Task/types';
import { cn } from '@/lib/utils';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';
import { Checkbox } from './Checkbox';

type TaskListItemProps = React.ComponentProps<typeof AccordionItem> & {
  task: Task;
  checkIfCurrent?: (id: string) => boolean;
  parent?: string;
};

export const TaskListItem: React.FC<TaskListItemProps> = observer(
  ({ task, checkIfCurrent, ...props }) => {
    // const hasSubtasks = task.subtasks !== undefined && task.subtasks.length > 0;
    const children = taskStore.childrenMap.get(task.id);
    const hasChildren = children !== undefined && children.length > 0;

    const current = checkIfCurrent ? checkIfCurrent(task.id) : false;

    return (
      <AccordionItem {...props}>
        <AccordionTrigger
          disabled={!hasChildren}
          className={cn(current ? 'bg-blue-100 hover:bg-blue-200' : '')}
        >
          <Link to={`/${task.id}`} className="h-full flex-1 flex items-center">
            {task.title}
          </Link>
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              taskStore.addTask(
                { title: task.title, content: task.content },
                props.parent
              );
            }}
          >
            test
          </button>
          <Checkbox
            checked={taskStore.selected.has(task.id)}
            onClick={() => {
              if (taskStore.selected.has(task.id)) {
                taskStore.deselectTask(task.id);
              } else {
                taskStore.selectTask(task.id);
              }
            }}
          />
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
                  checkIfCurrent={checkIfCurrent}
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
