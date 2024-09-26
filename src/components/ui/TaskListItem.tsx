import { taskStore } from '@/data/Task/stores/Tasks.store';
import { Task } from '@/data/Task/types';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

type TaskListItemProps = React.ComponentProps<typeof AccordionItem> & {
  task: Task;
  parent?: string;
};

export const TaskListItem: React.FC<TaskListItemProps> = observer(
  ({ task, ...props }) => {
    const hasSubtasks = task.subtasks !== undefined && task.subtasks.length > 0;
    return (
      <AccordionItem {...props}>
        <AccordionTrigger
          disabled={!hasSubtasks}
          onClick={() => {
            console.log(task);
            taskStore.addTask(
              { title: task.title, content: task.content },
              props.parent
            );
          }}
        >
          <Link to={`/${task.id}`} className="h-full flex-1 flex items-center">
            {task.title}
          </Link>
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              console.log('btn');
            }}
          >
            test
          </button>
        </AccordionTrigger>
        {hasSubtasks && (
          <AccordionContent className="pl-2">
            {task.subtasks!.map((sub) => (
              <TaskListItem
                key={sub.id}
                value={sub.id}
                task={sub}
                parent={task.id}
                className="font-normal"
              />
            ))}
          </AccordionContent>
        )}
      </AccordionItem>
    );
  }
);
