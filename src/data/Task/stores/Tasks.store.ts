import { makeAutoObservable } from 'mobx';
import { Task, TaskFormData } from '../types';

function taskFromFormData(taskData: TaskFormData): Task {
  return {
    id: crypto.randomUUID(),
    subtasks: [],
    ...taskData,
  };
}

class TaskStore {
  tasks: Task[] = [
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
  ];

  constructor() {
    makeAutoObservable(this);
  }

  addTask(taskData: TaskFormData, parentId?: string) {
    const newTask = taskFromFormData(taskData);

    if (!parentId) {
      this.tasks.push(newTask);

      console.log(this.tasks);
      return;
    }

    const stack: Task[] = [...this.tasks];
    while (stack.length > 0) {
      const current = stack.pop() as Task;

      if (current.id === parentId) {
        if (!current.subtasks) {
          current.subtasks = [];
        }
        current.subtasks.push(newTask);
        break;
      }

      if (current.subtasks && current.subtasks.length > 0) {
        stack.push(...current.subtasks);
      }
    }
  }
}

export const taskStore = new TaskStore();
