import { taskStore } from '@/data/Task/stores/Tasks.store';
import { TaskFormData } from '@/data/Task/types';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useParams } from 'react-router-dom';
import { Input } from './ui/Input';
import { TextArea } from './ui/TextArea';

export const TaskView = observer(() => {
  const { taskId } = useParams();

  if (!taskId) {
    throw new Error(`Invalid task id: ${taskId}`);
  }

  const task = taskStore.tasks.get(taskId);
  const form = useForm<TaskFormData>({});

  const onSubmit = form.handleSubmit((data) => {});

  useEffect(() => {
    form.setValue('content', task ? task.content : '');
    form.setValue('title', task ? task.title : '');
  }, [task]);

  const [title, content] = form.watch(['title', 'content']);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (task) {
      timeout = setTimeout(() => {
        taskStore.editTask(task?.id, { title, content });
      }, 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [title, content]);

  if (!task) {
    console.error(`Task not found, id: ${taskId}`);
    return <Navigate to={'/'} replace />;
  }

  return (
    <form className="h-full flex flex-col gap-2" onSubmit={onSubmit}>
      <Input
        type="text"
        className="bg-transparent resize-none text-xl font-bold h-12"
        {...form.register('title')}
      />
      <TextArea
        className="bg-transparent resize-none flex-1"
        placeholder="..."
        {...form.register('content')}
      />
    </form>
  );
});
