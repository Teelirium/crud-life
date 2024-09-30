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
      this.saveStore();
      return newTask;
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
    this.saveStore();
    return newTask;
  }

  isSelected(taskId: string) {
    return this.selected.has(taskId);
  }

  selectAll() {
    for (const id of this.tasks.keys()) {
      this.selected.add(id);
    }
  }

  deselectAll() {
    for (const id of this.tasks.keys()) {
      this.selected.delete(id);
    }
  }

  selectTask(taskId: string) {
    if (!this.tasks.has(taskId)) {
      throw new Error(`Could not select task, it does not exist: ${taskId}`);
    }

    this.selected.add(taskId);

    const children = this.childrenMap.get(taskId);
    if (children && children.length > 0) {
      for (const child of children) {
        if (!this.isSelected(child)) {
          this.selectTask(child);
        }
      }
    }

    const parent = this.parentMap.get(taskId);
    if (parent) {
      const siblings = this.childrenMap.get(parent)!;
      if (
        siblings.every((t) => this.isSelected(t)) &&
        !this.isSelected(parent)
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
        siblings.every((t) => this.isSelected(t)) &&
        this.isSelected(parent)
      ) {
        this.#deselectParents(parent);
      }
    }
    this.selected.delete(taskId);

    const children = this.childrenMap.get(taskId);
    if (children && children.length > 0) {
      for (const child of children) {
        if (this.isSelected(child)) {
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
        siblings.every((t) => this.isSelected(t)) &&
        this.isSelected(parent)
      ) {
        this.#deselectParents(parent);
      }
    }
    this.selected.delete(taskId);
  }

  saveStore() {
    localStorage.setItem('tasks', JSON.stringify([...this.tasks.entries()]));
    localStorage.setItem(
      'children',
      JSON.stringify([...this.childrenMap.entries()])
    );
    localStorage.setItem(
      'parents',
      JSON.stringify([...this.parentMap.entries()])
    );
  }

  loadStore() {
    const tasks = localStorage.getItem('tasks');
    this.tasks = tasks ? new Map(JSON.parse(tasks)) : new Map();

    const children = localStorage.getItem('children');
    this.childrenMap = children ? new Map(JSON.parse(children)) : new Map();

    const parents = localStorage.getItem('parents');
    this.parentMap = parents ? new Map(JSON.parse(parents)) : new Map();
  }
}

const taskStore = new TaskStore();
export { taskStore };
