import { makeAutoObservable } from 'mobx';
import { ID, Task, TaskFormData } from '../types';

/*
const _sampleTasks: Task[] = [
  {
    id: '1',
    title: 'task 1',
    content: 'task 1...',
    subtasks: [
      { id: '1.1', title: 'task 1.1', content: 'task 1.1...' },
      {
        id: '1.2',
        title: 'task 1.2',
        content: `task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...
          task 1.2...task 1.2...task 1.2...`,
      },
      { id: '1.3', title: 'task 1.3', content: 'task 1.3...' },
      {
        id: '1.4',
        title: 'task 1.4',
        content: 'task 1.4...',
        subtasks: [
          { id: '1.4.1', title: 'task 1.4.1', content: 'task 1.4.1...' },
          { id: '1.4.2', title: 'task 1.4.2', content: 'task 1.4.2...' },
          { id: '1.4.3', title: 'task 1.4.3', content: 'task 1.4.3...' },
        ],
      },
    ],
  },
];
*/

function taskFromFormData(taskData: TaskFormData): Task {
  return {
    id: crypto.randomUUID(),
    // subtasks: [],
    ...taskData,
  };
}

class TaskStore {
  tasks: Map<ID, Task> = new Map();
  childrenMap: Map<ID, ID[]> = new Map();
  parentMap: Map<ID, ID> = new Map();
  selected: Set<ID> = new Set();

  constructor() {
    makeAutoObservable(this);
  }

  addTask(taskData: TaskFormData, parentId?: string) {
    const newTask = taskFromFormData(taskData);

    if (!parentId) {
      this.tasks.set(newTask.id, newTask);

      console.log(this.tasks);
      return;
    }

    if (!this.tasks.has(parentId)) {
      throw new Error(
        `Could not add task: ${JSON.stringify(
          newTask
        )}; parent does not exist, id: ${parentId}`
      );
    }

    this.tasks.set(newTask.id, newTask);

    const children = this.childrenMap.get(parentId) ?? [];
    children.push(newTask.id);
    this.childrenMap.set(parentId, children);

    this.parentMap.set(newTask.id, parentId);

    console.log(this.tasks);
    return newTask;
  }

  isSelected(taskId: string) {
    return this.selected.has(taskId);
  }

  selectTask(taskId: string) {
    if (!this.isSelected(taskId)) {
      throw new Error(`Could not select task, it does not exist: ${taskId}`);
    }

    this.selected.add(taskId);

    const children = this.childrenMap.get(taskId);
    if (children && children.length > 0) {
      for (const child of children) {
        const isChildSelected = this.selected.has(child);
        if (!isChildSelected) {
          this.selectTask(child);
        }
      }
    }

    const parent = this.parentMap.get(taskId);
    if (parent) {
      const siblings = this.childrenMap.get(parent)!;
      if (
        siblings.every((t) => this.selected.has(t)) &&
        !this.selected.has(parent)
      ) {
        this.selectTask(parent);
      }
    }
  }

  deselectTask(taskId: string) {
    if (!this.tasks.has(taskId)) {
      throw new Error(`Could not deselect task, it does not exist: ${taskId}`);
    }

    const parent = this.parentMap.get(taskId);
    if (parent) {
      const siblings = this.childrenMap.get(parent)!;
      if (
        siblings.every((t) => this.selected.has(t)) &&
        this.selected.has(parent)
      ) {
        this.#deselectParents(parent);
      }
    }
    this.selected.delete(taskId);

    const children = this.childrenMap.get(taskId);
    if (children && children.length > 0) {
      for (const child of children) {
        const isChildSelected = this.selected.has(child);
        if (isChildSelected) {
          this.deselectTask(child);
        }
      }
    }
  }

  #deselectParents(taskId: string) {
    if (!this.tasks.has(taskId)) {
      throw new Error(`Could not deselect task, it does not exist: ${taskId}`);
    }

    const parent = this.parentMap.get(taskId);
    if (parent) {
      const siblings = this.childrenMap.get(parent)!;
      if (
        siblings.every((t) => this.selected.has(t)) &&
        this.selected.has(parent)
      ) {
        this.#deselectParents(parent);
      }
    }
    this.selected.delete(taskId);
  }
}

const taskStore = new TaskStore();

const sampleTasks = [
  {
    id: '1',
    title: 'task 1',
    content: 'task 1...',
  },
  { id: '1.1', title: 'task 1.1', content: 'task 1.1...' },
  {
    id: '1.2',
    title: 'task 1.2',
    content: `task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...
      task 1.2...task 1.2...task 1.2...`,
  },
  { id: '1.3', title: 'task 1.3', content: 'task 1.3...' },
  {
    id: '1.4',
    title: 'task 1.4',
    content: 'task 1.4...',
  },
  { id: '1.4.1', title: 'task 1.4.1', content: 'task 1.4.1...' },
  { id: '1.4.2', title: 'task 1.4.2', content: 'task 1.4.2...' },
  { id: '1.4.3', title: 'task 1.4.3', content: 'task 1.4.3...' },
];
const sampleChildren: [ID, ID[]][] = [
  ['1', ['1.1', '1.2', '1.3', '1.4']],
  ['1.4', ['1.4.1', '1.4.2', '1.4.3']],
];
const sampleParents: [ID, ID][] = [
  ['1.1', '1'],
  ['1.2', '1'],
  ['1.3', '1'],
  ['1.4', '1'],
  ['1.4.1', '1.4'],
  ['1.4.2', '1.4'],
  ['1.4.3', '1.4'],
];
taskStore.tasks = new Map(sampleTasks.map((t) => [t.id, t]));
taskStore.childrenMap = new Map(sampleChildren);
taskStore.parentMap = new Map(sampleParents);

export { taskStore };
