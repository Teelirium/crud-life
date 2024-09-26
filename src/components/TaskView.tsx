import { taskStore } from '@/data/Task/stores/Tasks.store';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';

export const TaskView = observer(() => {
  const { taskId } = useParams();

  if (!taskId) {
    throw new Error(`Invalid task id: ${taskId}`);
  }

  const task = taskStore.findTask(taskId);
  return task.content;
});
