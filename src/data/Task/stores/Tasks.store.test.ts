import { ID, Task } from '../types';
import { taskStore } from './Tasks.store';

describe('taskStore', () => {
  const sampleTasks: Task[] = [
    { id: 'task1', title: 'Task 1', content: 'Task 1' },
    { id: 'task1.1', title: 'Task 1.1', content: 'Task 1.1' },
    { id: 'task1.2', title: 'Task 1.2', content: 'Task 1.2' },
    { id: 'task1.1.1', title: 'Task 1.1.1', content: 'Task 1.1.1' },
    { id: 'task2', title: 'Task 2', content: 'Task 2' },
  ];

  const sampleChildren: [ID, ID[]][] = [
    ['task1', ['task1.1', 'task1.2']],
    ['task1.1', ['task1.1.1']],
  ];

  const sampleParents: [ID, ID][] = [
    ['task1.1', 'task1'],
    ['task1.2', 'task1'],
    ['task1.1.1', 'task1.1'],
  ];

  const log = console.log;

  beforeEach(() => {
    taskStore.tasks = new Map(sampleTasks.map((t) => [t.id, t]));
    taskStore.childrenMap = new Map(sampleChildren);
    taskStore.parentMap = new Map(sampleParents);
    taskStore.selected = new Set();

    // console.log = () => undefined;
  });

  afterEach(() => {
    console.log = log;
  });

  describe('deleteTask', () => {
    test('should delete task without a parent', () => {
      taskStore.deleteTask('task2');
      expect(taskStore.tasks.has('task2')).toBe(false);
    });

    test('should delete task with a parent', () => {
      taskStore.deleteTask('task1.2');

      expect(taskStore.tasks.has('task1')).toBe(true);
      expect(taskStore.tasks.has('task1.1')).toBe(true);
      expect(taskStore.tasks.has('task1.2')).toBe(false);

      expect(taskStore.parentMap.has('task1.2')).toBe(false);
      expect(taskStore.childrenMap.get('task1')).not.to.contain('task1.2');
    });

    test('should delete all children of a deleted task', () => {
      taskStore.deleteTask('task1');

      expect(taskStore.tasks.has('task1')).toBe(false);
      expect(taskStore.tasks.has('task1.1')).toBe(false);
      expect(taskStore.tasks.has('task1.1.1')).toBe(false);
      expect(taskStore.tasks.has('task1.2')).toBe(false);

      expect(taskStore.childrenMap.has('task1')).toBe(false);
    });

    test('should deselect deleted task', () => {
      taskStore.selectTask('task2');
      taskStore.deleteTask('task2');
      expect(taskStore.isSelected('task2')).toBe(false);
    });
  });

  describe('selectTask', () => {
    test('should select a task without children or parents', () => {
      taskStore.selectTask('task2');
      expect(taskStore.isSelected('task2')).toBe(true);
    });

    test('should select a task and all its children recursively', () => {
      taskStore.selectTask('task1.1');
      expect(taskStore.isSelected('task1.1')).toBe(true);
      expect(taskStore.isSelected('task1.1.1')).toBe(true);
    });

    test('should select a task and its parent if all siblings are selected', () => {
      taskStore.selectTask('task1.2');
      expect(taskStore.isSelected('task1.2')).toBe(true);
      expect(taskStore.isSelected('task1')).toBe(false);

      taskStore.selectTask('task1.1');
      expect(taskStore.isSelected('task1')).toBe(true);
      expect(taskStore.isSelected('task1.1')).toBe(true);
      expect(taskStore.isSelected('task1.2')).toBe(true);
    });

    test('should throw an error when selecting a nonexistent task', () => {
      expect(() => taskStore.selectTask('nonexistentTask')).toThrowError(
        'Could not select task, it does not exist: nonexistentTask'
      );
    });

    test('should deselect parent if a child is added', () => {
      taskStore.selectTask('task1');
      expect(taskStore.isSelected('task1')).toBe(true);

      const newTask = taskStore.addTask(
        {
          content: 'new task',
          title: 'new task',
        },
        'task1'
      );
      expect(taskStore.isSelected('task1')).toBe(false);
    });
  });

  describe('deselectTask', () => {
    test('should deselect a task without children or parents', () => {
      taskStore.selectTask('task2');
      taskStore.deselectTask('task2');
      expect(taskStore.selected.has('task2')).toBe(false);
    });

    test('should deselect a task and all its children recursively', () => {
      taskStore.selectTask('task1.1');
      taskStore.deselectTask('task1.1');
      expect(taskStore.selected.has('task1.1')).toBe(false);
      expect(taskStore.selected.has('task1.1.1')).toBe(false);
    });

    test('should deselect a task and its parent if all siblings are selected', () => {
      taskStore.selectTask('task1.1');
      taskStore.selectTask('task1.2');
      expect(taskStore.selected.has('task1')).toBe(true);

      taskStore.deselectTask('task1.1');
      expect(taskStore.selected.has('task1')).toBe(false);
      expect(taskStore.selected.has('task1.1')).toBe(false);
      expect(taskStore.selected.has('task1.2')).toBe(true);
    });

    test('should throw an error when deselecting a nonexistent task', () => {
      expect(() => taskStore.deselectTask('nonexistentTask')).toThrowError(
        'Could not deselect task, it does not exist: nonexistentTask'
      );
    });
  });
});
