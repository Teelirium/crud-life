import { Task } from '@/data/Task/types';
import { Link } from 'react-router-dom';
import { AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

type TaskListItemProps = React.ComponentProps<typeof AccordionItem> & {
  task: Task;
};

export const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  ...props
}) => {
  const hasSubtasks = task.subtasks !== undefined && task.subtasks.length > 0;
  return (
    <AccordionItem {...props}>
      <AccordionTrigger
        disabled={!hasSubtasks}
        onClick={() => {
          console.log(task);
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
              className="font-normal"
            />
          ))}
        </AccordionContent>
      )}
    </AccordionItem>
  );
};
