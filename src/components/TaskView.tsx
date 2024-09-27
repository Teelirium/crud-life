import { taskStore } from '@/data/Task/stores/Tasks.store';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';

export const TaskView = observer(() => {
  const { taskId } = useParams();

  if (!taskId) {
    throw new Error(`Invalid task id: ${taskId}`);
  }

  const task = taskStore.tasks.get(taskId);

  if (!task) {
    throw new Error(`Task not found, id: ${taskId}`);
  }

  return (
    <>
      <h1 className="font-bold text-xl">{task.title}</h1>
      <p className="flex-1 overflow-y-auto">{task.content}</p>
    </>
  );
});
